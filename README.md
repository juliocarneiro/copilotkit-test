# 📝 AI Todo App

Aplicação de gerenciamento de tarefas com **Inteligência Artificial** usando CopilotKit.

![Next.js](https://img.shields.io/badge/Next.js-15.1-black)
![React](https://img.shields.io/badge/React-19-blue)
![CopilotKit](https://img.shields.io/badge/CopilotKit-1.50-purple)
![Ant Design](https://img.shields.io/badge/Ant%20Design-6.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

## ✨ Features

- 🤖 **Chat com IA** - Gerencie tarefas conversando naturalmente
- 📝 **CRUD de Tarefas** - Adicionar, completar, remover tarefas
- 🎯 **Actions Inteligentes** - IA executa ações automaticamente
- 🔍 **Contexto Compartilhado** - IA "vê" suas tarefas em tempo real
- 🎨 **UI Moderna** - Ant Design v6 com visual elegante
- ⚡ **Performance** - Next.js 15 com Turbopack

## 🚀 Quick Start

### 1. Instalar dependências

```bash
yarn install
# ou
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local`:

```env
OPENAI_API_KEY=sk-sua-chave-aqui
```

### 3. Rodar o projeto

```bash
yarn dev
# ou
npm run dev
```

Acesse: **http://localhost:3000**

## 💬 Como Usar

Interaja com o chat lateral usando comandos naturais:

| Comando | Ação |
|---------|------|
| "Adicione comprar pão" | Cria nova tarefa |
| "Marque a tarefa 1 como concluída" | Completa tarefa |
| "Remova a tarefa 2" | Deleta tarefa |
| "Quais tarefas tenho?" | Lista tarefas |
| "Limpe as concluídas" | Remove todas concluídas |

## 📦 Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| [Next.js](https://nextjs.org) | 15.1 | Framework React |
| [React](https://react.dev) | 19 | UI Library |
| [CopilotKit](https://copilotkit.ai) | 1.50 | IA Conversacional |
| [Ant Design](https://ant.design) | 6.0 | Componentes UI |
| [OpenAI](https://openai.com) | gpt-4o-mini | Modelo de IA |
| [TypeScript](https://typescriptlang.org) | 5.7 | Tipagem |

## 🏗️ Estrutura do Projeto

```
├── app/
│   ├── api/
│   │   └── copilotkit/
│   │       └── route.ts       # Backend CopilotKit
│   ├── layout.tsx             # Layout com AntdRegistry
│   ├── page.tsx               # Página principal
│   └── globals.css
├── components/
│   └── TodoApp.tsx            # App de tarefas com Actions
├── .env.local                 # Variáveis de ambiente
└── COPILOTKIT_IMPLEMENTATION.md  # Documentação detalhada
```

## 🔧 CopilotKit - Hooks Utilizados

### `useCopilotReadable`
Compartilha dados com a IA:

```typescript
useCopilotReadable({
  description: "Lista de tarefas",
  value: JSON.stringify(todos)
});
```

### `useCopilotAction`
Define ações que a IA pode executar:

```typescript
useCopilotAction({
  name: "addTodo",
  description: "Adiciona tarefa",
  parameters: [{ name: "text", type: "string", required: true }],
  handler: ({ text }) => {
    // Lógica aqui
  }
});
```

## 📚 Documentação

- [Implementação CopilotKit](./COPILOTKIT_IMPLEMENTATION.md) - Guia detalhado
- [CopilotKit Docs](https://docs.copilotkit.ai)
- [CopilotKit v1.50](https://docs.copilotkit.ai/whats-new/v1-50)
- [Ant Design v6](https://ant.design)
- [Next.js Docs](https://nextjs.org/docs)

## 📄 Licença

MIT
