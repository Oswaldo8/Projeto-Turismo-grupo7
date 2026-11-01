import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Corrigir ícones do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const API_URL = 'http://localhost:5000';
  const [locais, setLocais] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  
  // Estado para Formulário de Login/Registo
  const [loginForm, setLoginForm] = useState({ nome: '', email: '', senha: '' });
  const [isRegistering, setIsRegistering] = useState(false);

  // Estado para Criar / Editar Ponto Turístico
  const [formData, setFormData] = useState({
    nome: '',
    cidade: '',
    latitude: '',
    longitude: '',
    categoria: ''
  });
  const [imagemFile, setImagemFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [novoComentario, setNovoComentario] = useState({ comentario: '', pontuacao: 5 });
  // Carregar lista de pontos turísticos
  const carregarLocais = async () => {
    try {
      const resposta = await axios.get(`${API_URL}/places`);
      setLocais(resposta.data);
    } catch (erro) {
      console.error('Erro ao carregar locais:', erro);
    }
  };

useEffect(() => {
    carregarLocais();
  }, []);
// Carregar avaliações de um local
  const carregarReviews = async (placeId) => {
    try {
      const resposta = await axios.get(`${API_URL}/places/${placeId}/reviews`);
      setReviews(resposta.data);
    } catch (erro) {
      console.error('Erro ao carregar avaliações:', erro);
    }
  };

  // Enviar nova avaliação
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return alert('Faça login para enviar uma avaliação.');
    try {
      await axios.post(`${API_URL}/places/${localSelecionado.id}/reviews`, {
        usuario_id: usuario.id,
        nome_usuario: usuario.nome,
        comentario: novoComentario.comentario,
        pontuacao: Number(novoComentario.pontuacao)
      });
      alert('Avaliação enviada com sucesso!');
      setNovoComentario({ comentario: '', pontuacao: 5 });
      carregarReviews(localSelecionado.id);
    } catch (erro) {
      console.error('Erro ao enviar avaliação:', erro);
      alert('Erro ao enviar avaliação.');
    }
  };

  useEffect(() => {
    if (localSelecionado) {
      carregarReviews(localSelecionado.id);
    }
  }, [localSelecionado]);
  // Gestão de Login e Registo
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const resposta = await axios.post(`${API_URL}${endpoint}`, loginForm);
      setUsuario(resposta.data);
      alert(isRegistering ? 'Usuário cadastrado com sucesso!' : `Bem-vindo(a), ${resposta.data.nome}!`);
      setLoginForm({ nome: '', email: '', senha: '' });
    } catch (erro) {
      alert(erro.response?.data?.error || 'Erro na autenticação.');
    }
  };

  // Guardar ou Editar Local
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('nome', formData.nome);
      data.append('cidade', formData.cidade);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      data.append('categoria', formData.categoria);
      data.append('usuario_id', usuario ? usuario.id : null);
      
      if (imagemFile) {
        data.append('imagem', imagemFile);
      }

      if (editId) {
        await axios.put(`${API_URL}/places/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Ponto turístico atualizado!');
        setEditId(null);
      } else {
        await axios.post(`${API_URL}/places`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Ponto turístico cadastrado com sucesso!');
      }

      setFormData({ nome: '', cidade: '', latitude: '', longitude: '', categoria: '' });
      setImagemFile(null);
      carregarLocais();
    } catch (erro) {
      console.error('Erro ao salvar local:', erro);
    }
  };
  // Preencher formulário para Editar
  const handleEdit = (local) => {
    setEditId(local.id);
    setFormData({
      nome: local.nome,
      cidade: local.cidade,
      latitude: local.latitude,
      longitude: local.longitude,
      categoria: local.categoria
    });
  };

  // Cancelar Edição
  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ nome: '', cidade: '', latitude: '', longitude: '', categoria: '' });
  };

  // Eliminar local
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja eliminar este local?')) {
      try {
        await axios.delete(`${API_URL}/places/${id}`);
        carregarLocais();
      } catch (erro) {
        console.error('Erro ao eliminar local:', erro);
      }
    }
  };

   return (
    
    <div className="container">
      <h1>📍 Guia Turístico Interativo</h1>

      {/* Secção de Autenticação */}
      <div className="card auth-card">
        {usuario ? (
          <div className="user-info">
            <p>Sessão iniciada como: <strong>{usuario.nome}</strong> ({usuario.email})</p>
            <button onClick={() => setUsuario(null)} className="btn-secondary">Sair</button>
          </div>
        ) : (
          <div>
            <h2>{isRegistering ? 'Cadastrar Usuário' : 'Iniciar Sessão'}</h2>
            <form onSubmit={handleAuthSubmit} className="form-auth">
              {isRegistering && (
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={loginForm.nome}
                  onChange={(e) => setLoginForm({ ...loginForm, nome: e.target.value })}
                  required
                />
              )}
              <input
                type="email"
                placeholder="E-mail"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={loginForm.senha}
                onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
                required
              />
              <button type="submit">{isRegistering ? 'Cadastrar' : 'Entrar'}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)} className="btn-toggle">
              {isRegistering ? 'Já tem conta? Entre aqui' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        )}
      </div>
      {localSelecionado ? (
        /* VISTA DE DETALHES */
        <div className="card" style={{ padding: '25px', marginTop: '20px' }}>
          <button 
            onClick={() => setLocalSelecionado(null)} 
            className="btn-secondary"
            style={{ marginBottom: '20px', cursor: 'pointer' }}
          >
            ⬅️ Voltar à lista de locais
          </button>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <span style={{ background: '#007bff', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>
                {localSelecionado.categoria}
              </span>
              <h1 style={{ marginTop: '10px' }}>{localSelecionado.nome}</h1>
              <p>📍 <strong>Cidade:</strong> {localSelecionado.cidade}</p>
              <p>🌐 <strong>Coordenadas:</strong> {localSelecionado.latitude}, {localSelecionado.longitude}</p>

              <div style={{ marginTop: '15px' }}>
                <h3>📸 Galeria de Fotos</h3>
                <img 
                  src={localSelecionado.imagem_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop"} 
                  alt={localSelecionado.nome} 
                  style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                />
              </div>
            </div>

<div style={{ flex: '1', minWidth: '300px', borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
              <h2>⭐ Avaliações e Reviews</h2>

              {/* Lista dinâmica de avaliações vinda da base de dados */}
              <div style={{ marginTop: '15px' }}>
                {reviews.length === 0 ? (
                  <p style={{ color: '#777' }}>Ainda não existem avaliações para este local. Sê o primeiro a avaliar!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>👤 {rev.nome_usuario} { '⭐'.repeat(rev.pontuacao) }</p>
                      <p style={{ margin: '5px 0 0 0', color: '#555' }}>"{rev.comentario}"</p>
                    </div>
                  ))
                )}
              </div>

              {/* Formulário ligado ao handleReviewSubmit */}
              {usuario ? (
                <div style={{ marginTop: '20px', background: '#e9ecef', padding: '15px', borderRadius: '8px' }}>
                  <h4>Deixe a sua avaliação</h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ marginRight: '10px', fontSize: '0.9em' }}>Classificação:</label>
                      <select 
                        value={novoComentario.pontuacao}
                        onChange={(e) => setNovoComentario({ ...novoComentario, pontuacao: e.target.value })}
                        style={{ padding: '5px', borderRadius: '4px' }}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                        <option value="4">⭐⭐⭐⭐ (4)</option>
                        <option value="3">⭐⭐⭐ (3)</option>
                        <option value="2">⭐⭐ (2)</option>
                        <option value="1">⭐ (1)</option>
                      </select>
                    </div>
                    <textarea 
                      placeholder="Escreva o seu comentário sobre este local..." 
                      rows="3" 
                      value={novoComentario.comentario}
                      onChange={(e) => setNovoComentario({ ...novoComentario, comentario: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
                      required
                    />
                    <button type="submit" className="btn-primary">
                      Enviar Avaliação
                    </button>
                  </form>
                </div>
              ) : (
                <p style={{ color: '#777', fontSize: '0.9em', marginTop: '15px' }}>
                  🔒 Faça login para deixar uma avaliação sobre este ponto turístico.
                </p>
              )}
            </div>
          </div>
        </div>  
      ) : (
        <>
          {/* Formulário de Cadastro / Edição */}
          <div className="card">
            {usuario ? (
              <>
                <h2>{editId ? '✏️ Editar Ponto Turístico' : '➕ Cadastrar Novo Ponto Turístico'}</h2>
                <form onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    placeholder="Nome do local" 
                    value={formData.nome} 
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })} 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Cidade" 
                    value={formData.cidade} 
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })} 
                    required 
                  />
                  <input 
                    type="number" 
                    step="any" 
                    placeholder="Latitude" 
                    value={formData.latitude} 
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} 
                    required 
                  />
                  <input 
                    type="number" 
                    step="any" 
                    placeholder="Longitude" 
                    value={formData.longitude} 
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} 
                    required 
                  />
                  <select 
                    value={formData.categoria} 
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    required
                  >
                    <option value="">Selecione a categoria...</option>
                    <option value="Parque">Parque</option>
                    <option value="Museu">Museu</option>
                    <option value="Monumento">Monumento</option>
                    <option value="Praia">Praia</option>
                    <option value="Trilha">Trilha</option>
                  </select>

                  <button type="submit">
                    {editId ? 'Atualizar Local' : 'Guardar Local'}
                  </button>
                  
                  {editId && (
                    <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                      Cancelar
                    </button>
                  )}
                  <div style={{ marginBottom: '10px' }}>
                 <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>Foto do local:</label>
                  <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImagemFile(e.target.files[0])} 
                  style={{ width: '100%', padding: '5px' }}
                  />
                 </div>
                </form>
              </>
              
            ) : 

)}
          </div>
        </>
      )}
    </div>
  );
}
export default App;
