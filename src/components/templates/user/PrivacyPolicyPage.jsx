import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 2rem;
`;

const Section = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 0;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 1rem 0;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Content = styled.div`
  padding: 1rem;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  background-color: #f0f0f0;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ResponsiveH1 = styled.h1`
  font-size: 2.3rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.7rem;
  }

  @media (max-width: 387px) {
    font-size: 1.5rem;
  }
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
      <ResponsiveH1>&lt;꾼꾼농사꾼&gt; 개인정보 처리방침</ResponsiveH1>
      <Section>
        <Title onClick={() => toggleSection("section1")}>
          <span>제1장 개인정보의 처리 목적</span>
          <span>{openSections["section1"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section1"]}>
            <p>제1조(개인정보의 처리목적)</p>
            <p>&lt;꾼꾼농사꾼&gt;은 다음의 목적을 위하여
              개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는
              이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라
              별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <p>1. 홈페이지 회원 가입 및 관리<br />
              회원 가입의사 확인, 본인 식별·인증, 회원자격 유지·관리,
              서비스 부정이용 방지, 각종 고지통지, 고충처리 목적으로 개인정보를 처리합니다.
            </p>
            <p>
              2. 컨텐츠 또는 서비스 제공<br />
              서비스 제공, 콘텐츠 제공, 맞춤서비스 제공 목적으로 개인정보를 처리합니다.
            </p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section2")}>
          <span>제2장 개인정보의 처리 및 보유 기간</span>
          <span>{openSections["section2"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section2"]}>
            <p>제2조(개인정보의 처리 및 보유기간)</p>
            <p>① &lt;꾼꾼농사꾼&gt;은(는) 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <p>
              ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.<br />
              &ensp;1. 홈페이지 회원 가입 및 관리 : 가입일로부터 5년<br />
            </p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section4")}>
          <span>제3장 개인정보의 파기절차 및 파기방법</span>
          <span>{openSections["section4"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section4"]}>
            <p>제7조(개인정보의 파기)</p>
            <p>① &lt;꾼꾼농사꾼&gt;은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
            <p>② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</p>
            <p>③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>
            <p>1. 파기절차</p>
            <p>&lt;꾼꾼농사꾼&gt;은 파기하여야 하는 개인정보(또는 개인정보파일)에 대해 개인정보 파기계획을 수립하여 파기합니다. 개인정보위는 파기 사유가 발생한 개인정보(또는 개인정보 파일)를 선정하고, 꾼꾼농사꾼의 개인정보보호책임자의 승인을 받아 개인정보(또는 개인정보파일)를 파기합니다.</p>
            <p>2. 파기방법</p>
            <p>&lt;꾼꾼농사꾼&gt;은 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</p>
        </Content>
          
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section6")}>
          <span>
            제4장 정보주체와 법정대리인의 권리 · 의무 및 그 행사방법에 관한 사항
          </span>
          <span>{openSections["section6"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section6"]}>
            <p>제5조(정보주체와 법정대리인의 권리·의무 및 행사방법)</p>
            <p>1. 정보주체는 &lt;꾼꾼농사꾼&gt;에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
            <p>2. 제1항에 따른 권리 행사는 &lt;꾼꾼농사꾼&gt;에 대해 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, &lt;꾼꾼농사꾼&gt;은(는) 이에 대해 지체없이 조치하겠습니다.</p>
            <p>3. 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 "개인정보 처리 방법에 관한 고시(제2020-7호)" 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</p>
            <p>4. 개인정보 열람 및 처리정지 요구는 개인정보보호법 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.</p>
            <p>5. 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</p>
            <p>6. &lt;꾼꾼농사꾼&gt;은 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</p>
        </Content>
          
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section7")}>
          <span>
            제5장 개인정보 보호책임자에 관한 사항
          </span>
          <span>{openSections["section7"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section7"]}>
            <p>제10조(개인정보 보호책임자)</p>
            <p>1. &lt;꾼꾼농사꾼&gt;은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <p>▶ 개인정보 보호책임자</p>
            <p>
                &emsp;성명&ensp; : 이한웅<br />
                &emsp;연락처: 010-5054-8165<br />
                &emsp;이메일: lhu0770@gmail.com
            </p>
            <p>2. 정보주체께서는 &lt;꾼꾼농사꾼&gt;의 서비스(또는 사업)를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. &lt;꾼꾼농사꾼&gt;은 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.</p>
        </Content>
          
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section8")}>
          <span>제6장 처리하는 개인정보의 항목</span>
          <span>{openSections["section8"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section8"]}>
            <p>제6조(처리하는 개인정보 항목)</p>
            <p>&lt;꾼꾼농사꾼&gt;은 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <p>1. 홈페이지 회원 가입 및 관리</p>
            <p>· 필수항목: 성명, 비밀번호, 이메일주소</p>
            <p>2. 서비스 제공</p>
            <p>· 필수항목: 성명, 비밀번호, 이메일주소</p>
            <p>5. 인터넷 서비스 이용과정에서 아래 개인정보 항목이 자동으로 생성되어 수집될 수 있습니다.</p>
            <p>· IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section9")}>
          <span>제7장 개인정보의 안전성 확보조치에 관한 사항</span>
          <span>{openSections["section9"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section9"]}>
            <p>제8조(개인정보의 안전성 확보조치)</p>
            <p>&lt;꾼꾼농사꾼&gt;은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <p>1. 관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</p>
            <p>2. 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화</p>
            <p>3. 물리적 조치: 전산실, 자료보관실 등의 접근통제</p>
        </Content>
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section10")}>
          <span>제8장 개인정보 처리방침의 변경에 관한 사항</span>
          <span>{openSections["section10"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section10"]}>
            <p>제17조(개인정보 처리방침 변경)</p>
            <p>1. 이 개인정보 처리방침은 2024. 7. 22부터 적용됩니다.</p>
            <p>2. 이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.</p>
        </Content>
          
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section11")}>
          <span>제9장 개인정보의 열람청구를 접수 · 처리하는 부서</span>
          <span>{openSections["section11"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section11"]}>
            <p>제14조(개인정보 열람청구)</p>
            <p>정보주체는 「개인정보 보호법」 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다.</p>
            <p>&lt;꾼꾼농사꾼&gt;은 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.</p>
            <p>▶ 개인정보 열람청구 접수·처리</p>
            <p>담당자: 이건</p>
            <p>연락처: 010-7222-4762</p>
            <p>이메일: lg991027@naver.com</p>
        </Content>
          
      </Section>
      <Section>
        <Title onClick={() => toggleSection("section12")}>
          <span>제10장 정보주체의 권익침해에 대한 구제방법</span>
          <span>{openSections["section12"] ? "▲" : "▼"}</span>
        </Title>
        <Content isOpen={openSections["section12"]}>
            <p>제15조(권익침해 구제방법)</p>
            <p>정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁 해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.</p>
            <p>1. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)</p>
            <p>2. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)</p>
            <p>3. 대검찰청 : (국번없이) 1301 (www.spo.go.kr)</p>
            <p>4. 경찰청 : (국번없이) 182 (cyberbureau.police.go.kr)</p>
            <p>「개인정보보호법」 제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.</p>
            <p>※ 행정심판에 대해 자세한 사항은 중앙행정심판위원회(www.simpan.go.kr) 홈페이지를 참고하시기 바랍니다.</p>
        </Content>
      </Section>
    </Container>
  );
};

export default PrivacyPolicyPage;
