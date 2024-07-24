import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem; 
`;

export const Title = styled.h1`
  margin-bottom: 1.5rem; 
  color: #2c3e50;
  font-size: 1.75rem; 
  font-weight: bold;
`;

export const InputContainer = styled.div`
  background-color: #ffffff;
  padding: 1.5rem; 
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 35rem; 
  position: relative;
  box-sizing: border-box;
  margin-bottom: 1rem; 
`;

export const Label = styled.label`
  font-size: 0.875rem; 
  color: #2c3e50;
  margin-bottom: 0.25rem; 
  display: block;
`;

export const Input = styled.input`
  padding: 0.5rem 0.75rem; 
  width: 100%;
  border: 1px solid #b0b8c1; 
  border-radius: 8px;
  font-size: 0.875rem; 
  transition: border-color 0.3s;
  margin-bottom: 1rem; 

  &:focus {
    border-color: #4aaa87;
    outline: none;
  }
`;

export const SmallInput = styled(Input)`
  width: 50%;
  padding: 0.5rem 1.5rem; 
  height: 2.5rem;
`;


export const AddButton = styled.button`
  padding: 0 1.5rem; 
  height: 2.5rem; 
  min-width: 100px; 
  background-color: ${props => (props.disabled ? '#b2babb' : '#4aaa87')};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-bottom: 0.9rem;
  margin-left: 1rem; 
  font-size: 0.9rem; 
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center; 
  transition: background-color 0.3s;
  box-sizing: border-box; 

  &:hover {
    background-color: ${props => (props.disabled ? '#b2babb' : '#6dc4b0')};
  }
`;


export const Button = styled.button`
  padding: 0.75rem 1rem; 
  margin-top: 0.75rem; 
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem; 
  font-weight: bold;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #6dc4b0;
  }
`;

export const SummaryContainer = styled.div`
  background-color: #ffffff;
  padding: 1rem; 
  border-radius: 12px;
  margin-top: 0.75rem; 
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 35rem; 
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const SummaryTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.25rem; 
  font-weight: bold;
  text-align: left;

  &::before {
    content: '${props => props.step}';
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: #4aaa87;
    color: white;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 1rem;
    font-weight: bold;
  }
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 0.75rem; 
  border-radius: 12px;
  margin-bottom: 0.5rem; 
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
`;

export const ItemText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CropName = styled.p`
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
`;

export const CropRatio = styled.p`
  font-size: 0.875rem; 
  color: #7f8c8d;
  margin: 0;
`;

export const RemoveIcon = styled.div`
  color: #e74c3c;
  cursor: pointer;
  font-size: 1.25rem; 
  transition: color 0.3s;

  &:hover {
    color: #c0392b;
  }
`;

export const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.75rem; 
  margin-top: 0.5rem; 
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