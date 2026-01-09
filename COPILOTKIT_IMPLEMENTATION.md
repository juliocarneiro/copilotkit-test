# Implementação do CopilotKit

Este documento detalha a implementação do CopilotKit v1.50 neste projeto de Todo App com IA.

## 📦 Dependências

```json
{
  "@copilotkit/react-core": "^1.50.0",
  "@copilotkit/react-ui": "^1.50.0",
  "@copilotkit/runtime": "^1.50.0",
  "@copilotkit/runtime-client-gql": "^1.50.0"
}
```

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  ┌─────────────────┐    ┌────────────────────────────┐  │
│  │  CopilotSidebar │◄──►│       TodoApp              │  │
│  │  (Chat UI)      │    │  - useCopilotReadable      │  │
│  │                 │    │  - useCopilotAction        │  │
│  └────────┬────────┘    └────────────────────────────┘  │
│           │                                              │
│           ▼                                              │
│  ┌─────────────────┐                                    │
│  │   CopilotKit    │ (Provider)                         │
│  │   runtimeUrl    │                                    │
│  └────────┬────────┘                                    │
└───────────┼─────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────┐
│                    Backend API                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │           /api/copilotkit/route.ts              │  │
│  │                                                  │  │
│  │  ┌─────────────┐    ┌─────────────────────┐    │  │
│  │  │ CopilotRuntime │◄──►│   OpenAIAdapter    │    │  │
│  │  └─────────────┘    │   (gpt-4o-mini)      │    │  │
│  │                      └─────────────────────┘    │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Arquivos

```
├── app/
│   ├── api/
│   │   └── copilotkit/
│   │       └── route.ts       # Backend endpoint
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Página principal com CopilotKit
│   └── globals.css
├── components/
│   └── TodoApp.tsx            # Componente com actions
└── .env.local                 # OPENAI_API_KEY
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

```env
OPENAI_API_KEY=sk-sua-chave-aqui
```

### 2. Backend (`app/api/copilotkit/route.ts`)

```typescript
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest } from "next/server";

// Instância do OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Adaptador para OpenAI
const serviceAdapter = new OpenAIAdapter({
  openai: openai as any,
  model: "gpt-4o-mini",
});

// Runtime do CopilotKit
const runtime = new CopilotRuntime();

// Endpoint POST
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
```

### 3. Frontend (`app/page.tsx`)

```typescript
"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { TodoApp } from "@/components/TodoApp";

export default function Home() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" showDevConsole={false}>
      <CopilotSidebar
        defaultOpen={true}
        labels={{
          title: "Assistente de Tarefas",
          initial: "Olá! 👋 Posso ajudar você...",
          placeholder: "Digite um comando...",
        }}
        instructions="Você é um assistente de tarefas..."
      >
        <TodoApp />
      </CopilotSidebar>
    </CopilotKit>
  );
}
```

## 🎯 Hooks Utilizados

### `useCopilotReadable`

Permite que a IA "veja" dados do estado da aplicação.

```typescript
useCopilotReadable({
  description: "Lista de tarefas do usuário com status",
  value: JSON.stringify(todos.map(t => ({
    id: t.id,
    tarefa: t.text,
    status: t.completed ? "concluída" : "pendente"
  })))
});
```

**Quando usar:**
- Compartilhar estado da aplicação com a IA
- Dar contexto sobre dados visíveis na tela
- Permitir que a IA responda perguntas sobre os dados

### `useCopilotAction`

Permite que a IA execute funções no frontend.

```typescript
useCopilotAction({
  name: "addTodo",
  description: "Adiciona uma nova tarefa na lista",
  parameters: [
    {
      name: "text",
      type: "string",
      description: "O texto da tarefa a ser adicionada",
      required: true
    }
  ],
  handler: ({ text }) => {
    // Lógica para adicionar tarefa
    setTodos(prev => [...prev, { id: Date.now().toString(), text, completed: false }]);
    return `Tarefa "${text}" adicionada com sucesso! ✅`;
  }
});
```

**Quando usar:**
- Permitir que a IA modifique estado
- Criar comandos de voz/texto
- Automatizar ações do usuário

## 📋 Actions Implementadas

| Action | Descrição | Parâmetros |
|--------|-----------|------------|
| `addTodo` | Adiciona nova tarefa | `text: string` |
| `completeTodo` | Marca tarefa como concluída | `todoId: string` |
| `deleteTodo` | Remove uma tarefa | `todoId: string` |
| `clearCompleted` | Remove todas as concluídas | - |

## 🎨 Componentes de UI

### `CopilotSidebar`

Componente de chat em sidebar lateral.

```typescript
<CopilotSidebar
  defaultOpen={true}
  labels={{
    title: "Título",
    initial: "Mensagem inicial",
    placeholder: "Placeholder do input"
  }}
  instructions="Instruções para a IA"
>
  {children}
</CopilotSidebar>
```

**Props importantes:**
- `defaultOpen`: Abre sidebar por padrão
- `labels`: Textos customizados
- `instructions`: System prompt para a IA

### Alternativas de UI

| Componente | Descrição |
|------------|-----------|
| `CopilotSidebar` | Chat em sidebar lateral |
| `CopilotPopup` | Chat em popup flutuante |
| `CopilotChat` | Chat inline na página |

## 🔄 Fluxo de Comunicação

1. **Usuário envia mensagem** no chat
2. **CopilotKit** envia para `/api/copilotkit`
3. **OpenAIAdapter** processa com GPT-4o-mini
4. **IA identifica** se precisa executar action
5. **Action é executada** no frontend (se necessário)
6. **Resposta é retornada** para o chat

```
Usuário: "Adicione comprar pão"
    │
    ▼
CopilotKit detecta intenção
    │
    ▼
Chama action: addTodo({ text: "comprar pão" })
    │
    ▼
TodoApp atualiza estado
    │
    ▼
IA responde: "Tarefa 'comprar pão' adicionada! ✅"
```

## ⚠️ Considerações

### Versão Gratuita vs Premium

| Recurso | Gratuito | Premium |
|---------|----------|---------|
| `useCopilotChat` | ✅ | ✅ |
| `useCopilotAction` | ✅ | ✅ |
| `useCopilotReadable` | ✅ | ✅ |
| `CopilotSidebar/Popup` | ✅ | ✅ |
| `useCopilotChatHeadless_c` | ❌ | ✅ |
| UI totalmente customizada | Limitado | ✅ |

### TypeScript

O `openai` precisa ser castado para `any` devido a incompatibilidade de tipos:

```typescript
const serviceAdapter = new OpenAIAdapter({
  openai: openai as any, // Cast necessário
  model: "gpt-4o-mini",
});
```

## 📚 Recursos

- [Documentação CopilotKit](https://docs.copilotkit.ai)
- [CopilotKit GitHub](https://github.com/CopilotKit/CopilotKit)
- [What's New v1.50](https://docs.copilotkit.ai/whats-new/v1-50)
- [OpenAI API](https://platform.openai.com/docs)

## 🚀 Executando o Projeto

```bash
# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com sua OPENAI_API_KEY

# Rodar em desenvolvimento
yarn dev
```

Acesse: http://localhost:3000
