import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeUsernameModal from "./ChangeUsernameModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { FaUserEdit, FaKey, FaTrashAlt, FaPen, FaCommentDots } from "react-icons/fa";
import { checkAuthStatus } from "../../../apis/user";
import { useLoading } from "../../../LoadingContext";
import TopBarLoader from "../../atoms/TopBarLoader";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1.5rem;
  box-sizing: border-box;
`;
const UserProfile = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background-color: #fff;
  width: 100%;
  max-width: 37.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 1.25rem;
  position: relative;
`;

const UserImage = styled.img`
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0.25rem 1rem;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
`;

const Section = styled.div`
  width: 100%;
  max-width: 37.5rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  padding: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  color: #333;
  margin-bottom: 1.25rem;
`;

const ActionList = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const ActionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 5rem;
  margin: 0.5rem 0;
`;

const ActionIcon = styled.div`
  font-size: 1.5rem; 
  color: #4aaa87;
  margin-bottom: 0.5rem; 
`;

const ActionText = styled.div`
  font-size: 0.875rem; 
  color: #333;
`;

const MyPageTemplate = () => {
  const { setIsLoading } = useLoading();
  const [username, setUsername] = useState("");
  const [isUsernameLoading, setIsUsernameLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (localStorage.getItem("isLoggedIn") === "true") {
          setIsAuthenticated(true);
          const response = await checkAuthStatus();
          setUsername(response.data.username);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
      setIsUsernameLoading(false);
      setIsLoading(false);
    };

    fetchUserData();
  }, [setIsLoading]);

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
      {isAuthenticated && (
        <>
          <UserProfile>
            <UserImage src={`${process.env.PUBLIC_URL}/user_icon.jpg`} alt="User Icon" />
            <UserInfo>
              {isUsernameLoading ? (
                <TopBarLoader color="#4aaa87" />
              ) : (
                <UserName>{username}</UserName>
              )}
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
        </>
      )}
    </Container>
  );
};

export default MyPageTemplate;