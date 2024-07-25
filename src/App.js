import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainTemplate from "./components/templates/MainTemplate";
import { MainLayout } from "./components/layouts/MainLayout";
import BoardTemplate from "./components/templates/post/BoardTemplate";
import BuyBoardTemplate from "./components/templates/post/BuyBoardTemplate";
import SellBoardTemplate from "./components/templates/post/SellBoardTemplate";
import WritePostTemplate from "./components/templates/post/WritePostTemplate";
import PostDetailTemplate from "./components/templates/post/PostDetailTemplate";
import LoginTemplate from "./components/templates/user/LoginTemplate";
import PasswordResetTemplate from "./components/templates/user/PasswordResetTemplate";
import MyPageTemplate from "./components/templates/user/MyPageTemplate";
import CropTest from "./components/templates/crop/CropTest";
import MyPostTemplate from "./components/templates/post/MyPostTemplate";
import EditPostTemplate from "./components/templates/post/EditPostTemplate";
import ExchangeBoardTemplate from "./components/templates/post/ExchangeBoardTemplate";
import MyCommentedPostsTemplate from "./components/templates/post/MyCommentedPostsTemplate";
import CropSelectionPage from "./components/templates/crop/CropSelectionPage";
import DiagnosisListTemplate from "./components/templates/exam/DiagnosisListTemplate";
import SoilListTemplate from "./components/templates/exam/SoilListTemplate";
import SoilDataDetails from "./components/templates/exam/SoilDataDetails";
import SessionDetails from "./components/templates/crop/SessionDetails";
import StartTemplate from "./components/templates/user/StartTemplate";
import PolicyAgreement from "./components/templates/user/PolicyAgreement";
import PrivacyPolicyPage from "./components/templates/user/PrivacyPolicyPage";
import TermsOfService from "./components/templates/user/TermsOfService";
import NotFound from "./components/templates/NotFound";
import SoilTemplate from "./components/templates/exam/SoilTemplate";
import { LoadingProvider } from "./LoadingContext";
import DiagnosisTemplate from "./components/templates/exam/DiagnosisTemplate";
import InfoTemplate from "./components/templates/exam/InfoTemplate";
import ChatListTemplate from "./components/templates/chat/ChatListTemplate";
import ChatTemplate from "./components/templates/chat/ChatTemplate";
import AuthRoute from "./components/layouts/AuthRoute";
import NoAuthRoute from "./components/layouts/NoAuthRoute";

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* user */}
            <Route path="/" element={<StartTemplate />} />
            <Route path="/main" element={<MainTemplate />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

            <Route element={<NoAuthRoute />}>
              <Route path="/signup" element={<PolicyAgreement />} />
              <Route path="/login" element={<LoginTemplate />} />
              <Route path="/password_reset" element={<PasswordResetTemplate />} />
            </Route>

            {/* auth */}
            <Route element={<AuthRoute />}>
              <Route path="/mypage" element={<MyPageTemplate />} />
              <Route path="/my_posts" element={<MyPostTemplate />} />
              <Route path="/post/edit/:id" element={<EditPostTemplate />} />
              <Route path="/my_commented_posts" element={<MyCommentedPostsTemplate />} />
              <Route path="post/create" element={<WritePostTemplate />} />
              <Route path="/cropselection" element={<CropSelectionPage />} />
              <Route path="/croptest" element={<CropTest />} />
              <Route path="/soil" element={<SoilTemplate />} />
              <Route path="/soillist" element={<SoilListTemplate />} />
              <Route path="/soil_details" element={<SoilDataDetails />} />
              <Route path="/diagnosis" element={<DiagnosisTemplate />} />
              <Route path="/info" element={<InfoTemplate />} />
              <Route path="/diagnosislist" element={<DiagnosisListTemplate />} />
              <Route path="/sessiondetails" element={<SessionDetails />} />
            </Route>

            {/* post */}
            <Route path="board" element={<BoardTemplate />} />
            <Route path="buyboard" element={<BuyBoardTemplate />} />
            <Route path="sellboard" element={<SellBoardTemplate />} />
            <Route path="exchangeboard" element={<ExchangeBoardTemplate />} />
            <Route path="post/:id" element={<PostDetailTemplate />} />

            {/* chat */}
            <Route path="chatlist" element={<ChatListTemplate />} />
            <Route path="chat/:sessionid" element={<ChatTemplate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
