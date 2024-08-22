import React, { useState } from "react";

import { Route, Routes } from "react-router-dom";
import { Typography } from "@mui/material";
import PostCard from "./components/PostCard";
import PageTitle from "../../core/PageTitle";
import PostCreateForm from "./components/PostCreateForm";
import PostsList from "./components/PostsList";

const PostsPageComponent = () => {
  const [openCreateForm, setOpenCreateForm] = useState(false);

  return (
    <>
      <PageTitle title="Posts" onClick={() => setOpenCreateForm(true)} />
      <PostsList />
      {openCreateForm && (
        <PostCreateForm
          open={openCreateForm}
          onClose={() => setOpenCreateForm(false)}
        />
      )}
    </>
  );
};

const PostsPage = () => {
  return (
    <Routes>
      <Route path={"/"} element={<PostsPageComponent />} />
      <Route path={"/:id"} element={<PostCard />} />
      <Route
        path="*"
        element={
          <Typography variant="h4" component="div" color={"primary"}>
            Resource not found
          </Typography>
        }
      />
    </Routes>
  );
};

export default PostsPage;
