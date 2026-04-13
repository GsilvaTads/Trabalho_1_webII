import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Verifica se o usuário está logado e se é administrador
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }

  
  return res.status(403).send("Acesso negado. Esta funcionalidade requer privilégios de administrador.");
};