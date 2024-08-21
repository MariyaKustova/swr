import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { Loader } from "../../../../core/Loader";
import Controls from "../../../../core/Controls";
import { PostDialog } from "./components/PostDialog";
import { RoutePath } from "../../../../model/baseTypes";

import s from "./PostCard.module.scss";
import { postsApi } from "../../../../api/postsApi";
import toast from "react-hot-toast";
import { POSTS_QUERY_KEYS } from "../../constants";
import { Post } from "../../../../model/postsTypes";

const PostCard = () => {
  const { id } = useParams();

  const {
    data: post,
    error,
    isLoading,
  } = useSWR(
    id ? `${POSTS_QUERY_KEYS.POST_BY_ID}${id}` : null,
    postsApi.getPostById,
    { revalidateIfStale: false, revalidateOnFocus: false }
  );

  const { trigger: deletePost } = useSWRMutation(
    post?.id ? `${POSTS_QUERY_KEYS.DELETE_POST}${post.id}` : null,
    () => {
      if (post?.id) return postsApi.deletePost(post.id);
    }
  );
  const { cache, mutate } = useSWRConfig();

  const posts = cache.get(POSTS_QUERY_KEYS.POSTS);
  const postsData: Post[] = posts?.data ? [...posts.data] : [];

  const navigate = useNavigate();

  const [editPostId, setEditPostId] = useState<number | null>(null);

  const onCloseDialog = () => setEditPostId(null);

  const handleDeletePost = async () => {
    const deletedPost = await deletePost();
    if (deletedPost) {
      cache.set(POSTS_QUERY_KEYS.POSTS, {
        ...posts,
        data: [...postsData.filter(({ id }) => id !== deletedPost.id)],
      });
    }
    navigate(RoutePath.POSTS);
  };

  const handleEditPost = async (value: string) => {
    if (value.length && post?.title !== value && editPostId) {
      const editPost = await mutate(
        `${POSTS_QUERY_KEYS.EDIT_POST}${editPostId}`,
        () => postsApi.editPost(editPostId, value)
      );
      if (editPost) {
        const index = postsData.findIndex((post) => post.id === editPost.id);
        postsData.splice(index, 1, editPost);

        cache.set(POSTS_QUERY_KEYS.POSTS, {
          ...posts,
          data: postsData,
        });

        cache.set(`${POSTS_QUERY_KEYS.POST_BY_ID}${id}`, {
          ...posts,
          data: editPost,
        });
      }
    }
    onCloseDialog();
    navigate(RoutePath.POSTS);
  };

  if (error) {
    toast.error("Error loading post...");
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {post && (
            <>
              <div className={s.PostCard}>
                <IconButton
                  className={s.PostCard__backBtn}
                  onClick={() => navigate(RoutePath.POSTS)}
                >
                  <ArrowBackIosNewRoundedIcon className={s.PostCard__icon} />
                </IconButton>
                <Typography color={"primary"} variant="h5">
                  {post.title}
                </Typography>
                <Typography variant="subtitle1" color={"primary"}>
                  {post.tags.map((tag) => "#" + tag).join("")}
                </Typography>
                <Typography variant="body1">{post.body}</Typography>
                <div className={s.PostCard__wrapper}>
                  <Controls
                    onEdit={() => setEditPostId(post.id)}
                    onDelete={handleDeletePost}
                  />
                </div>
              </div>
              {Boolean(editPostId) && (
                <PostDialog
                  open={Boolean(editPostId)}
                  onClose={onCloseDialog}
                  value={post?.title}
                  onChange={handleEditPost}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default PostCard;
