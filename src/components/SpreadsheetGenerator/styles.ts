// SpreadsheetGenerator/styles.ts
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
  background: #152032;
  border: 1px solid #1e3248;
  border-radius: 8px;
  padding: 2.5rem 3rem;
  width: 400px;

  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  animation: ${fadeIn} 0.35s ease both;
`

export const Header = styled.div`
  border-bottom: 1px solid #1e3248;
  padding-bottom: 1.25rem;
  margin-bottom: 1.75rem;
`

export const Title = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #e2eaf4;
`

export const Subtitle = styled.p`
  font-size: 0.8rem;
  color: #c8d8e8;
  margin-top: 0.3rem;
  font-weight: 400;
`

export const FileLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #c8d8e8;
  margin-bottom: 0.5rem;
`

export const FileInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: #0f1e2e;
  border: 1px solid #1e3248;
  border-radius: 4px;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
  font-size: 0.825rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: border-color 0.15s;

  &:hover {
    border-color: #2a4a6a;
  }

  &::-webkit-file-upload-button {
    background: #1e3248;
    border: none;
    border-radius: 3px;
    padding: 4px 12px;
    color: #94a3b8;
    font-family: 'Inter', sans-serif;
    font-size: 0.775rem;
    font-weight: 500;
    cursor: pointer;
    margin-right: 10px;
    transition: background 0.15s;
  }

  &::-webkit-file-upload-button:hover {
    background: #2a4a6a;
  }
`

export const GenerateButton = styled.button`
  width: 100%;
  padding: 11px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.825rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffffff;
  background: #1a4fa0;
  transition: background 0.15s, transform 0.1s;

  &:hover {
    background: #1f5cb8;
  }

  &:active {
    background: #163d7a;
    transform: scale(0.995);
  }
`

export const SelectLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #c8d8e8;
  margin-bottom: 0.5rem;
`

export const Select = styled.select`
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: #0f1e2e;
  border: 1px solid #1e3248;
  border-radius: 4px;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
  font-size: 0.825rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  appearance: none;
  transition: border-color 0.15s;

  &:hover { border-color: #2a4a6a; }
  &:focus { outline: none; border-color: #1a4fa0; }
`