import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { MainLayout } from "./components/layouts/MainLayout";
import BoardPage from "./pages/BoardPage";
import BuyBoardPage from "./pages/BuyBoardPage";
import SellBoardPage from "./pages/SellBoardPage";
import PostDetailPage from "./pages/PostDetailPage";
import WritePostPage from "./pages/WritePostPage";
import SignupTemplate from "./components/templates/user/SignupTemplate";
import LoginTemplate from "./components/templates/user/LoginTemplate";
import ChatPage from "./components/templates/ChatPage";
import ChatListPage from "./components/templates/ChatListPage";
import PasswordResetTemplate from "./components/templates/user/PasswordResetTemplate";
import MyPageTemplate from "./components/templates/MyPageTemplate";
import CropTest from "./components/templates/CropTest";
import MyPostTemplate from "./components/templates/MyPostTemplate";
import EditPostTemplate from "./components/templates/EditPostTemplate";
import ExchangeBoardTemplate from "./components/templates/ExchangeBoardTemplate";

// 용범 페이지 병합
import ExpectedReturnPage from "./pages/ExpectedReturnPage";
import CropsPage from './pages/CropsPage';
import SoilPage from './pages/SoilPage';
import FertilizerPage from './pages/FertilizerPage';
import DiagnosisPage from './pages/DiagnosisPage';
import InfoPage from './pages/InfoPage';
import MyCommentedPostsTemplate from "./components/templates/MyCommentedPostsTemplate";
import CropSelectionPage from "./components/templates/CropSelectionPage";
import SessionDetails from "./components/templates/SessionDetails";


// 병해충 세션 리스트 페이지
import DiagnosisListTemplate from "./components/templates/DiagnosisListTemplate";
// 토양 세션 리스트 페이지
import SoilListTemplate from "./components/templates/SoilListTemplate";
import SoilDataDetails from "./components/templates/SoilDataDetails";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>

          {/*user*/}
          <Route path="/signup" element={<SignupTemplate />} />
          <Route path="/login" element={<LoginTemplate />} />
          <Route path="/password_reset" element={<PasswordResetTemplate />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<MyPageTemplate />} />

          {/*board*/}
          <Route path="board" element={<BoardPage />} />
          <Route path="buyboard" element={<BuyBoardPage />} />
          <Route path="sellboard" element={<SellBoardPage />} />
          <Route path="exchangeboard" element={<ExchangeBoardTemplate />} />
          <Route path="post/:id" element={<PostDetailPage />} />
          <Route path="post/create" element={<WritePostPage />} />
          <Route path="/my_posts" element={<MyPostTemplate />} />
          <Route path="/post/edit/:id" element={<EditPostTemplate />} />
          <Route path="/my_commented_posts" element={<MyCommentedPostsTemplate />} />

          {/*chat*/}
          <Route path="chatlist" element={<ChatListPage />} />
          <Route path="chat/:sessionid" element={<ChatPage />} />

          {/*ai*/}
          <Route path="/croptest" element={<CropTest />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/expectedreturn" element={<ExpectedReturnPage />} />
          <Route path="/soil" element={<SoilPage />} />
          <Route path="/soillist" element={<SoilListTemplate />} />
          <Route path="/fertilizer" element={<FertilizerPage />} />
          <Route path="/soil_details" element={<SoilDataDetails />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/diagnosislist" element={<DiagnosisListTemplate />} />
          <Route path="/cropselection" element={<CropSelectionPage />} />
          <Route path="/sessiondetails" element={<SessionDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;