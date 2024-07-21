import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  background-color: #f9f9f9;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 1.2rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3);
  margin-bottom: 5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  color: black;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin-bottom: 0.375rem;
  }
`;

export const Input = styled.input`
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #888;
  border-radius: 0.25rem;
  &:focus {
    outline: none;
    border-color: #2faa9a;
  }

  @media (max-width: 768px) {
    padding: 0.625rem;
    font-size: 0.75rem;
  }
`;

export const Button = styled.button`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.8rem;
  height: 2.75rem;
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 0.25rem;
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
    padding: 0.9375rem 0;
    font-size: 0.75rem;
    height: auto;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const SuccessMessage = styled.div`
  color: green;
  font-size: 1rem;
  margin: 0.8rem 0;
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;