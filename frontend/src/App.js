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


    




)}
          </div>
        </>
      )}
    </div>
  );
}
export default App;
