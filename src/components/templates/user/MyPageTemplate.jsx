import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { checkAuthStatus } from "../../../apis/user";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeUsernameModal from "./ChangeUsernameModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { FaUserEdit, FaKey, FaTrashAlt, FaPen, FaCommentDots } from "react-icons/fa";
import userIcon from "../../../images/user_icon.jpg"; // Adjust the path as needed

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  box-sizing: border-box;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
`;

const UserImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 4px 16px;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h2`
  font-size: 20px;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
`;

const Section = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
`;

const ActionList = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ActionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 100px;
  margin: 12px 0;
`;

const ActionIcon = styled.div`
  font-size: 28px;
  color: #4aaa87;
  margin-bottom: 10px;
`;

const ActionText = styled.div`
  font-size: 16px;
  color: #333;
`;

const MyPageTemplate = () => {
  const [username, setUsername] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await checkAuthStatus();
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
      <UserProfile>
        <UserImage src={userIcon} alt="User Icon" />
        <UserInfo>
          <UserName>
            {username}
          </UserName>
        </UserInfo>
      </UserProfile>

      <Section>
        <SectionTitle>설정</SectionTitle>
        <ActionList>
          <ActionItem onClick={handlePasswordChange}>
            <ActionIcon><FaKey /></ActionIcon>
            <ActionText>비밀번호 변경</ActionText>
          </ActionItem>
          <ActionItem onClick={handleUsernameChange}>
            <ActionIcon><FaUserEdit /></ActionIcon>
            <ActionText>사용자 이름 변경</ActionText>
          </ActionItem>
          <ActionItem onClick={handleAccountDeletion}>
            <ActionIcon><FaTrashAlt /></ActionIcon>
            <ActionText>회원 탈퇴</ActionText>
          </ActionItem>
        </ActionList>
      </Section>

      <Section>
        <SectionTitle>활동</SectionTitle>
        <ActionList>
          <ActionItem onClick={handleViewMyPosts}>
            <ActionIcon><FaPen /></ActionIcon>
            <ActionText>내가 쓴 글</ActionText>
          </ActionItem>
          <ActionItem onClick={handleViewMyCommentedPosts}>
            <ActionIcon><FaCommentDots /></ActionIcon>
            <ActionText>내가 댓글 단 글</ActionText>
          </ActionItem>
        </ActionList>
      </Section>

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