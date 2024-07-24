import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 0; 
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem; 
  margin-top: 1.25rem; 
  margin-bottom: 1.25rem; 
  font-weight: 600;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 0.3125rem; 
  cursor: pointer;
  font-size: 1rem; 
  transition: background-color 0.3s;
  width: 9.375rem; 

  &:hover {
    background-color: #3e8e75;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

export const SessionListContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

export const SessionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr)); 
  gap: 0.625rem;
  max-width: 62.5rem;
  width: 100%;
  padding: 0 1.25rem;
  box-sizing: border-box;
  margin-bottom: 1.25rem; 

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(11.25rem, 1fr)); 
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
`;

export const SessionItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 0.625rem; 
  border: 1px solid #ccc;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2); 
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  justify-content: space-between;
  padding: 0.625rem; 
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: auto; 

  &:hover {
    transform: translateY(-0.3125rem); 
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2); 
  }

  &:active {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1); 
  }
`;

export const SessionName = styled.span`
  font-size: 1.2rem; 
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem; 
  word-break: break-word;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1rem; 
    margin-bottom: 0.375rem;
  }
`;

export const EditInput = styled.input`
  font-size: 1.25rem; 
  padding: 0.625rem; 
  margin-bottom: 0.5rem; 
  width: 80%;
  border: 2px solid #E0E0E0;
  border-radius: 0.625rem; 

  @media (max-width: 480px) {
    font-size: 1rem; 
    padding: 0.5rem;
    margin-bottom: 0.375rem; 
  }
`;

export const SessionDetails = styled.div`
  font-size: 1rem; 
  margin-top: 0.5rem;
  margin-bottom: 0.5rem; 
  text-align: left;
  color: dimgray; 

  @media (max-width: 480px) {
    font-size: 0.875rem; 
    margin-bottom: 0.375rem;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 0.5rem; 

  @media (max-width: 480px) {
    margin-top: 0.375rem;
  }
`;

export const SaveButton = styled.button`
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 0.3125rem; 
  padding: 0.5rem 0.875rem; 
  cursor: pointer;
  font-size: 1rem; /* 16px in rem */
  transition: background-color 0.3s;

  &:hover {
    background-color: #3e8e75;
  }

  @media (max-width: 480px) {
    padding: 0.375rem 0.625rem; 
    font-size: 0.875rem; 
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 1rem; 

  &:hover {
    color: #c53030;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem; 
  }
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  color: #4aaa87;
  cursor: pointer;
  font-size: 1rem; 

  &:hover {
    color: #3e8e75;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 1.25rem; 

  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    @media (max-width: 480px) {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .pagination li {
    margin: 0 0.3125rem; 

    @media (max-width: 480px) {
      margin: 0.3125rem; 
    }
  }

  .pagination li a {
    padding: 0.625rem 0.75rem; 
    border: 1px solid #ddd;
    border-radius: 0.3125rem; 
    cursor: pointer;
    color: #4aaa87;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;

    @media (max-width: 480px) {
      padding: 0.375rem 0.625rem; 
      font-size: 0.875rem; 
    }
  }

  .pagination li a:hover {
    background-color: #f5f5f5;
    color: #3e8e75;
  }

  .pagination li.active a {
    background-color: #4aaa87;
    color: white;
    border: none;
  }

  .pagination li.previous a,
  .pagination li.next a {
    color: #888;
  }

  .pagination li.disabled a {
    color: #ccc;
    cursor: not-allowed;
  }
`;

export const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 1rem;
  margin: 2rem;
`;