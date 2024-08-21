import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./layout/Header";

import s from "./App.module.scss";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster toastOptions={{ position: "bottom-center" }} />
      <Header />
      <div className={s.App}>
        <Outlet />
      </div>
    </>
  );
}

export default App;
