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


























  return (
    <div className="container">
      <h1>Guia Turístico Interativo</h1>
      
    </div>
  );
}

export default App;
