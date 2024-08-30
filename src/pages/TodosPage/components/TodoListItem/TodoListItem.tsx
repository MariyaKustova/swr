import React from "react";
import { Checkbox } from "@mui/material";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { Todo } from "@model/todosTypes";
import Controls from "@core/Controls";
import { TODOS_QUERY_KEYS } from "@constants";
import { todosApi } from "@api/todosApi";

import s from "./TodosListItem.module.scss";

interface TodoListItemProps {
  todos: Todo[];
  todo: Todo;
  onEdit: (id: number) => void;
}

const TodoListItem = ({ todo, onEdit, todos }: TodoListItemProps) => {
  const { mutate } = useSWRConfig();

  const { trigger: editTrigger, isMutating: isEditMutating } = useSWRMutation(
    `${TODOS_QUERY_KEYS.EDIT_TODO}${todo.id}`,
    () => todosApi.editTodo({ id: todo.id, completed: !todo.completed })
  );
  const { trigger: deleteTrigger, isMutating: isDeleteMutating } =
    useSWRMutation(`${TODOS_QUERY_KEYS.DELETE_TODO}${todo.id}`, () =>
      todosApi.deleteTodo(todo.id)
    );

  const toggleCheckboxTodo = async () => {
    editTrigger().then((response) => {
      if (response) {
        mutate(
          TODOS_QUERY_KEYS.LOAD_TODOS,
          todos.map((todo) => {
            if (todo.id === response.id) {
              return { ...todo, completed: response.completed };
            }
            return todo;
          }),
          {
            revalidate: false,
          }
        );
      }
    });
  };

  const deleteTodo = () => {
    deleteTrigger().then((response) => {
      if (response?.data) {
        mutate(
          TODOS_QUERY_KEYS.LOAD_TODOS,
          todos.filter((todo) => todo.id !== response.data.id),
          {
            revalidate: false,
          }
        );
      }
    });
  };

  return (
    <div className={s.TodosListItem}>
      <div>
        <Checkbox checked={todo.completed} onChange={toggleCheckboxTodo} />
        <span className={todo.completed ? s.TodosListItem__completedTodo : ""}>
          {todo.todo}
        </span>
      </div>
      <Controls
        isDisabled={isDeleteMutating || isEditMutating}
        onEdit={() => onEdit(todo.id)}
        onDelete={deleteTodo}
      />
    </div>
  );
};

export default TodoListItem;
