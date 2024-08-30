import { Todo, TodosResponse } from "@model/todosTypes";
import { TODOS_QUERY_KEYS } from "@constants";
import { HttpClientBaseQuery } from "./HttpClient";

export const todosApi = {
  getTodos: (url: string) =>
    HttpClientBaseQuery<TodosResponse>({ url }).then(
      (response) => response.data?.todos
    ),
  createTodo: ({ todo }: { todo: Omit<Todo, "id"> }) =>
    HttpClientBaseQuery<Todo>({
      url: TODOS_QUERY_KEYS.ADD_TODO,
      method: "POST",
      data: todo,
    }).then((response) => response.data),
  editTodo: ({ id, completed }: { id: number; completed: boolean }) =>
    HttpClientBaseQuery<Todo>({
      url: TODOS_QUERY_KEYS.EDIT_TODO.replace("edit/", String(id)),
      method: "PUT",
      data: { completed },
    }).then((response) => response.data),
  deleteTodo: (id: number) =>
    HttpClientBaseQuery<Todo>({
      url: TODOS_QUERY_KEYS.DELETE_TODO.replace("delete/", String(id)),
      method: "DELETE",
    }),
};
