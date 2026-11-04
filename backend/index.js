const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 5000;
const multer = require('multer');
const path = require('path');

// Configuraçao do almacenamento do Multer para las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Middlewares
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

// Conexao y Configuraçao da Base de Datos SQLite
const db = new sqlite3.Database('./turismo.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite com sucesso.');
  }
});

// Criaçao Tabelas (Usuarios, Lugares y /Reviews)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cidade TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      categoria TEXT NOT NULL,
      imagem_url TEXT,
      usuario_id INTEGER,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id INTEGER,
      usuario_id INTEGER,
      nome_usuario TEXT,
      comentario TEXT,
      pontuacao INTEGER,
      FOREIGN KEY(place_id) REFERENCES places(id)
    )
      `);
  db.run(`
    CREATE TABLE IF NOT EXISTS place_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        place_id INTEGER,
        image_url TEXT,
        FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
    )
`);
  });
      // Registro Usuário
app.post('/auth/register', (req, res) => {
  const { nome, email, senha } = req.body;
  const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
  
  db.run(sql, [nome, email, senha], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Erro ao cadastrar usuário ou e-mail já existente.' });
    }
    res.status(201).json({ id: this.lastID, nome, email });
  });
});

// Login Usuário
app.post('/auth/login', (req, res) => {
  const { email, senha } = req.body;
  const sql = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;

  db.get(sql, [email, senha], (err, row) => {
    if (err || !row) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    res.json({ id: row.id, nome: row.nome, email: row.email });
  });
});

// Listar todos os lugares
app.get('/places', (req, res) => {
    const { nome } = req.query;
    let sql = 'SELECT * FROM places';
    let params = [];

    if (nome) {
        sql += ' WHERE LOWER(nome) LIKE LOWER(?)';
        params.push(`%${nome}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Cadastrar novo lugar com imagem (Multer)
app.post('/places', upload.single('imagem'), (req, res) => {
  const { nome, cidade, latitude, longitude, categoria, usuario_id } = req.body;
  // Verifica se já existe um local com o mesmo nome na mesma cidade
  const checkSql = `SELECT * FROM places WHERE LOWER(nome) = LOWER(?) AND LOWER(cidade) = LOWER(?)`;
  
  db.get(checkSql, [nome, cidade], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.status(400).json({ error: 'Este ponto turístico já está registrado nesta cidade!' });
    }

    // Se não existir, prossegue com o insert normal
    const imagem_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
    const insertSql = `INSERT INTO places (nome, cidade, latitude, longitude, categoria, imagem_url, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(
      insertSql,
      [nome, cidade, latitude, longitude, categoria, imagem_url, usuario_id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, nome, cidade, latitude, longitude, categoria, imagem_url, usuario_id });
      }
    );
  });
});

// Atualizar lugar (com suporte a alteração opcional de imagem)
app.put('/places/:id', upload.single('imagem'), (req, res) => {
  const { id } = req.params;
  const { nome, cidade, latitude, longitude, categoria } = req.body;

 // 1. Primeiro buscamos o lugar para verificar quem é o propietario
  db.get(`SELECT * FROM places WHERE id = ?`, [id], (err, place) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!place) {
      return res.status(404).json({ error: 'Ponto turístico não encontrado.' });
    }

    // 2. Verificamos se o usuario atual é o dono do registro
    if (place.usuario_id !== Number(usuario_id)) {
      return res.status(403).json({ error: 'Apenas o usuário que cadastrou este local pode editá-lo!' });
    }

    // 3. Se é o dono, procedemos a atualizar com ou sem imagem
    if (req.file) {
      const imagem_url = `http://localhost:5000/uploads/${req.file.filename}`;
      const sql = `UPDATE places SET nome = ?, cidade = ?, latitude = ?, longitude = ?, categoria = ?, imagem_url = ? WHERE id = ?`;
      
      db.run(sql, [nome, cidade, latitude, longitude, categoria, imagem_url, id], function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Local atualizado com sucesso!', imagem_url });
      });
  } else {
    const sql = `UPDATE places SET nome = ?, cidade = ?, latitude = ?, longitude = ?, categoria = ? WHERE id = ?`;
    
    db.run(sql, [nome, cidade, latitude, longitude, categoria, id], function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: 'Local atualizado com sucesso!' });
    });
  }
  });
});

// Deletar lugar
app.delete('/places/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM places WHERE id = ?`;

 //  procuramos o ponto para verificar o usuário que o cadastrou
  db.get(`SELECT * FROM places WHERE id = ?`, [id], (err, place) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!place) {
      return res.status(404).json({ error: 'Ponto turístico não encontrado.' });
    }

    // 2. Verificamos se coincide o criador
    if (place.usuario_id !== Number(usuario_id)) {
      return res.status(403).json({ error: 'Apenas o usuário que cadastrou este local pode excluí-lo!' });
    }

    // Se for o criador, deletamos
    const sql = `DELETE FROM places WHERE id = ?`;
    db.run(sql, id, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: 'Local removido com sucesso!', id });
    });
  });
});


// Obter todas as avaliações de um ponto turístico específico
app.get('/places/:id/reviews', (req, res) => {
  const placeId = req.params.id;
  db.all(`SELECT * FROM reviews WHERE place_id = ?`, [placeId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Adicionar uma nova avaliação a um ponto turístico
app.post('/places/:id/reviews', (req, res) => {
  const placeId = req.params.id;
  const { usuario_id, nome_usuario, comentario, pontuacao } = req.body;

  db.run(
    `INSERT INTO reviews (place_id, usuario_id, nome_usuario, comentario, pontuacao) VALUES (?, ?, ?, ?, ?)`,
    [placeId, usuario_id, nome_usuario, comentario, pontuacao || 5],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        id: this.lastID, 
        place_id: placeId, 
        usuario_id, 
        nome_usuario, 
        comentario, 
        pontuacao: pontuacao || 5 
      });
    }
  );
});

// Initiar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});

