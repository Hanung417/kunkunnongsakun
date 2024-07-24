import styled from 'styled-components';
import { FaEllipsisV } from 'react-icons/fa';

export const Container = styled.div`
  margin: 0 auto;
  padding: 2rem;
  max-width: 50rem;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
`;

export const Required = styled.span`
  color: red;
  margin-left: 4px;
`;

export const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  transition: border-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #4aaa87;
  }
`;

export const Textarea = styled.textarea`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  transition: border-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #4aaa87;
  }
`;

export const Button = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #4aaa87;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: center;
  transition: background-color 0.3s;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  &:hover {
    background-color: #3e8e75;
  }
`;

export const Select = styled.select`
  padding: 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  transition: border-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #4aaa87;
  }
`;

export const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const FileInputLabel = styled.label`
  padding: 10px 16px;
  font-size: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #e6f9f1;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileName = styled.span`
  margin-top: 8px;
  font-size: 14px;
  color: #555;
`;

export const ImagePreview = styled.img`
  margin-top: 16px;
  max-width: 100%;
  border-radius: 8px;
`;

export const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: 16px;
`;

export const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 24px;
`;

export const Title = styled.div`
  font-size: 2rem;
  color: #444;
  border-bottom: 2px solid #4aaa87;
  padding-bottom: 8px;
  text-align: center;
`;

export const SettingsIcon = styled(FaEllipsisV)`
  position: absolute;
  right: 0;
  cursor: pointer;
  font-size: 24px;
  color: #888;
`;

export const SettingsMenu = styled.div`
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

export const SettingsMenuItem = styled.button`
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

export const Divider = styled.div`
  height: 1px;
  background-color: #ddd;
  margin: 4px 0;
`;

export const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 24px;
`;

export const CommentItem = styled.li`
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  margin-bottom: 12px;
  position: relative;
  margin-left: ${(props) => (props.isReply ? "40px" : "0")};

  &::before {
    content: "${(props) => (props.isReply ? "↳" : "")}";
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #4aaa87;
  }
`;

export const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 4px;
`;

export const CommentContent = styled.div`
  color: #555;
`;

export const CommentMeta = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
`;

export const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;

  button {
    background: none;
    border: none;
    color: #4aaa87;
    cursor: pointer;
  }
`;

export const CommentForm = styled.form`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 12px;
  margin-left: ${(props) => (props.isReply ? "40px" : "0")};
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  line-height: 1.5;
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  &:focus {
    outline: none;
    border-color: #4aaa87;
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.25);
  }
`;

export const CommentButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #4aaa87;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 20px;
  &:hover {
    color: #3e8e75;
  }
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

export const EditCommentButton = styled.button`
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  background-color: #4aaa87;
  border-radius: 8px;
  border: none;
  color: whitesmoke;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  &:hover {
    color: #3e8e75;
  }
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

export const SettingsIcon2 = styled(FaEllipsisV)`
  cursor: pointer;
  font-size: 20px;
  color: #888;
  position: absolute;
  right: 16px;
  top: 16px;
`;

export const SettingsMenu2 = styled.div`
  position: absolute;
  top: 30px;
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

export const SettingsMenuItem2 = styled.button`
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