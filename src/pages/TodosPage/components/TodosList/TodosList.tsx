import React from "react";
import { Checkbox } from "@mui/material";

import Controls from "../../../../core/Controls";
import { Todo } from "../../../../model/todosTypes";

import s from "./TodosList.module.scss";
import { useSWRConfig } from "swr";
import { TODOS_QUERY_KEYS } from "../../constants";
interface TodosListProps {
  onCheckboxChange: (id: number, completed: boolean) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  todos: Todo[];
}

const TodosList = ({
  onCheckboxChange,
  onEdit,
  onDelete,
  todos,
}: TodosListProps) => {
  const { cache } = useSWRConfig();
  const checkDisabled = (id: number) =>
    Boolean(cache.get(`${TODOS_QUERY_KEYS.DELETE_TODO}${id}`)?.isLoading);
  return (
    <>
      {todos.map((todo) => (
        <div key={todo.id} className={s.TodosList__listItem}>
          <div>
            <Checkbox
              checked={todo.completed}
              onChange={() => onCheckboxChange(todo.id, !todo.completed)}
            />
            <span className={todo.completed ? s.TodosList__completedTodo : ""}>
              {todo.todo}
            </span>
          </div>
          <Controls
            isDisabled={checkDisabled(todo.id)}
            onEdit={() => onEdit(todo.id)}
            onDelete={() => onDelete(todo.id)}
          />
        </div>
      ))}
    </>
  );
};

export default TodosList;
