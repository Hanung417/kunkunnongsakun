import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { MainLayout } from "./components/layouts/MainLayout";
import BoardPage from "./pages/BoardPage";
import BuyBoardPage from "./pages/BuyBoardPage";
import SellBoardPage from "./pages/SellBoardPage";
import PostDetailPage from "./pages/PostDetailPage";
import WritePostPage from "./pages/WritePostPage";
import SignupTemplate from "./components/templates/SignupTemplate";
import LoginTemplate from "./components/templates/LoginTemplate";
import ChatPage from "./components/templates/ChatPage";
import ChatListPage from "./components/templates/ChatListPage";
import PasswordResetTemplate from "./components/templates/PasswordResetTemplate";
import MyPageTemplate from "./components/templates/MyPageTemplate";
import CropTest from "./components/templates/CropTest";
import MyPostTemplate from "./components/templates/MyPostTemplate";
import EditPostTemplate from "./components/templates/EditPostTemplate";

// 용범 페이지 병합
import ExpectedReturnPage from "./pages/ExpectedReturnPage";
import CropsPage from './pages/CropsPage';
import SoilPage from './pages/SoilPage';
import FertilizerPage from './pages/FertilizerPage';
import DiagnosisPage from './pages/DiagnosisPage';
import InfoPage from './pages/InfoPage';
import MyCommentedPostsTemplate from "./components/templates/MyCommentedPostsTemplate";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/signup" element={<SignupTemplate />} />
          <Route path="/login" element={<LoginTemplate />} />
          <Route path="/password_reset" element={<PasswordResetTemplate />} />
          <Route path="/" element={<MainPage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="buyboard" element={<BuyBoardPage />} />
          <Route path="sellboard" element={<SellBoardPage />} />
          <Route path="post/:id" element={<PostDetailPage />} />
          <Route path="post/create" element={<WritePostPage />} />
          <Route path="chatlist" element={<ChatListPage />} />
          <Route path="chat/:sessionid" element={<ChatPage />} />
          <Route path="/mypage" element={<MyPageTemplate />} />
          <Route path="/croptest" element={<CropTest />} />
          <Route path="/my_posts" element={<MyPostTemplate />} />
          <Route path="/post/edit/:id" element={<EditPostTemplate />} />
          <Route path="/my_commented_posts" element={<MyCommentedPostsTemplate />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/expectedreturn" element={<ExpectedReturnPage />} />
          <Route path="/soil" element={<SoilPage />} />
          <Route path="/fertilizer" element={<FertilizerPage />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/info" element={<InfoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;