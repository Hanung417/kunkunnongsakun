import React, { useState } from "react";
import styled from "styled-components";
import { checkUsername, sendVerificationEmail, signupUser } from "../../apis/user";

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 24px;
  border: 1px solid #2faa9a;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
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
  background-color: #2faa9a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const ErrorMessage = styled.div`
  color: red;
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
  const [emailError, setEmailError] = useState("");
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [verificationCodeError, setVerificationCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUsernameCheck = () => {
    const username = formData.username;
    checkUsername(username)
      .then((response) => {
        if (response.data.is_taken) {
          setUsernameError("This username is already taken.");
        } else {
          setUsernameError("");
        }
      })
      .catch((error) => {
        setUsernameError("An error occurred while checking the username.");
      });
  };

  const handleSendVerificationCode = () => {
    const email = formData.email;
    sendVerificationEmail(email)
      .then((response) => {
        setVerificationCodeSent(true);
        setVerificationCodeError("");
      })
      .catch((error) => {
        setVerificationCodeError(
          "An error occurred while sending the verification code."
        );
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, verification_code, password1, password2 } =
      formData;

    signupUser({ username, email, verification_code, password1, password2 })
      .then((response) => {
        console.log(response.data);
        // Handle successful signup, e.g., redirect or show success message
      })
      .catch((error) => {
        if (error.response) {
          const errors = error.response.data;
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
          // Handle other errors as needed
        } else {
          setSignupError("An error occurred during signup.");
        }
      });
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
            <Button type="button" onClick={handleSendVerificationCode}>
              인증번호
            </Button>
          </EmailInputWrapper>
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          {verificationCodeError && <ErrorMessage>{verificationCodeError}</ErrorMessage>}
        </EmailGroup>
        {verificationCodeSent && (
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
        )}
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
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
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
          {signupError && <ErrorMessage>{signupError}</ErrorMessage>}
        </InputGroup>
        <Button type="submit">가입하기</Button>
      </Form>
    </Container>
  );
};

export default SignupTemplate;
