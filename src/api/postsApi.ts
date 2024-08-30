import { Post, PostsResponse, Tag } from "@model/postsTypes";
import { POSTS_QUERY_KEYS } from "@constants";
import { HttpClientBaseQuery } from "./HttpClient";

export const postsApi = {
  getPosts: () =>
    HttpClientBaseQuery<PostsResponse>({
      url: POSTS_QUERY_KEYS.POSTS,
    }).then((response) => response.data?.posts),
  getPostById: (url: string) =>
    HttpClientBaseQuery<Post>({ url }).then((response) => response.data),
  createPost: (post: { title: string; userId: number }) =>
    HttpClientBaseQuery<Post>({
      url: POSTS_QUERY_KEYS.ADD_POST,
      method: "post",
      data: post,
    }).then((response) => response.data),
  editPost: (id: number, title: string) =>
    HttpClientBaseQuery<Post>({
      url: POSTS_QUERY_KEYS.EDIT_POST.replace("edit/", String(id)),
      method: "put",
      data: { title },
    }).then((response) => response.data),
  deletePost: (id: number) =>
    HttpClientBaseQuery<Post>({
      url: POSTS_QUERY_KEYS.DELETE_POST.replace("delete/", String(id)),
      method: "delete",
    }).then((response) => response.data),
  getTagsList: (url: string) =>
    HttpClientBaseQuery<Tag[]>({ url }).then((response) => response.data),
};
