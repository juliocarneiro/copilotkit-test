"use client";

import { 
  Card, 
  Input, 
  Button, 
  Checkbox, 
  Typography, 
  Space, 
  Tag,
  Statistic,
  Row,
  Col,
  Empty,
  Flex
} from "antd";
import { 
  PlusOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useTodos } from "@/hooks/useTodos";

const { Text } = Typography;

export function TodoApp() {
  const {
    todos,
    newTodo,
    setNewTodo,
    pendingCount,
    completedCount,
    totalCount,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    handleAddTodo,
    contextHolder,
  } = useTodos();

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#fff",
      padding: "40px 20px"
    }}>
      {contextHolder}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Stats */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Pendentes"
                value={pendingCount}
                prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
                styles={{ content: { color: "#faad14" } }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Concluídas"
                value={completedCount}
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                styles={{ content: { color: "#52c41a" } }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total"
                value={totalCount}
              />
            </Card>
          </Col>
        </Row>

        {/* Add Todo */}
        <Card style={{ marginBottom: 24 }}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              size="large"
              placeholder="Adicionar nova tarefa..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onPressEnter={handleAddTodo}
            />
            <Button 
              type="primary" 
              size="large" 
              icon={<PlusOutlined />}
              onClick={handleAddTodo}
            >
              Adicionar
            </Button>
          </Space.Compact>
        </Card>

        {/* Todo List */}
        <Card>
          {todos.length === 0 ? (
            <Empty 
              description="Nenhuma tarefa! Adicione uma ou peça para a IA."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Flex vertical gap={12}>
              {todos.map((todo) => (
                <Flex 
                  key={todo.id}
                  justify="space-between" 
                  align="center"
                  style={{
                    padding: "12px 16px",
                    background: todo.completed ? "#f6ffed" : "#fafafa",
                    borderRadius: 8,
                    border: `1px solid ${todo.completed ? "#b7eb8f" : "#f0f0f0"}`
                  }}
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  >
                    <Text 
                      delete={todo.completed}
                      type={todo.completed ? "secondary" : undefined}
                    >
                      {todo.text}
                    </Text>
                  </Checkbox>
                  
                  <Space>
                    <Tag color="default" style={{ fontFamily: "monospace" }}>
                      ID: {todo.id}
                    </Tag>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteTodo(todo.id)}
                    />
                  </Space>
                </Flex>
              ))}
            </Flex>
          )}
        </Card>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <Button
            block
            type="dashed"
            style={{ marginTop: 16 }}
            onClick={clearCompleted}
          >
            🗑️ Limpar {completedCount} tarefa(s) concluída(s)
          </Button>
        )}
      </div>
    </div>
  );
}
