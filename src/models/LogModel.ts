import db from "../config/db";

export function saveLog(usuario_id: number | null, metodo: string, rota: string, acao: string) {
  const stmt = db.prepare(`
    INSERT INTO logs (usuario_id, metodo, rota, acao, data_hora) 
    VALUES (?, ?, ?, ?, DATETIME('now'))
  `);
  stmt.run(usuario_id, metodo, rota, acao);
}