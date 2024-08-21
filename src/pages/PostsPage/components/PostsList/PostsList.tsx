import React from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import toast from "react-hot-toast";

import { RoutePath } from "../../../../model/baseTypes";
import PostItem from "../PostItem";
import { Loader } from "../../../../core/Loader";
import { POSTS_QUERY_KEYS } from "../../constants";
import { postsApi } from "../../../../api/postsApi";

import s from "./PostsList.module.scss";

const PostsList = () => {
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR(POSTS_QUERY_KEYS.POSTS, postsApi.getPosts, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  if (error) {
    toast.error("Error posts loading...");
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={s.PostsList}>
          {posts?.map(({ id, title, tags, body }) => (
            <Link
              key={id}
              className={s.PostsList__link}
              to={RoutePath.POST_ITEM.replace(":id", String(id))}
            >
              <PostItem title={title} tags={tags} body={body} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default PostsList;
