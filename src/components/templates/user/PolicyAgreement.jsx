import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styled, { css } from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import SignupTemplate from "./SignupTemplate";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #f9f9f9;
  height: 100vh;
  box-sizing: border-box;
  overflow: auto;
`;

const AgreementSection = styled.section`
  width: 100%;
  max-height: 1000px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const CustomCheckbox = styled.label`
  position: relative;
  width: 18px;
  height: 18px;
  cursor: pointer;
  input[type="checkbox"] {
    opacity: 0;
    width: 0;
    height: 0;
  }
  input[type="checkbox"] + span {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #eee;
    border: 1px solid #ddd;
    border-radius: 3px;
    transition: background-color 0.3s;
  }
  input[type="checkbox"]:checked + span {
    background-color: #4aaa87;
    border-color: #4aaa87;
  }
  input[type="checkbox"] + span:after {
    content: "";
    position: absolute;
    display: none;
  }
  input[type="checkbox"]:checked + span:after {
    display: block;
  }
  input[type="checkbox"] + span:after {
    left: 6px;
    top: 3px;
    width: 3px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  cursor: pointer;
  flex: 1;
  margin-left: 10px;
`;

const ToggleIcon = styled.div`
  cursor: pointer;
`;

const Button = styled.button`
  padding: 10px 15px;
  font-size: 16px;
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

const ToggleContent = styled.div`
  background: #f0f0f0;
  border-left: 3px solid #4aaa87;
  margin: 5px 0 10px;
  padding: 10px;
  display: none;
  ${props => props.show && css`
    display: block;
  `}
`;

const StepperContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Step = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => (props.active ? '#4aaa87' : '#e0e0e0')};
  margin: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  font-weight: bold;
`;

const PolicyAgreement = () => {
  const [isAgreed, setIsAgreed] = useState({
    allChecked: false,
    ageCheck: false,
    usingListCheck: false,
    personalInfoCheck: false,
    marketingInfoCheck: false,
  });
  const [showDetails, setShowDetails] = useState({
    ageCheck: false,
    usingListCheck: false,
    personalInfoCheck: false,
    marketingInfoCheck: false,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate('/main');
    }
  }, [navigate]);

  useEffect(() => {
    const { ageCheck, usingListCheck, personalInfoCheck, marketingInfoCheck } = isAgreed;
    const allChecked = ageCheck && usingListCheck && personalInfoCheck && marketingInfoCheck;
    setIsAgreed(prev => ({ ...prev, allChecked }));
  }, [isAgreed.ageCheck, isAgreed.usingListCheck, isAgreed.personalInfoCheck, isAgreed.marketingInfoCheck]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setIsAgreed(prev => ({
      ...prev,
      [name]: checked,
      ...(name === "allChecked" ? {
        ageCheck: checked,
        usingListCheck: checked,
        personalInfoCheck: checked,
        marketingInfoCheck: checked,
      } : {})
    }));
  };

  const toggleDetail = (name) => {
    setShowDetails(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = () => {
    if (isAgreed.allChecked) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Container>
      <StepperContainer>
        <Step active={currentStep === 1}>1</Step>
        <Step active={currentStep === 2}>2</Step>
      </StepperContainer>
      {currentStep === 1 && (
        <AgreementSection expanded={Object.values(showDetails).some(value => value)}>
          <h2>회원가입 약관 동의</h2>
          <CheckboxGroup>
            <CheckboxWrapper>
              <CustomCheckbox htmlFor="allChecked">
                <input
                  type="checkbox"
                  name="allChecked"
                  id="allChecked"
                  checked={isAgreed.allChecked}
                  onChange={handleCheckboxChange}
                />
                <span></span>
              </CustomCheckbox>
              <Label htmlFor="allChecked">전체 동의합니다.</Label>
            </CheckboxWrapper>
            {[
              { key: 'ageCheck', label: '서비스 이용약관(필수)', content: '여기에 서비스 이용약관 세부 내용을 입력합니다.' },
              { key: 'usingListCheck', label: '개인정보 수집 및 이용동의(필수)', content: '여기에 개인정보 수집 및 이용동의 세부 내용을 입력합니다.' },
              { key: 'personalInfoCheck', label: '수집한 개인정보의 제3자 제공동의(필수)', content: '여기에 수집한 개인정보의 제3자 제공동의 세부 내용을 입력합니다.' },
              { key: 'marketingInfoCheck', label: '개인정보처리 위탁에 관한 동의(필수)', content: '여기에 개인정보처리 위탁에 관한 동의 세부 내용을 입력합니다.' }
            ].map(({ key, label, content }, idx) => (
              <div key={idx}>
                <CheckboxWrapper>
                  <CustomCheckbox htmlFor={key}>
                    <input
                      type="checkbox"
                      name={key}
                      id={key}
                      checked={isAgreed[key]}
                      onChange={handleCheckboxChange}
                    />
                    <span></span>
                  </CustomCheckbox>
                  <Label htmlFor={key}>{label}</Label>
                  <ToggleIcon onClick={() => toggleDetail(key)}>
                    {showDetails[key] ? <FaChevronUp /> : <FaChevronDown />}
                  </ToggleIcon>
                </CheckboxWrapper>
                <ToggleContent show={showDetails[key]}>
                  {content}
                </ToggleContent>
              </div>
            ))}
          </CheckboxGroup>
          <Button disabled={!isAgreed.allChecked} onClick={handleSubmit}>회원가입 진행하기</Button>
        </AgreementSection>
      )}
      {currentStep === 2 && (
        <AgreementSection>
          <SignupTemplate />
        </AgreementSection>
      )}
    </Container>
  );
};

export default PolicyAgreement;