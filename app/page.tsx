"use client";

import { useState } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { TodoApp } from "@/components/TodoApp";
import { VoiceButton } from "@/components/VoiceButton";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <CopilotKit runtimeUrl="/api/copilotkit" showDevConsole={false}>
      <CopilotSidebar
        defaultOpen={true}
        clickOutsideToClose={false}
        onSetOpen={setIsChatOpen}
        labels={{
          title: "Assistente de Tarefas",
          initial: "Olá! Posso ajudar você a gerenciar suas tarefas.\n\nExperimente:\n• \"Adicione comprar pão\"\n• \"Marque a tarefa 1 como concluída\"\n• \"Quais tarefas tenho?\"\n• \"Limpe as tarefas concluídas\"",
          placeholder: "Digite um comando...",
        }}
        instructions="Você é um assistente de tarefas. Ajude o usuário a gerenciar sua lista de tarefas usando as actions disponíveis (addTodo, completeTodo, deleteTodo, clearCompleted). Sempre responda em português brasileiro de forma amigável e concisa. Quando o usuário pedir para adicionar/completar/remover tarefas, use as actions apropriadas."
      >
        <TodoApp />
      </CopilotSidebar>
      {/* VoiceButton só aparece se o chat estiver aberto */}
      {isChatOpen && <VoiceButton />}
    </CopilotKit>
  );
}
