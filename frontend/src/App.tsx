import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import { useAppSelector } from "./redux/hooks";

function App() {
  const isAuth = useAppSelector((state) => state.userSlice.isAuth);
  return (
    <BrowserRouter>
      <Routes>
        {isAuth === true ? (
          <>
            <Route path="/" element={<MainPage/>} />
          </>
        ) : (
          <>
            <Route path="*" element={<Login />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
