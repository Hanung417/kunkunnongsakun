import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import ChangePasswordModal from "./user/ChangePasswordModal";
import ChangeUsernameModal from "./user/ChangeUsernameModal";
import DeleteAccountModal from "./DeleteAccountModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #f9f9f9;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const TabButton = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  color: ${({ isActive }) => (isActive ? "white" : "#4aaa87")};
  background-color: ${({ isActive }) => (isActive ? "#4aaa87" : "white")};
  border: 1px solid #4aaa87;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 4px;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#3b8b6d" : "#6dc4b0")};
    color: white;
  }
`;

const TabContent = styled.div`
  display: ${({ isActive }) => (isActive ? "block" : "none")};
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 12px;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const MyPageTemplate = () => {
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/login/auth_check/", { withCredentials: true });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = () => {
    setIsPasswordModalOpen(true);
  };

  const handleUsernameChange = () => {
    setIsUsernameModalOpen(true);
  };

  const handleAccountDeletion = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleViewMyPosts = () => {
    navigate("/my_posts");
  };

  const handleViewMyCommentedPosts = () => {
    navigate("/my_commented_posts");
  };

  return (
    <Container>
      <Title>마이페이지</Title>
      <Tabs>
        <TabButton isActive={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
          프로필
        </TabButton>
        <TabButton isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")}>
          설정
        </TabButton>
        <TabButton isActive={activeTab === "activity"} onClick={() => setActiveTab("activity")}>
          활동
        </TabButton>
      </Tabs>

      <TabContent isActive={activeTab === "profile"}>
        <h2>프로필</h2>
        <p>Username: {username}</p>
        <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
        <Button onClick={handleUsernameChange}>사용자 이름 변경</Button>
      </TabContent>

      <TabContent isActive={activeTab === "settings"}>
        <h2>설정</h2>
        <Button onClick={handleAccountDeletion}>회원 탈퇴</Button>
      </TabContent>

      <TabContent isActive={activeTab === "activity"}>
        <h2>활동</h2>
        <Button onClick={handleViewMyPosts}>내가 쓴 글</Button>
        <Button onClick={handleViewMyCommentedPosts}>내가 댓글 단 글</Button>
      </TabContent>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onRequestClose={() => setIsPasswordModalOpen(false)}
      />
      <ChangeUsernameModal
        isOpen={isUsernameModalOpen}
        onRequestClose={() => setIsUsernameModalOpen(false)}
        setUsername={setUsername}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onRequestClose={() => setIsDeleteAccountModalOpen(false)}
      />
    </Container>
  );
};

export default MyPageTemplate;