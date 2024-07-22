// CropTest.js
import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 1rem; /* 16px */
`;

export const Title = styled.h1`
  margin-bottom: 1.5rem; /* 24px */
  color: #2c3e50;
  font-size: 1.75rem; /* 28px */
  font-weight: bold;
`;

export const InputContainer = styled.div`
  background-color: #ffffff;
  padding: 1.5rem; /* 24px */
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 35rem; /* 560px */
  position: relative;
  box-sizing: border-box;
  margin-bottom: 1rem; /* 16px */
`;

export const Label = styled.label`
  font-size: 0.875rem; /* 14px */
  color: #2c3e50;
  margin-bottom: 0.25rem; /* 4px */
  display: block;
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem; /* 16px */
  width: 100%;
  position: relative;
`;

export const Input = styled.input`
  padding: 0.5rem 0.75rem; /* 8px 12px */
  width: 100%;
  border: 1px solid #b0b8c1; /* 진한 테두리 색상 */
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 0.875rem; /* 14px */
  transition: border-color 0.3s;
  margin-bottom: 1rem; /* 16px */

  &:focus {
    border-color: #4aaa87;
    outline: none;
  }
`;

export const SmallInput = styled(Input)`
  width: 50%;
  padding-right: 1.5rem;
`;

export const AddButton = styled.button`
  padding: 0.5rem 1rem; /* 8px 16px */
  background-color: ${props => (props.disabled ? '#b2babb' : '#4aaa87')};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-left: 0.75rem; /* 12px */
  margin-bottom: 1rem; /* 16px */
  font-size: 0.875rem; /* 14px */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => (props.disabled ? '#b2babb' : '#6dc4b0')};
  }
`;

export const Button = styled.button`
  padding: 0.75rem 1rem; /* 12px 16px */
  margin-top: 0.75rem; /* 12px */
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem; /* 14px */
  font-weight: bold;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #6dc4b0;
  }
`;

export const CropContainer = styled.div`
  background-color: #ffffff;
  padding: 1.5rem; /* 24px */
  border-radius: 12px;
  margin-bottom: 1rem; /* 16px */
  position: relative;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 35rem; /* 560px */
  box-sizing: border-box;
`;

export const SummaryContainer = styled.div`
  background-color: #ffffff;
  padding: 1rem; /* 16px */
  border-radius: 12px;
  margin-top: 0.75rem; /* 12px */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 35rem; /* 560px */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const SummaryTitle = styled.h2`
  font-size: 1.25rem; /* 20px */
  color: #2c3e50;
  margin-bottom: 1rem; /* 16px */
  font-weight: bold;
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 0.75rem; /* 12px */
  border-radius: 12px;
  margin-bottom: 0.5rem; /* 8px */
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
`;

export const ItemText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CropName = styled.p`
  font-size: 0.875rem; /* 14px */
  color: #2c3e50;
  margin: 0;
`;

export const CropRatio = styled.p`
  font-size: 0.75rem; /* 12px */
  color: #7f8c8d;
  margin: 0;
`;

export const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem; /* 14px */
  font-weight: bold;
  padding: 0.5rem 0.75rem; /* 8px 12px */
  transition: background-color 0.3s;
  white-space: nowrap;

  &:hover {
    background-color: #c0392b;
  }
`;

export const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.75rem; /* 12px */
  margin-top: 0.5rem; /* 8px */
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 1;
  top: 100%;
  max-height: 200px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ListItem = styled.div`
  padding: 12px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f1f1f1;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
`;

export const StepTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: 1.25rem; /* 20px */
  color: #2c3e50;
  margin-bottom: 1.5rem; /* 24px */
  font-weight: bold;

  &::before {
    content: '${props => props.step}';
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #4aaa87;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 1rem;
    font-weight: bold;
  }
`;