import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 1.25rem 0; /* 20px in rem */
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
  padding: 0.625rem 1.25rem; /* 10px 20px in rem */
  margin-top: 1.25rem; /* 20px in rem */
  margin-bottom: 1.25rem; /* 20px in rem */
  font-weight: 500;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 0.3125rem; /* 5px in rem */
  cursor: pointer;
  font-size: 1.25rem; /* 20px in rem */
  transition: background-color 0.3s;
  width: 9.375rem; /* 150px in rem */

  &:hover {
    background-color: #3e8e75;
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
  grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr)); /* 200px in rem */
  gap: 0.625rem; /* 10px in rem */
  max-width: 62.5rem; /* 1000px in rem */
  width: 100%;
  padding: 0 1.25rem; /* 20px in rem */
  box-sizing: border-box;
  margin-bottom: 1.25rem; /* 20px in rem */

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(11.25rem, 1fr)); /* 180px in rem */
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem; /* 8px in rem */
  }
`;

export const SessionItem = styled.div`
  background-color: #FFFFFF;
  border-radius: 0.625rem; /* 10px in rem */
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1); /* 2px 4px in rem */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Left align text */
  justify-content: space-between;
  padding: 0.625rem; /* 10px in rem */
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: auto; /* Adjust height based on content */

  &:hover {
    transform: translateY(-0.3125rem); /* 5px in rem */
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2); /* 8px 16px in rem */
  }

  &:active {
    transform: translateY(-0.125rem); /* 2px in rem */
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1); /* 4px 8px in rem */
  }
`;

export const SessionName = styled.span`
  font-size: 1.2rem; /* 24px in rem */
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem; /* 8px in rem */
  word-break: break-word;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1rem; /* 20px in rem */
    margin-bottom: 0.375rem; /* 6px in rem */
  }
`;

export const EditInput = styled.input`
  font-size: 1.25rem; /* 20px in rem */
  padding: 0.625rem; /* 10px in rem */
  margin-bottom: 0.5rem; /* 8px in rem */
  width: 80%;
  border: 2px solid #E0E0E0;
  border-radius: 0.625rem; /* 10px in rem */

  @media (max-width: 480px) {
    font-size: 1rem; /* 16px in rem */
    padding: 0.5rem; /* 8px in rem */
    margin-bottom: 0.375rem; /* 6px in rem */
  }
`;

export const SessionDetails = styled.div`
  font-size: 1rem; /* 16px in rem */
  margin-top: 0.5rem;
  margin-bottom: 0.5rem; /* 8px in rem */
  text-align: left;
  color: dimgray; /* Changed to black */

  @media (max-width: 480px) {
    font-size: 0.875rem; /* 14px in rem */
    margin-bottom: 0.375rem; /* 6px in rem */
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 0.5rem; /* 8px in rem */

  @media (max-width: 480px) {
    margin-top: 0.375rem; /* 6px in rem */
  }
`;

export const SaveButton = styled.button`
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 0.3125rem; /* 5px in rem */
  padding: 0.5rem 0.875rem; /* 8px 14px in rem */
  cursor: pointer;
  font-size: 1rem; /* 16px in rem */
  transition: background-color 0.3s;

  &:hover {
    background-color: #3e8e75;
  }

  @media (max-width: 480px) {
    padding: 0.375rem 0.625rem; /* 6px 10px in rem */
    font-size: 0.875rem; /* 14px in rem */
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 1rem; /* 16px in rem */

  &:hover {
    color: #c53030;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem; /* 14px in rem */
  }
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  color: #4aaa87;
  cursor: pointer;
  font-size: 1rem; /* 16px in rem */

  &:hover {
    color: #3e8e75;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem; /* 14px in rem */
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 1.25rem; /* 20px in rem */

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
    margin: 0 0.3125rem; /* 5px in rem */

    @media (max-width: 480px) {
      margin: 0.3125rem; /* 5px in rem */
    }
  }

  .pagination li a {
    padding: 0.625rem 0.75rem; /* 10px 12px in rem */
    border: 1px solid #ddd;
    border-radius: 0.3125rem; /* 5px in rem */
    cursor: pointer;
    color: #4aaa87;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;

    @media (max-width: 480px) {
      padding: 0.375rem 0.625rem; /* 6px 10px in rem */
      font-size: 0.875rem; /* 14px in rem */
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
  font-size: 1rem; /* 20px in rem */
  margin: 2rem;
`;