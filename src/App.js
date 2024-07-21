import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { MainLayout } from "./components/layouts/MainLayout";
import BoardPage from "./pages/BoardPage";
import BuyBoardPage from "./pages/BuyBoardPage";
import SellBoardPage from "./pages/SellBoardPage";
import PostDetailPage from "./pages/PostDetailPage";
import WritePostPage from "./pages/WritePostPage";
import LoginTemplate from "./components/templates/user/LoginTemplate";
import ChatPage from "./components/templates/chat/ChatPage";
import ChatListPage from "./components/templates/chat/ChatListPage";
import PasswordResetTemplate from "./components/templates/user/PasswordResetTemplate";
import MyPageTemplate from "./components/templates/user/MyPageTemplate";
import CropTest from "./components/templates/crop/CropTest";
import MyPostTemplate from "./components/templates/post/MyPostTemplate";
import EditPostTemplate from "./components/templates/post/EditPostTemplate";
import ExchangeBoardTemplate from "./components/templates/post/ExchangeBoardTemplate";
import SoilPage from "./pages/SoilPage";
import DiagnosisPage from "./pages/DiagnosisPage";
import InfoPage from "./pages/InfoPage";
import MyCommentedPostsTemplate from "./components/templates/post/MyCommentedPostsTemplate";
import CropSelectionPage from "./components/templates/crop/CropSelectionPage";
import DiagnosisListTemplate from "./components/templates/exam/DiagnosisListTemplate";
import SoilListTemplate from "./components/templates/exam/SoilListTemplate";
import SoilDataDetails from "./components/templates/exam/SoilDataDetails";
import NotFoundPage from "./pages/NotFoundPage";
import SessionDetails from "./components/templates/crop/SessionDetails";
import StartTemplate from "./components/templates/user/StartTemplate";
import PolicyAgreement from "./components/templates/user/PolicyAgreement";
import { LoadingProvider } from "./LoadingContext";
import GlobalLoader from "./GlobalLoader";

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* user */}
            <Route path="/" element={<StartTemplate />} />
            <Route path="/signup" element={<PolicyAgreement />} />
            <Route path="/login" element={<LoginTemplate />} />
            <Route path="/password_reset" element={<PasswordResetTemplate />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/mypage" element={<MyPageTemplate />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* post */}
            <Route path="board" element={<BoardPage />} />
            <Route path="buyboard" element={<BuyBoardPage />} />
            <Route path="sellboard" element={<SellBoardPage />} />
            <Route path="exchangeboard" element={<ExchangeBoardTemplate />} />
            <Route path="post/:id" element={<PostDetailPage />} />
            <Route path="post/create" element={<WritePostPage />} />
            <Route path="/my_posts" element={<MyPostTemplate />} />
            <Route path="/post/edit/:id" element={<EditPostTemplate />} />
            <Route path="/my_commented_posts" element={<MyCommentedPostsTemplate />} />

            {/* chat */}
            <Route path="chatlist" element={<ChatListPage />} />
            <Route path="chat/:sessionid" element={<ChatPage />} />

            {/* ai */}
            <Route path="/croptest" element={<CropTest />} />
            <Route path="/soil" element={<SoilPage />} />
            <Route path="/soillist" element={<SoilListTemplate />} />
            <Route path="/soil_details" element={<SoilDataDetails />} />
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/diagnosislist" element={<DiagnosisListTemplate />} />
            <Route path="/cropselection" element={<CropSelectionPage />} />
            <Route path="/sessiondetails" element={<SessionDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;