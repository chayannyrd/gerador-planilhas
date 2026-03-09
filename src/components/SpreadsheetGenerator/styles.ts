import styled from 'styled-components'

export const Container = styled.div`
  background: #161b22;
  padding: 2.5rem 3rem;
  border-radius: 14px;
  min-width: 360px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  text-align: center;
`

export const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`

export const FileInput = styled.input`
  width: 100%;
  margin-bottom: 1.8rem;
  color: #c9d1d9;

  &::-webkit-file-upload-button {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 6px 12px;
    color: #c9d1d9;
    cursor: pointer;
  }

  &::-webkit-file-upload-button:hover {
    background: #30363d;
  }
`

export const GenerateButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #1f6feb, #1158c7);
  color: white;
  border: none;
  padding: 12px 0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    filter: brightness(0.95);
  }
`
