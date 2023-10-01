# SOFT - Sistema de Reserva de Salas

## Como rodar:

- Com Docker

```
docker compose up --build -d
```

- Sem Docker (Manualmente)
```
# Terminal 1
cd backend
npm i
node src/server.js

# Terminal 2
cd frontend
npm i
npm start
```

_Em ambos o client irá rodar no 0.0.0.0:3000 e o server no 0.0.0.0:8080_

## User Stories:

- O usuário consegue se cadastrar
- O administrador consegue se cadastrar
- O usuário e administrador consegue logar
- As senhas são protegidas por JWT
- O usuário consegue visualizar as salas
- O administrador consegue cadastrar novas salas


### Limitações

1. Por se tratar de um projeto fictício, não implementei uma forma segura de autorizar um usuário administrador. Basta um usuário marcar a opção "Sou administrador" na tela de registro para que o mesmo tenha acesso á área administrativa.
2. Já que estou usando o LocalStorage para armazenar o JWT, não é indicado pôr este sistema fictício em produção para evitar ataques do tipo XSS. Deve ser implementado uma forma mais segura como CSP ou libs como DOMPurify.
3. Não foi implementado um sistema de BlackListToken, ou seja, não é possível deslogar (no back-end) um usuário.


# to do (tech):
    - [ ] Change sqlite to other db
    - [ ] Change SOFT_SECRET_KEY jwt in users.js to env file
    - [ ] Implementar middleware para checar se é de fato um adm que está requisitando (via back invés de limitar apenas no front)