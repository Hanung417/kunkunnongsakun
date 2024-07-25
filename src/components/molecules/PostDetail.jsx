import React from "react";
import styled from "styled-components";
import { FaEllipsisV, FaThList } from "react-icons/fa";
import ConfirmModal from "../atoms/ConfirmModal";
import { useNavigate } from "react-router-dom";

const PostMeta = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 16px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
`;

const PostContent = styled.div`
  min-height: 150px;
  margin-bottom: 12px;
  color: #333;
  font-size: 18px;
  line-height: 1.6;
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left; 
  word-break: break-word;
  display: flex;
  align-items: flex-start; 
  width: 100%; 
`;

const PostImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  width: 100%;
  height: auto;
  margin: 16px auto 0 auto; /* Center the image */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: block; 
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; 
  position: relative;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #444;
  padding-bottom: 8px;
  text-align: center;
  flex: 1;
  word-break: break-word; 
`;

const PostTypeBadge = styled.span`
  font-size: 14px;
  color: white;
  background-color: #4aaa87;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
`;

const SettingsIcon = styled(FaEllipsisV)`
  cursor: pointer;
  font-size: 24px;
  color: #888;
`;

const SettingsMenu = styled.div`
  position: absolute;
  top: 90%;
  right: 0;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: ${(props) => (props.show ? "block" : "none")};
  z-index: 1;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SettingsMenuItem = styled.button`
  background: none;
  border: none;
  padding: 12px 24px;
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background: #f5f5f5;
    color: #4aaa87;
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #ddd;
  margin: 4px 0;
`;

const ListIconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #888;
  margin-right: 16px;

  &:hover {
    color: #3e8e75;
  }

  span {
    margin-left: 8px;
    font-size: 16px;
  }
`;

const PostDetail = ({
  post,
  currentUserId,
  showSettingsMenu,
  settingsMenuRefs,
  openModal,
  handleSettingsClick,
  isModalOpen,
  closeModal,
  handleDeletePost
}) => {
  const navigate = useNavigate();

  const getPostTypeLabel = (postType) => {
    switch (postType) {
      case "sell":
        return "판매게시판";
      case "buy":
        return "구매게시판";
      case "exchange":
        return "품앗이게시판";
      default:
        return "";
    }
  };

  const handleBoardClick = (postType) => {
    switch (postType) {
      case 'buy':
        navigate("/buyboard");
        break;
      case 'sell':
        navigate("/sellboard");
        break;
      case 'exchange':
        navigate("/exchangeboard");
        break;
      default:
        navigate("/board");
        break;
    }
  };

  return (
    <>
      <TitleBar>
        <ListIconContainer onClick={() => handleBoardClick(post.post_type)}>
          <FaThList />
        </ListIconContainer>
        <Title>{post.title}</Title>
        {String(currentUserId) === String(post.user_id) && (
          <>
            <SettingsIcon onClick={() => handleSettingsClick(0)} />
            <SettingsMenu show={showSettingsMenu[0]} ref={(el) => (settingsMenuRefs.current[0] = el)}>
              <SettingsMenuItem onClick={() => navigate(`/post/edit/${post.id}`)}>
                수정
              </SettingsMenuItem>
              <Divider />
              <SettingsMenuItem onClick={openModal}>
                삭제
              </SettingsMenuItem>
            </SettingsMenu>
          </>
        )}
      </TitleBar>
      <PostTypeBadge>{getPostTypeLabel(post.post_type)}</PostTypeBadge>
      <PostMeta>
        <span>작성자: {post.username}</span>
        <span>작성일: {new Date(post.creation_date).toLocaleDateString()}</span>
      </PostMeta>
      <PostContent>{post.content}</PostContent>
      {post.image && <PostImage src={post.image} alt="Post Image" />}
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title="삭제 확인"
        content="이 게시글을 삭제하시겠습니까?"
        onConfirm={handleDeletePost}
        closeModal={closeModal}
        confirmText="삭제"
        cancelText="취소"
        confirmColor="#e53e3e"
        confirmHoverColor="#c53030"
        cancelColor="#4aaa87"
        cancelHoverColor="#3b8b6d"
      />
    </>
  );
};

export default PostDetail;