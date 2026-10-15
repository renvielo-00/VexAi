# VexAi

VexAi é um app de demonstração feito com Expo + React Native que apresenta uma interface de chat para conectar um modelo de IA. O repositório contém a base do app (App.js, index.js, package.json, app.json) pronta para iniciar o desenvolvimento.

## O que tem neste repositório

- App.js — interface principal e comportamento do chat (modo demonstração).
- index.js — ponto de entrada do aplicativo (registro do componente raiz).
- package.json — dependências e scripts (expo, react, react-native, etc.).
- app.json — configurações do projeto Expo.

> Observação: a implementação atual mostra respostas de demonstração. Para gerar respostas reais, é necessário integrar um serviço de IA (ex.: OpenAI, Anthropic, outro modelo) por meio de uma API segura.

## Pré-requisitos

- Node.js (LTS recomendado)
- npm ou yarn
- Expo CLI (opcional, para rodar localmente com emuladores ou Expo Go)

Instale o Expo CLI globalmente (opcional):

npm install -g expo-cli

ou

yarn global add expo-cli

## Como rodar localmente

1. Instale dependências:

npm install

ou

yarn

2. Inicie o projeto:

npm start

ou

yarn start

3. Abra no dispositivo físico usando o app Expo Go (escaneie o QR code) ou emule no iOS/Android.

## Como integrar um modelo de IA (visão geral)

O app atualmente insere uma resposta mock após o envio de cada mensagem. Para conectar um modelo de IA real, você pode seguir duas abordagens recomendadas:

1. Backend seguro (recomendado)
   - Crie uma API no seu servidor que contenha a chave da API do provedor (ex.: OpenAI).
   - No app (cliente), envie a mensagem do usuário para sua API.
   - A API chama o modelo de IA e retorna a resposta para o app.

2. Chamada direta do cliente (somente em ambiente controlado)
   - Não é recomendado colocar chaves de API diretamente em apps móveis publicados.
   - Para testes locais, armazene a chave em um arquivo `.env` e use bibliotecas como `react-native-dotenv`, sabendo dos riscos.

Exemplo simples (fluxo):

- Usuário envia mensagem -> App faz POST para `/api/chat` no seu backend -> Backend chama o provedor de IA -> Backend retorna resposta -> App exibe a resposta.

## Próximos passos sugeridos

- Criar um pequeno backend (Node/Express, FastAPI, etc.) que encaminhe mensagens para o provedor de IA.
- Adicionar armazenamento local (AsyncStorage) para persistir conversas entre sessões.
- Adicionar autenticação/conta de usuário (opcional) se planeja multiusuário.
- Ajustar UI/UX e internacionalização.

Se quiser, eu posso:
- Atualizar o código para chamar uma API de backend de exemplo (Node/Express) e adicionar instruções e exemplos de código.
- Implementar integração direta com OpenAI (backend) e criar endpoints prontos para teste.
- Adicionar instruções para rodar via Expo e resolver problemas comuns.

Diga qual próximo passo você prefere que eu implemente agora.