import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as UserModel from '../models/UserModel';

interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  perfil: 'admin' | 'comprador' | 'vendedor';
  status: 'ativo' | 'inativo';
  codigo_verificacao: string;
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body; 

  try {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.render('login', { error: 'Utilizador não encontrado.' });
    }

    
    console.log("DEBUG LOGIN:", { 
      emailRecebido: email, 
      existeNoBanco: !!user, 
      senhaNoBanco: user.senha ? "Presente" : "Ausente" 
    });

    
    const passwordMatch = await bcrypt.compare(password, user.senha); 

    if (passwordMatch) {
      
      req.session.user = {
        id: user.id,
        name: user.nome,   
        role: user.perfil, 
        status: user.status
      };

      
      if (user.perfil === 'admin') {
        return res.redirect('/admin-dashboard');
      }
      return res.redirect('/');
      
    } else {
      return res.render('login', { error: 'Senha incorreta.' });
    }
  } catch (err) {
    console.error("Erro no processo de login:", err);
    res.status(500).render('login', { error: 'Erro interno ao processar o login.' });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { nome, email, password, perfil } = req.body;

  try {
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Salvar no banco como inativo e gerar código
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    UserModel.create({
      nome,
      email,
      senha: hashedPassword,
      perfil,
      status: 'inativo',
      codigo_verificacao: codigo
    });

    // mostra código ativacao
    console.log(`\n>>> [REQUISITO 5] CÓDIGO DE ATIVAÇÃO PARA ${email}: ${codigo} <<<\n`);

    res.render('login', { success: 'Cadastro realizado! Use o código enviado para ativar sua conta.' });
  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'Erro ao cadastrar. E-mail já pode estar em uso.' });
  }
};

// Admin ativar/desativar usuários
export const toggleStatus = async (req: Request, res: Response) => {
  const { userId, currentStatus } = req.body;
  
  try {
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
    UserModel.setStatus(Number(userId), newStatus);
    
    // Redireciona de volta painel
    res.redirect('/admin-dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao alterar status do usuário.");
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  const { email, codigo } = req.body;
  try {
    const user = await UserModel.findByEmail(email) as User;

    // Verifica usuário e código no banco com o digitado
    if (user && user.id && user.codigo_verificacao === codigo) {
      UserModel.setStatus(user.id, 'ativo'); // Muda de inativo para ativo
      return res.render('login', { success: 'Conta ativada! Agora você pode fazer login.' });
    } else {
      return res.render('verify', { error: 'Código ou e-mail inválido.' });
    }
  } catch (err) {
    res.status(500).send("Erro ao processar ativação.");
  }
};
