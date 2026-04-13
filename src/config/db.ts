// npm i better-sqlite3
// npm i --save-dev @types/better-sqlite3

import Database from 'better-sqlite3';

const db = new Database('banco.db', {
    verbose: console.log,
    timeout: 10000
});

// Ativa o suporte a Chaves Estrangeiras (importante para o Log referenciar o Usuário)
db.pragma('foreign_keys = ON');

/**
 * Inicialização das Tabelas Obrigatórias
 */
db.exec(`
  -- Tabela de Usuários (Requisitos 1, 3, 4 e 5)
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    perfil TEXT CHECK(perfil IN ('admin', 'comprador', 'vendedor')) NOT NULL,
    status TEXT CHECK(status IN ('ativo', 'inativo')) DEFAULT 'inativo',
    codigo_verificacao TEXT,
    expiracao_codigo DATETIME
  );

  -- Tabela de Logs de Auditoria (Requisito 6)
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    metodo TEXT NOT NULL,
    rota TEXT NOT NULL,
    acao TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
  );

  -- Tabela legada do seu projeto anterior (opcional manter)
  CREATE TABLE IF NOT EXISTS pessoas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    hobbies TEXT
  );
`);

export default db;
