# Trabalho 1 - WebII - Gustavo Silva

## Instruções de Instalação e Execução

1. Clonar ou Baixar o Repositório: https://github.com/GsilvaTads/Trabalho_1_webII

2. No terminal, dentro da pasta do projeto, execute:

   npm install
   npm run dev

3. Colar no navegador o link: http://localhost:3333/login

## Usuarios de teste (incluindo admin)

1. Acessar com o usuário:

   Email: teste@email.com
   Senha: 123

** este dará acesso ao painel de usuários(senha 123 para todos)

2. Cadastrar novos usuários use o link: http://localhost:3333/signup

3. No terminal copiar o código de verificação e colar no link: http://localhost:3333/verify

4. Usar o link http://localhost:3333/login para logar após verificação

## 	Descricao resumida das funcionalidades implementadas: 

1. Gestão de Usuários: Interface para o Admin para ativar/desativar contas.

2. Auditoria: Registro de logs de ações realizadas no sistema.

3. Middlewares de Segurança: Proteção de rotas para garantir que apenas Admins acessem o painel de controle e logs.

4. Banco de Dados: Uso de SQLite para persistência simples e sem necessidade de configuração de servidores externos.
