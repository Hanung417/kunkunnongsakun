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
  max-width: 75rem;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
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

  @media (max-width: 768px) {
    padding: 16px;
  }
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
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right: 10px;
  input[type="checkbox"] {
    opacity: 0;
    width: 0;
    height: 0;
  }
  input[type="checkbox"] + span {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
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
  font-size: 16px;
  color: #333;
  cursor: pointer;
  flex: 1;
  margin-left: 10px;
`;

const ToggleIcon = styled.div`
  cursor: pointer;
  margin-left: 10px;
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

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 0;
    font-size: 14px;
  }
`;

const InfoButton = styled.img`
  cursor: pointer;
  width: 20px; /* 버튼 크기 조절 */
  height: 20px; /* 버튼 크기 조절 */
  margin-left: auto; /* 텍스트와의 간격 조절 */
`;

const ToggleContent = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  background: #f0f0f0;
  border-left: 3px solid #4aaa87;
  margin: 5px 0 10px;
  padding: 10px;
  position: relative;
  ${props => props.show && css`
    display: flex;
  `}
`;

const StepperContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 8px;
  text-align: center;
`;

const StepCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => (props.active ? '#4aaa87' : '#e0e0e0')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }
`;

const StepLabel = styled.div`
  margin-top: 4px;
  font-size: 14px;
  color: ${props => (props.active ? '#4aaa87' : '#6b7280')};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const PolicyAgreement = () => {
  const [isAgreed, setIsAgreed] = useState({
    allChecked: false,
    ageCheck: false,
    usingListCheck: false,
  });
  const [showDetails, setShowDetails] = useState({
    ageCheck: false,
    usingListCheck: false,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate('/main');
    }
  }, [navigate]);

  useEffect(() => {
    const { ageCheck, usingListCheck } = isAgreed;
    const allChecked = ageCheck && usingListCheck;
    setIsAgreed(prev => ({ ...prev, allChecked }));
  }, [isAgreed.ageCheck, isAgreed.usingListCheck]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setIsAgreed(prev => ({
      ...prev,
      [name]: checked,
      ...(name === "allChecked" ? {
        ageCheck: checked,
        usingListCheck: checked,
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
        <Step>
          <StepCircle active={currentStep === 1}>1</StepCircle>
          <StepLabel active={currentStep === 1}>약관 동의</StepLabel>
        </Step>
        <Step>
          <StepCircle active={currentStep === 2}>2</StepCircle>
          <StepLabel active={currentStep === 2}>회원 정보 입력</StepLabel>
        </Step>
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
              { key: 'ageCheck', label: '서비스 이용약관(필수)', content: '자세한 사항은 더보기를 참고해주세요.' },
              { key: 'usingListCheck', label: '개인정보 수집 및 이용동의(필수)', content: '○ 개인정보 수집·이용목적 : 본인확인 및 본인 인증, 서비스 제공, 서비스 품질 개선 및 신규 서비스 개발을 위한 통계관리\n\n○ 개인정보 수집항목. 필수항목 : 성명, 이메일, 비밀번호\n\n○ 개인정보의 보유 및 이용기간 : 회원탈퇴 시 까지\n\n○ 동의거부 권리 및 동의거부에 따른 불이익 : 귀하는 개인정보 제공 및 동의를 거부할 권리가 있으며, 위 항목 동의 거부 시 꾼꾼농사꾼에서 제공하는 서비스 이용이 제한될 수 있습니다.'},
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
                  {key === 'ageCheck' && (
                    <InfoButton 
                      src="../more_info.png" 
                      alt="약관 상세 보기" 
                      onClick={() => navigate('/terms-of-service')} 
                    />
                  )}
                </ToggleContent>
              </div>
            ))}
          </CheckboxGroup>
          <Button disabled={!isAgreed.allChecked} onClick={handleSubmit}>회원가입 진행하기</Button>
        </AgreementSection>
      )}
      {currentStep === 2 && <SignupTemplate />}
    </Container>
  );
};

export default PolicyAgreement;
