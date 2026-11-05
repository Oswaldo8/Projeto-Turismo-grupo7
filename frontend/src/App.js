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
  const [view, setView] = useState('mapa'); // 'mapa', 'login', 'detalhes'
  const [detalhesLocal, setDetalhesLocal] = useState(null);
  
  // Estado para Paginação da Tabela de Locais
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

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
  const [novoComentario, setNovoComentario] = useState({ comentario: '', pontuacao: 5 });
  
  // Estado para o Filtro de Locais
  const [filtro, setFiltro] = useState('');

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

  // Carregar avaliações e detalhes de um local
  const carregarDetalhesLocal = async (id) => {
    try {
      const resposta = await axios.get(`${API_URL}/places/${id}`);
      setDetalhesLocal(resposta.data);
      setView('detalhes');
      window.scrollTo(0, 0);
    } catch (erro) {
      console.error('Erro ao carregar detalhes do local:', erro);
    }
  };

  // Enviar nova avaliação
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return alert('Faça login para enviar uma avaliação.');
    try {
      await axios.post(`${API_URL}/places/${detalhesLocal.id}/reviews`, {
        usuario_id: usuario.id,
        nome_usuario: usuario.nome,
        comentario: novoComentario.comentario,
        pontuacao: Number(novoComentario.pontuacao)
      });
      alert('Avaliação enviada com sucesso!');
      setNovoComentario({ comentario: '', pontuacao: 5 });
      carregarDetalhesLocal(detalhesLocal.id);
    } catch (erro) {
      console.error('Erro ao enviar avaliação:', erro);
      alert('Erro ao enviar avaliação.');
    }
  };

  // Gestão de Login e Registo
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const resposta = await axios.post(`${API_URL}${endpoint}`, loginForm);
      setUsuario(resposta.data);
      alert(isRegistering ? 'Usuário cadastrado com sucesso!' : `Bem-vindo(a), ${resposta.data.nome}!`);
      setLoginForm({ nome: '', email: '', senha: '' });
      setView('mapa');
    } catch (erro) {
      alert(erro.response?.data?.error || 'Erro na autenticação.');
    }
  };

  // Logout
  const handleLogout = () => {
    setUsuario(null);
    setView('mapa');
    alert('Sessão terminada com sucesso.');
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
      
      if (imagemFile && imagemFile.length > 0) {
        for (let i = 0; i < imagemFile.length; i++) {
          data.append('imagem', imagemFile[i]);
        }
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

  const handleEdit = (local) => {
    setEditId(local.id);
    setFormData({
      nome: local.nome,
      cidade: local.cidade,
      latitude: local.latitude,
      longitude: local.longitude,
      categoria: local.categoria
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ nome: '', cidade: '', latitude: '', longitude: '', categoria: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja eliminar este local?')) {
      try {
        await axios.delete(`${API_URL}/places/${id}`, { data: { usuario_id: usuario?.id } });
        carregarLocais();
      } catch (erro) {
        console.error('Erro ao eliminar local:', erro);
      }
    }
  };

  // Filtrar locais
  const locaisFiltrados = locais.filter((local) => 
    local.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    local.cidade.toLowerCase().includes(filtro.toLowerCase()) ||
    local.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  // Lógica de paginação
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const locaisPaginados = locaisFiltrados.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(locaisFiltrados.length / itensPorPagina);

  return (
    <div className="app-container">
      {/* Barra de Navegação Superior Fixa de Lado a Lado */}
      <header className="navbar-fixed">
        <h1 className="navbar-brand" onClick={() => { setView('mapa'); setDetalhesLocal(null); }}>
          📍 Guia Turístico Interativo
        </h1>
        <div className="navbar-user-section">
          {usuario ? (
            <div className="user-logged">
              <span>Olá, <strong>{usuario.nome}</strong></span>
              <button onClick={handleLogout} className="btn-logout" title="Terminar Sessão">
                🚪 Sair
              </button>
            </div>
          ) : (
            view !== 'login' && (
              <button onClick={() => setView('login')} className="btn-login-nav">
                🔑 Iniciar Sessão / Registar
              </button>
            )
          )}
          {view !== 'mapa' && (
            <button onClick={() => { setView('mapa'); setDetalhesLocal(null); }} className="btn-secondary-nav">
              🗺️ Voltar ao Mapa
            </button>
          )}
        </div>
      </header>

      {/* --- VISTA 1: DETALHES --- */}
      {view === 'detalhes' && detalhesLocal ? (
        <div className="main-content container-detalhes">
          <div className="detalhes-header-row">
            <button 
              onClick={() => { setView('mapa'); setDetalhesLocal(null); }} 
              className="btn-secondary"
            >
              ⬅️ Voltar ao Mapa
            </button>
            <span className="badge-categoria-top">
              🏷️ {detalhesLocal.categoria}
            </span>
          </div>

          <div className="card" style={{ padding: '25px', marginTop: '15px' }}>
            <div>
              <h1 style={{ marginTop: '5px', marginBottom: '10px' }}>{detalhesLocal.nome}</h1>
              <p style={{ margin: '5px 0' }}>📍 <strong>Cidade:</strong> {detalhesLocal.cidade}</p>
              <p style={{ margin: '5px 0 15px 0' }}>🌐 <strong>Coordenadas:</strong> {detalhesLocal.latitude}, {detalhesLocal.longitude}</p>
            </div>

            {/* Galeria de Fotos */}
            <div style={{ marginTop: '20px', marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>📸 Galeria de Fotos</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {detalhesLocal.imagens && detalhesLocal.imagens.length > 0 ? (
                  detalhesLocal.imagens.map((img, index) => (
                    <img
                      key={index}
                      src={`${API_URL}${img.image_url}`}
                      alt={detalhesLocal.nome}
                      style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    />
                  ))
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop"
                    alt={detalhesLocal.nome}
                    style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '10px' }}
                  />
                )}
              </div>
            </div>

            {/* Avaliações e Reviews */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h2>⭐ Avaliações e Reviews</h2>
              <div style={{ marginTop: '15px' }}>
                {detalhesLocal.reviews && detalhesLocal.reviews.length === 0 ? (
                  <p style={{ color: '#777' }}>Ainda não existem avaliações para este local. Sê o primeiro a avaliar!</p>
                ) : (
                  detalhesLocal.reviews.map((rev) => (
                    <div key={rev.id} style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>👤 {rev.nome_usuario} { '⭐'.repeat(rev.pontuacao) }</p>
                      <p style={{ margin: '5px 0 0 0', color: '#555' }}>"{rev.comentario}"</p>
                    </div>
                  ))
                )}
              </div>

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
                  🔒 <span style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }} onClick={() => setView('login')}>Faça login</span> para deixar uma avaliação sobre este ponto turístico.
                </p>
              )}
            </div>
          </div>
        </div>

      ) : view === 'login' ? (
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div className="card auth-card" style={{ maxWidth: '400px', width: '100%', padding: '30px' }}>
            <button onClick={() => setView('mapa')} className="btn-secondary" style={{ marginBottom: '15px' }}>
              ⬅️ Voltar ao Mapa
            </button>
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
              <button onClick={() => setIsRegistering(!isRegistering)} className="btn-toggle" style={{ marginTop: '15px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
                {isRegistering ? 'Já tem conta? Entre aqui' : 'Não tem conta? Cadastre-se'}
              </button>
            </div>
          </div>
        </div>

      ) : (
        <>
          {/* 1. MAPA PRIMERO (Full-Width) */}
          <div className="mapa-full-container">
            <MapContainer center={[-25.431, -49.271]} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locais.map((local) => (
                <Marker key={local.id} position={[parseFloat(local.latitude), parseFloat(local.longitude)]}>
                  <Popup>
                    <strong>{local.nome}</strong><br />
                    {local.cidade}<br />
                    <em>{local.categoria}</em><br />
                    <button 
                      onClick={() => carregarDetalhesLocal(local.id)} 
                      style={{ marginTop: '5px', padding: '4px 8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Ver Detalhes
                    </button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="main-content">
            {/* 2. DESPUÉS LA LISTA DE LOCALES CADASTRADOS */}
            <div className="card" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>📋 Locais Cadastrados</h2>
                <input 
                  type="text"
                  placeholder="🔍 Filtrar por nome, cidade ou categoria..."
                  value={filtro}
                  onChange={(e) => { setFiltro(e.target.value); setPaginaAtual(1); }}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', width: '280px', fontSize: '0.9em' }}
                />
              </div>

              {locaisPaginados.length === 0 ? (
                <p>Nenhum ponto turístico encontrado com esse filtro.</p>
              ) : (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Cidade</th>
                        <th>Coordenadas</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locaisPaginados.map((local) => (
                        <tr key={local.id}>
                          <td>{local.nome}</td>
                          <td>{local.cidade}</td>
                          <td>{local.latitude}, {local.longitude}</td>
                          <td>{local.categoria}</td>
                          <td className="actions-cell">
                            {usuario && (
                              <>
                                <button onClick={() => handleEdit(local)} className="btn-edit">
                                  Editar
                                </button>
                                <button onClick={() => handleDelete(local.id)} className="btn-delete">
                                  Eliminar
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => carregarDetalhesLocal(local.id)} 
                              className="btn-secondary"
                              style={{ marginLeft: '5px', padding: '4px 8px', fontSize: '0.85em' }}
                            >
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Controles de Paginação */}
                  {totalPaginas > 1 && (
                    <div className="pagination-container">
                      <button 
                        onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                        disabled={paginaAtual === 1}
                        className="btn-secondary"
                      >
                        ⬅️ Anterior
                      </button>
                      <span>Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong></span>
                      <button 
                        onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                        disabled={paginaAtual === totalPaginas}
                        className="btn-secondary"
                      >
                        Seguinte ➡️
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 3. POR ÚLTIMO, SECCIÓN DE CADASTRAR (Formulario si está logueado o Banner con botón al login si es visitante) */}
            <div className="card" style={{ marginBottom: '40px', marginTop: '25px' }}>
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

                    <div style={{ marginTop: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>Fotos do local (podes selecionar várias):</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple 
                        onChange={(e) => setImagemFile(e.target.files)} 
                        style={{ width: '100%', padding: '5px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                        {editId ? 'Atualizar Local' : 'Guardar Local'}
                      </button>
                      {editId && (
                        <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h2>➕ Cadastrar Novo Ponto Turístico</h2>
                  <p style={{ color: '#666', marginBottom: '20px', fontSize: '1.05em' }}>
                    Para cadastrar um novo ponto turístico é necessário estar logado na sua conta.
                  </p>
                  <button onClick={() => setView('login')} className="btn-primary" style={{ padding: '12px 25px', fontSize: '1em' }}>
                    🔑 Iniciar Sessão para Cadastrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;