import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { checkUsername, sendVerificationEmail, signupUser } from "../../../apis/user";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../atoms/CustomModal";

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
  margin-bottom: 18px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const Input = styled.input`
  font-size: 14px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #2faa9a;
  }
`;

const EmailGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const EmailInputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const EmailInput = styled(Input)`
  flex: 1;
  margin-right: 8px;
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 14px;
  height: 44px; 
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #6dc4b0;
  }
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 12px;
  margin-top: 4px;
`;

const SignupTemplate = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    verification_code: "",
    password1: "",
    password2: "",
  });

  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState("");
  const [emailError, setEmailError] = useState("");
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [verificationCodeError, setVerificationCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("오류"); // 모달 타이틀 상태 추가

  const [isSignupSuccess, setIsSignupSuccess] = useState(false); // 회원가입 성공 상태 추가

  useEffect(() => {
    const { username, email, verification_code, password1, password2 } = formData;
    const isFormFilled = username && email && verification_code && password1 && password2;
    setIsButtonDisabled(!isFormFilled || usernameError || emailError || passwordError);
  }, [formData, usernameError, emailError, passwordError]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("올바른 이메일 형식을 입력하세요.");
      } else {
        setEmailError("");
      }
    }

    if (name === "password1") {
      if (!validatePassword(value)) {
        setPasswordError("비밀번호는 6자 이상이어야 합니다.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleUsernameCheck = () => {
    const username = formData.username;
    if (username.trim() === "") {
      setUsernameError("이름을 입력해주세요");
      setUsernameAvailable("");
      return;
    }
    checkUsername(username)
      .then((response) => {
        if (response.data.is_taken) {
          setUsernameError("이미 사용중인 이름입니다.");
          setUsernameAvailable("");
        } else {
          setUsernameError("");
          setUsernameAvailable("사용 가능한 이름입니다.");
        }
      })
      .catch(() => {
        setUsernameError("이름 중복체크에서 오류가 발생했습니다.");
        setUsernameAvailable("");
      });
  };

  const handleSendVerificationCode = () => {
    const email = formData.email;
    if (email.trim() === "") {
      setEmailError("이메일을 입력해주세요");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식을 입력하세요.");
      return;
    }
    sendVerificationEmail(email)
      .then(() => {
        setVerificationCodeSent(true);
        setVerificationCodeError("이메일로 인증번호가 발송되었습니다. 메일함을 확인해주세요");
      })
      .catch((error) => {
        const message = error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "인증번호 전송에서 오류가 발생했습니다.";
        setVerificationCodeError(message);
        setModalTitle("오류"); // 오류 시 모달 타이틀 설정
        setModalContent(message);
        setIsModalOpen(true);
      });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, verification_code, password1, password2 } = formData;

    if (password1 !== password2) {
      setPasswordError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setModalTitle("오류"); // 오류 시 모달 타이틀 설정
      setModalContent("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setIsModalOpen(true);
      return;
    }

    signupUser({ username, email, verification_code, password1, password2 })
      .then(() => {
        setIsSignupSuccess(true); // 회원가입 성공 상태 설정
        setModalTitle("알림"); // 성공 시 모달 타이틀 설정
        setModalContent("회원가입 성공");
        setIsModalOpen(true);
      })
      .catch((error) => {
        if (error.response) {
          const errors = error.response.data;
          setModalTitle("오류"); // 오류 시 모달 타이틀 설정
          if (errors.message) {
            setModalContent(errors.message);
            setIsModalOpen(true);
          }
          if (errors.username) {
            setUsernameError(errors.username[0]);
          } else {
            setUsernameError("");
          }
          if (errors.email) {
            setEmailError(errors.email[0]);
          } else {
            setEmailError("");
          }
          if (errors.verification_code) {
            setVerificationCodeError(errors.verification_code[0]);
          } else {
            setVerificationCodeError("");
          }
          if (errors.password1) {
            setPasswordError(errors.password1[0]);
          } else {
            setPasswordError("");
          }
        } else {
          setSignupError("An error occurred during signup.");
          setModalContent("An error occurred during signup.");
          setIsModalOpen(true);
        }
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (isSignupSuccess) {
      navigate("/login"); // 회원가입 성공 시 로그인 페이지로 이동
    }
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>이름</Label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleUsernameCheck}
            placeholder="이름"
            required
          />
          {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
          {usernameAvailable && <SuccessMessage>{usernameAvailable}</SuccessMessage>}
        </InputGroup>
        <EmailGroup>
          <Label>이메일</Label>
          <EmailInputWrapper>
            <EmailInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
              required
            />
            <Button type="button" onClick={handleSendVerificationCode} disabled={!validateEmail(formData.email)}>
              인증번호
            </Button>
          </EmailInputWrapper>
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          {verificationCodeError && <ErrorMessage>{verificationCodeError}</ErrorMessage>}
        </EmailGroup>
        <InputGroup>
          <Label>인증번호</Label>
          <Input
            type="text"
            name="verification_code"
            value={formData.verification_code}
            onChange={handleChange}
            placeholder="인증번호"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>비밀번호</Label>
          <Input
            type="password"
            name="password1"
            value={formData.password1}
            onChange={handleChange}
            placeholder="비밀번호"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>비밀번호 확인</Label>
          <Input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            required
          />
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          {signupError && <ErrorMessage>{signupError}</ErrorMessage>}
        </InputGroup>
        <Button type="submit" disabled={isButtonDisabled}>가입하기</Button>
      </Form>
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} title={modalTitle} content={modalContent} />
    </Container>
  );
};

export default SignupTemplate;