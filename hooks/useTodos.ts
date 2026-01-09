"use client";

import { useState, useCallback, useMemo } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { message } from "antd";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const INITIAL_TODOS: Todo[] = [
  { id: "1", text: "Aprender CopilotKit", completed: false },
  { id: "2", text: "Criar projeto incrível", completed: false },
];

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [newTodo, setNewTodo] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // Contadores
  const pendingCount = useMemo(() => todos.filter(t => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);

  // A IA pode "ver" as tarefas atuais
  useCopilotReadable({
    description: "Lista de tarefas do usuário com status",
    value: JSON.stringify(todos.map(t => ({
      id: t.id,
      tarefa: t.text,
      status: t.completed ? "concluída" : "pendente"
    })))
  });

  // Adicionar tarefa
  const addTodo = useCallback((text: string) => {
    const newTask: Todo = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    setTodos(prev => [...prev, newTask]);
    messageApi.success(`Tarefa "${text}" adicionada!`);
    return newTask;
  }, [messageApi]);

  // Marcar como concluída
  const completeTodo = useCallback((todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return null;
    
    setTodos(prev => prev.map(t => 
      t.id === todoId ? { ...t, completed: true } : t
    ));
    messageApi.success(`Tarefa concluída!`);
    return todo;
  }, [todos, messageApi]);

  // Toggle tarefa
  const toggleTodo = useCallback((todoId: string) => {
    setTodos(prev => prev.map(t => 
      t.id === todoId ? { ...t, completed: !t.completed } : t
    ));
  }, []);

  // Remover tarefa
  const deleteTodo = useCallback((todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return null;
    
    setTodos(prev => prev.filter(t => t.id !== todoId));
    messageApi.info(`Tarefa removida!`);
    return todo;
  }, [todos, messageApi]);

  // Limpar concluídas
  const clearCompleted = useCallback(() => {
    const count = todos.filter(t => t.completed).length;
    setTodos(prev => prev.filter(t => !t.completed));
    messageApi.info(`${count} tarefa(s) removida(s)!`);
    return count;
  }, [todos, messageApi]);

  // Handler para input
  const handleAddTodo = useCallback(() => {
    if (!newTodo.trim()) return;
    addTodo(newTodo.trim());
    setNewTodo("");
  }, [newTodo, addTodo]);

  // CopilotKit Actions

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
      addTodo(text);
      return `Tarefa "${text}" adicionada com sucesso!`;
    }
  });

  useCopilotAction({
    name: "completeTodo",
    description: "Marca uma tarefa como concluída",
    parameters: [
      {
        name: "todoId",
        type: "string",
        description: "O ID da tarefa para marcar como concluída",
        required: true
      }
    ],
    handler: ({ todoId }) => {
      const todo = completeTodo(todoId);
      if (!todo) return "Tarefa não encontrada.";
      return `Tarefa "${todo.text}" marcada como concluída!`;
    }
  });

  useCopilotAction({
    name: "deleteTodo",
    description: "Remove uma tarefa da lista",
    parameters: [
      {
        name: "todoId",
        type: "string",
        description: "O ID da tarefa para remover",
        required: true
      }
    ],
    handler: ({ todoId }) => {
      const todo = deleteTodo(todoId);
      if (!todo) return "Tarefa não encontrada.";
      return `Tarefa "${todo.text}" removida!`;
    }
  });

  useCopilotAction({
    name: "clearCompleted",
    description: "Remove todas as tarefas concluídas",
    parameters: [],
    handler: () => {
      const count = clearCompleted();
      return `${count} tarefa(s) concluída(s) removida(s)!`;
    }
  });

  return {
    // Estado
    todos,
    newTodo,
    setNewTodo,
    
    // Contadores
    pendingCount,
    completedCount,
    totalCount: todos.length,
    
    // Ações
    addTodo,
    completeTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    handleAddTodo,
    
    // Antd message context
    contextHolder,
  };
}
