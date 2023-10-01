import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f0f0;
`;

export const Title = styled.h1`
  margin-bottom: 20px;
`;

export const StyledInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  width: 250px;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 4px;
`;

export const StyledButton = styled.button`
  margin: 20px 0;
  padding: 10px 20px;
  background: #007BFF;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const StyledLink = styled.a`
  color: #007BFF;
  text-decoration: none;
`;
