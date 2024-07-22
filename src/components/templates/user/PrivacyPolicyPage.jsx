import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 1rem; /* 양쪽 여백 추가 */
`;

const Section = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const Content = styled.div`
  padding: 0.5rem 0;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const PrivacyPolicyPage = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Container>
      <h1>개인정보 처리방침</h1>
      <Section>
        <Title onClick={() => toggleSection("section1")}>
          <span>제1장 총칙</span>
          <span>{openSections["section1"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section1"]}>
          <p>1. 개인정보의 처리 목적...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section2")}>
          <span>제2장 개인정보의 처리 및 보유 기간</span>
          <span>{openSections["section2"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section2"]}>
          <p>2. 개인정보의 처리 및 보유 기간...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section3")}>
          <span>제3장 개인정보의 제3자 제공에 관한 사항</span>
          <span>{openSections["section3"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section3"]}>
          <p>3. 개인정보의 제3자 제공에 관한 사항...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section4")}>
          <span>제4장 개인정보의 파기절차 및 파기방법</span>
          <span>{openSections["section4"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section4"]}>
          <p>4. 개인정보의 파기절차 및 파기방법...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section5")}>
          <span>제5장 개인정보처리의 위탁에 관한 사항</span>
          <span>{openSections["section5"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section5"]}>
          <p>5. 개인정보처리의 위탁에 관한 사항...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section6")}>
          <span>제6장 정보주체와 법정대리인의 권리 · 의무 및 그 행사방법에 관한 사항</span>
          <span>{openSections["section6"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section6"]}>
          <p>6. 정보주체와 법정대리인의 권리 · 의무 및 그 행사방법에 관한 사항...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section7")}>
          <span>제7장 개인정보 보호책임자의 성명 또는 개인정보 보호업무 및 관련 고충사항을 처리하는 부서의 명칭과 전화번호 등 연락처</span>
          <span>{openSections["section7"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section7"]}>
          <p>7. 개인정보 보호책임자의 성명...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section8")}>
          <span>제8장 처리하는 개인정보의 항목</span>
          <span>{openSections["section8"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section8"]}>
          <p>8. 처리하는 개인정보의 항목...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section9")}>
          <span>제9장 개인정보의 안전성 확보조치에 관한 사항</span>
          <span>{openSections["section9"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section9"]}>
          <p>9. 개인정보의 안전성 확보조치에 관한 사항...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section10")}>
          <span>제10장 개인정보 처리방침의 변경에 관한 사항</span>
          <span>{openSections["section10"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section10"]}>
          <p>10. 개인정보 처리방침의 변경에 관한 사항...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section11")}>
          <span>제11장 개인정보의 열람청구를 접수 · 처리하는 부서</span>
          <span>{openSections["section11"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section11"]}>
          <p>11. 개인정보의 열람청구를 접수 · 처리하는 부서...</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section12")}>
          <span>제12장 정보주체의 권익침해에 대한 구제방법</span>
          <span>{openSections["section12"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section12"]}>
          <p>12. 정보주체의 권익침해에 대한 구제방법...</p>
        </Content>
      </Section>
    </Container>
  );
};

export default PrivacyPolicyPage;
