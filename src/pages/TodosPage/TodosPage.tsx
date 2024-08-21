import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR, { useSWRConfig } from "swr";

import { Loader } from "../../core/Loader";
import { TodoDialog } from "./components/TodoDialog";
import PageTitle from "../../core/PageTitle";
import { getRandomInt } from "../../utils";
import TodosList from "./components/TodosList";
import { TODOS_QUERY_KEYS } from "./constants";
import { todosApi } from "../../api/todosApi";
import { Todo } from "../../model/todosTypes";

const TodosPage = () => {
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { mutate } = useSWRConfig();

  const {
    data,
    error,
    isLoading: isTodosLoading,
  } = useSWR(TODOS_QUERY_KEYS.LOAD_TODOS, todosApi.getTodos, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  if (error) {
    toast.error("Error todos loading...");
  }

  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (data) {
      setTodos(data);
    }
  }, [data]);

  const todosUserIds = todos.map(({ userId }) => userId);
  const currentTodo = todos.find((todo) => todo.id === editTodoId);

  const onCloseEditDialog = () => setEditTodoId(null);

  const addTodo = (value: string) => {
    const userId = todosUserIds?.[getRandomInt(todosUserIds.length - 1)];

    if (value.length && todosUserIds?.length && userId) {
      mutate(`${TODOS_QUERY_KEYS.ADD_TODO}${userId}`, () =>
        todosApi.createTodo({
          todo: {
            userId,
            todo: value,
            completed: false,
          },
        })
      ).then((newTodo) => {
        if (newTodo) {
          setTodos([...todos, newTodo]);
        }
      });
    }
    onCloseEditDialog();
  };

  const editContentTodo = (value: string) => {
    if (currentTodo && value.length && currentTodo.todo !== value) {
      setTodos((prev) =>
        prev.map((todo) => {
          if (todo.id === currentTodo.id) {
            return { ...todo, todo: value };
          }
          return todo;
        })
      );
    }
    onCloseEditDialog();
  };

  const toggleCheckboxTodo = async (id: number, completed: boolean) => {
    if (todos) {
      const response = await mutate(`${TODOS_QUERY_KEYS.EDIT_TODO}${id}`, () =>
        todosApi.editTodo(id, completed)
      );

      if (response) {
        setTodos((prev) =>
          prev.map((todo) => {
            if (todo.id === response.id) {
              return { ...todo, completed: response.completed };
            }
            return todo;
          })
        );
      }
    }
  };

  const deleteTodo = (id: number) => {
    todos.filter((todo) => todo.id !== id);
    mutate(`${TODOS_QUERY_KEYS.DELETE_TODO}${id}`, () =>
      todosApi.deleteTodo(id)
    ).then((response) => {
      if (response?.data) {
        setTodos((prev) => prev.filter((todo) => todo.id !== response.data.id));
      }
    });
  };

  return (
    <>
      <PageTitle title="Todos" onClick={() => setOpenDialog(true)} />

      {isTodosLoading ? (
        <Loader />
      ) : (
        <>
          {todos && (
            <TodosList
              onCheckboxChange={toggleCheckboxTodo}
              onEdit={setEditTodoId}
              todos={todos}
              onDelete={deleteTodo}
            />
          )}
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
