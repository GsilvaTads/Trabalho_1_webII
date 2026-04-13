import { Request, Response, NextFunction } from 'express';
import * as LogModel from '../models/LogModel';

export const auditLog = (req: Request, res: Response, next: NextFunction) => {
  // ações que alteram dados
  if (req.method !== 'GET') {
    // resposta processada
    res.on('finish', () => {
      const usuarioId = req.session.user?.id || null;
      const metodo = req.method;
      const rota = req.originalUrl;
      const acao = `Executou ${metodo} em ${rota}`;

      LogModel.saveLog(usuarioId, metodo, rota, acao);
    });
  }
  next();
};