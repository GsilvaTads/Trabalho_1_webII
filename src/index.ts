import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Response, Request } from 'express';
import session from 'express-session';
import * as PersonController from './controllers/PersonController';
import * as AuthController from './controllers/AuthController';
import { isAdmin } from './middleware/isAdmin';
import { auditLog } from './middleware/auditLog';
import * as UserModel from './models/UserModel';
import db from './config/db';

// inicia app
const app = express();
const port = process.env.PORT || 3333;

// interface da sessao
declare module 'express-session' {
  interface SessionData {
    urls: string[];
    user?: {
      id: number;
      name: string;
      role: 'admin' | 'comprador' | 'vendedor';
      status: string;
    };
  }
}

// Template Engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Middlewares
app.use(express.urlencoded({ extended: true }));

// Config Sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-secreta-padrao',
  resave: false,
  saveUninitialized: false,
}));

// Middleware de Auditoria
app.use(auditLog);

// Middleware de rastreio de URLs
app.use((req, res, next) => {
  req.session.urls = req.session.urls || [];
  req.session.urls.push(req.url);
  next();
});

// Rotas de views

app.get('/', PersonController.index);

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login');
});

app.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('signup');
});

// Rota do Painel Administrativo 
app.get('/admin-dashboard', isAdmin, (req, res) => {
  const lista = UserModel.getAll(); 
  res.render('admin-dashboard', { usuarios: lista }); 
});

// Rota de acao

// Cadastro
app.post('/auth/signup', AuthController.signup);

// Login
app.post('/auth/login', AuthController.login);

// Ativar/Desativar Usuário
app.post('/auth/toggle-status', isAdmin, AuthController.toggleStatus);

// Rota de Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.post('/people', isAdmin, PersonController.create);

// ini servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Rota tela
app.get('/verify', (req, res) => res.render('verify'));

// Rota formulário
app.post('/auth/verify', AuthController.verifyCode);

app.get('/admin/logs', isAdmin, (req, res) => {
  // Busca os logs
  const logs = db.prepare('SELECT * FROM logs ORDER BY data_hora DESC').all();
  res.render('logs', { logs });
});