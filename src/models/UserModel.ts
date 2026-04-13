import db from "../config/db";

export interface User {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  perfil: 'admin' | 'comprador' | 'vendedor';
  status: 'ativo' | 'inativo';
  codigo_verificacao?: string;
}

// Login e validação
export function findByEmail(email: string) {  
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
}

// criar o usuário
export function create(user: User) {
  const stmt = db.prepare(`
    INSERT INTO usuarios (nome, email, senha, perfil, status, codigo_verificacao) 
    VALUES (@nome, @email, @senha, @perfil, @status, @codigo_verificacao)
  `);
  return stmt.run(user);
}

// Lista usuários
export function getAll() {
  return db.prepare('SELECT id, nome, email, perfil, status FROM usuarios').all();
}

// Ação de desativar
export function setStatus(id: number, status: 'ativo' | 'inativo') {
  const stmt = db.prepare('UPDATE usuarios SET status = ? WHERE id = ?');
  return stmt.run(status, id);
}