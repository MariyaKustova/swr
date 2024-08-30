import React, { useState } from "react";
import toast from "react-hot-toast";
import useSWR, { preload, useSWRConfig } from "swr";

import { Loader } from "@core/Loader";
import PageTitle from "@core/PageTitle";
import { todosApi } from "@api/todosApi";
import { TODOS_QUERY_KEYS } from "@constants";
import { TodoDialog } from "./components/TodoDialog";
import { getRandomInt } from "../../utils";
import TodosList from "./components/TodosList";

preload(TODOS_QUERY_KEYS.LOAD_TODOS, todosApi.getTodos);

const TodosPage = () => {
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { mutate } = useSWRConfig();

  const {
    data: todos = [],
    error,
    isLoading: isTodosLoading,
  } = useSWR(TODOS_QUERY_KEYS.LOAD_TODOS, todosApi.getTodos, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  if (error) {
    toast.error("Error todos loading...");
  }

  const todosUserIds = todos.map(({ userId }) => userId);
  const currentTodo = todos.find((todo) => todo.id === editTodoId);

  const onCloseEditDialog = () => setEditTodoId(null);

  const addTodo = (value: string) => {
    const userId = todosUserIds?.[getRandomInt(todosUserIds.length - 1)];

    if (value.length && todosUserIds?.length && userId) {
      mutate(`${TODOS_QUERY_KEYS.ADD_TODO}/${userId}`, () =>
        todosApi.createTodo({
          todo: {
            userId,
            todo: value,
            completed: false,
          },
        })
      ).then((newTodo) => {
        if (newTodo) {
          mutate(TODOS_QUERY_KEYS.LOAD_TODOS, [...todos, newTodo], {
            revalidate: false,
          });
        }
      });
    }
    onCloseEditDialog();
  };

  const editContentTodo = (value: string) => {
    if (currentTodo && value.length && currentTodo.todo !== value) {
      mutate(
        TODOS_QUERY_KEYS.LOAD_TODOS,
        todos.map((todo) => {
          if (todo.id === currentTodo.id) {
            return { ...todo, todo: value };
          }
          return todo;
        }),
        {
          revalidate: false,
        }
      );
    }
    onCloseEditDialog();
  };

  return (
    <>
      <PageTitle title="Todos" onClick={() => setOpenDialog(true)} />
      {isTodosLoading ? (
        <Loader />
      ) : (
        <>
          {todos && <TodosList onEdit={setEditTodoId} todos={todos} />}
          {Boolean(editTodoId) && (
            <TodoDialog
              open={Boolean(editTodoId)}
              onClose={onCloseEditDialog}
              value={currentTodo?.todo}
              onChange={editContentTodo}
              isEdit
            />
          )}
          {openDialog && (
            <TodoDialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              onChange={addTodo}
            />
          )}
        </>
      )}
    </>
  );
};

export default TodosPage;
