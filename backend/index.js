const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Multer para carregas a imagens 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do Multer para armazenar as imagens 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = storage ? multer({ storage: storage }) : multer({ dest: 'uploads/' });