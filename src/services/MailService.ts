import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: 'seu_usuario_ethereal', 
    pass: 'sua_senha_ethereal',
  },
});

export const sendActivationEmail = async (to: string, code: string) => {
  await transporter.sendMail({
    from: '"MarketMVP" <noreply@marketmvp.com>',
    to: to,
    subject: "Seu código de ativação",
    text: `Olá! Seu código de ativação é: ${code}`,
    html: `<b>Olá!</b><br>Seu código de ativação é: <h2>${code}</h2>`,
  });
};