import React from "react";

import { Todo } from "@model/todosTypes";
import TodoListItem from "../TodoListItem";

interface TodosListProps {
  onEdit: (id: number) => void;
  todos: Todo[];
}

const TodosList = ({ onEdit, todos }: TodosListProps) => {
  return (
    <>
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} todos={todos} onEdit={onEdit} />
      ))}
    </>
  );
};

export default TodosList;
