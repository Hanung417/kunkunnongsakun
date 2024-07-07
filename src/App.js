import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { MainLayout } from "./components/layouts/MainLayout";
import BoardPage from "./pages/BoardPage";
import BuyBoardPage from "./pages/BuyBoardPage";
import SellBoardPage from "./pages/SellBoardPage";
import MyBoardPage from "./pages/MyBoardPage";
import PostDetailPage from "./pages/PostDetailPage";
import WritePostPage from "./pages/WritePostPage";
import SignupTemplate from "./components/templates/SignupTemplate";
import LoginTemplate from "./components/templates/LoginTemplate";
import ChatPage from "./components/templates/ChatPage";
import ChatListPage from "./components/templates/ChatListPage";
import AuthCheck from "./components/templates/Authcheck";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthCheck />}/>
        <Route path="/signup" element={<SignupTemplate />} />
        <Route path="/login" element={<LoginTemplate />} />
        <Route element={<MainLayout/>}>
          <Route path="/" element={<MainPage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="buyboard" element={<BuyBoardPage />} />
          <Route path="sellboard" element={<SellBoardPage />} />
          <Route path="myboard" element={<MyBoardPage />} />
          <Route path="post/:id" element={<PostDetailPage />} />
          <Route path="post/create" element={<WritePostPage />} />
          <Route path="chatlist" element={<ChatListPage />} />
          <Route path={"chat/:sessionid"} element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;