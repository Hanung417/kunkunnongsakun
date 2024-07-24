import React, { useState, useEffect } from "react";
import { checkUsername, sendVerificationEmail, signupUser } from "../../../apis/user";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../atoms/CustomModal";
import { Container, Form, InputGroup, Label, Input, Button, ErrorMessage, SuccessMessage } from "../../../styles/Form";

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
  const [verificationCodeSuccess, setVerificationCodeSuccess] = useState(""); // 성공 메시지 상태 추가
  const [verificationCodeError, setVerificationCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("오류"); // 모달 타이틀 상태 추가
  const [isSignupSuccess, setIsSignupSuccess] = useState(false); // 회원가입 성공 상태 추가
  const [isSendingCode, setIsSendingCode] = useState(false); // 인증번호 발송 중 상태 추가

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
    return /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
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
        setPasswordError("비밀번호는 영소문자, 숫자, 특수문자를 하나 이상 포함하여 8자 이상으로 입력하세요");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleUsernameCheck = () => {
    const username = formData.username;
    if (username.trim() === "") {
      setUsernameError("닉네임을 입력해주세요");
      setUsernameAvailable("");
      return;
    }
    checkUsername(username)
      .then((response) => {
        if (response.data.is_taken) {
          setUsernameError("이미 사용중인 닉네임입니다.");
          setUsernameAvailable("");
        } else {
          setUsernameError("");
          setUsernameAvailable("사용 가능한 닉네임입니다.");
        }
      })
      .catch(() => {
        setUsernameError("닉네임 중복체크에서 오류가 발생했습니다.");
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
    setIsSendingCode(true); // 인증번호 발송 중 상태 설정
    sendVerificationEmail(email)
      .then(() => {
        setVerificationCodeSent(true);
        setVerificationCodeSuccess("이메일로 인증번호가 발송되었습니다. 메일함을 확인해주세요");
      })
      .catch((error) => {
        const message = error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "인증번호 전송에서 오류가 발생했습니다.";
        setVerificationCodeError(message);
        setModalTitle("오류");
        setModalContent(message);
        setIsModalOpen(true);
      })
      .finally(() => {
        setIsSendingCode(false);
      });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, verification_code, password1, password2 } = formData;

    if (password1 !== password2) {
      setPasswordError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setModalTitle("오류");
      setModalContent("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setIsModalOpen(true);
      return;
    }

    signupUser({ username, email, verification_code, password1, password2 })
      .then(() => {
        setIsSignupSuccess(true);
        setModalTitle("알림");
        setModalContent("회원가입 성공");
        setIsModalOpen(true);
      })
      .catch((error) => {
        if (error.response) {
          const errors = error.response.data;
          setModalTitle("오류");
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
          setSignupError("회원가입에 실패했습니다. 다시 시도해주세요.");
          setModalContent("회원가입에 실패했습니다. 다시 시도해주세요.");
          setIsModalOpen(true);
        }
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (isSignupSuccess) {
      navigate("/login");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>닉네임</Label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleUsernameCheck}
            placeholder="닉네임"
            required
          />
          {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
          {usernameAvailable && <SuccessMessage>{usernameAvailable}</SuccessMessage>}
        </InputGroup>
        <InputGroup>
          <Label>이메일</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
              required
            />
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          {verificationCodeError && <ErrorMessage>{verificationCodeError}</ErrorMessage>}
          {verificationCodeSent && !verificationCodeError && <SuccessMessage>{verificationCodeSuccess}</SuccessMessage>}
            <Button type="button" onClick={handleSendVerificationCode} disabled={!validateEmail(formData.email) || isSendingCode}>
              {isSendingCode ? "인증번호 발송 중..." : "인증번호 전송"}
            </Button>
        </InputGroup>
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
        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
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
          {signupError && <ErrorMessage>{signupError}</ErrorMessage>}
        </InputGroup>
        <Button type="submit" disabled={isButtonDisabled}>가입하기</Button>
      </Form>
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} title={modalTitle} content={modalContent} />
    </Container>
  );
};

export default SignupTemplate;