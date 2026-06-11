import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.25rem 2rem;
  min-height: calc(100vh - 56px - 48px);
  animation: ${fadeIn} 0.35s ease both;
`

export const Hero = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2eaf4;
  margin-bottom: 0.5rem;
`

export const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  max-width: 480px;
  line-height: 1.6;
`

export const Card = styled.div`
  background: #152032;
  border: 1px solid #1e3248;
  border-radius: 12px;
  padding: 1.75rem;
  width: 100%;
  max-width: 640px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`

export const ApiRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`

export const ApiLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #c8d8e8;
  white-space: nowrap;
`

export const ApiInput = styled.input`
  flex: 1;
  background: #0f1e2e;
  border: 1px solid #1e3248;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  color: #94a3b8;
  font-family: 'Courier New', monospace;
  transition: border-color 0.15s;

  &::placeholder { color: #475569; }
  &:hover { border-color: #2a4a6a; }
  &:focus { outline: none; border-color: #1a4fa0; }
`

export const DropZone = styled.div<{ $isDragOver: boolean }>`
  border: 1.5px dashed ${({ $isDragOver }) => ($isDragOver ? '#3b82f6' : 'rgba(37,99,235,0.35)')};
  border-radius: 8px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  cursor: pointer;
  background: ${({ $isDragOver }) => ($isDragOver ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.04)')};
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    border-color: #3b82f6;
    background: rgba(37, 99, 235, 0.1);
  }
`

export const UploadIcon = styled.span`
  display: block;
  font-size: 2rem;
  color: #64748b;
  margin-bottom: 0.75rem;
`

export const DropTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 500;
  color: #e2eaf4;
  margin-bottom: 0.25rem;
`

export const DropHint = styled.p`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 1rem;
`

export const SelectButton = styled.button`
  background: #1a4fa0;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 0.55rem 1.5rem;
  font-size: 0.825rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #1f5cb8; }
  &:active { background: #163d7a; }
`

export const HiddenInput = styled.input`
  display: none;
`

export const FileListCard = styled.div`
  margin-top: 1rem;
  background: #0f1e2e;
  border: 1px solid #1e3248;
  border-radius: 8px;
  padding: 1rem;
`

export const FileListHeader = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #c8d8e8;
  margin-bottom: 0.75rem;
`

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.5rem;
  border-bottom: 1px solid #1e3248;
  cursor: grab;
  border-radius: 4px;
  transition: background 0.1s;

  &:last-of-type { border-bottom: none; }
  &:hover { background: rgba(255, 255, 255, 0.03); }
  &:active { cursor: grabbing; }
`

export const FileIcon = styled.span`
  font-size: 1rem;
  color: #ef4444;
  flex-shrink: 0;
`

export const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const FileName = styled.p`
  font-size: 0.8rem;
  color: #e2eaf4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FileSize = styled.p`
  font-size: 0.725rem;
  color: #64748b;
  margin-top: 1px;
`

export const RemoveButton = styled.button`
  font-size: 0.775rem;
  font-weight: 500;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  flex-shrink: 0;
  transition: background 0.1s;

  &:hover { background: rgba(239, 68, 68, 0.1); }
`

export const MergeButton = styled.button`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.825rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ffffff;
  background: #1a4fa0;
  margin-top: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.15s, transform 0.1s;

  &:hover:not(:disabled) { background: #1f5cb8; }
  &:active:not(:disabled) { background: #163d7a; transform: scale(0.995); }
  &:disabled { background: #1e3248; color: #475569; cursor: not-allowed; }
`

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  width: 100%;
  max-width: 640px;
  margin-top: 1.25rem;
`

export const FeatureCard = styled.div`
  background: #152032;
  border: 1px solid #1e3248;
  border-radius: 8px;
  padding: 1.25rem 1rem;
  text-align: center;
`

export const FeatureTitle = styled.h4`
  font-size: 0.825rem;
  font-weight: 600;
  color: #e2eaf4;
  margin-bottom: 0.4rem;
`

export const FeatureText = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.5;
`

export const StatusMessage = styled.div<{ $type: 'info' | 'success' | 'error' }>`
  width: 100%;
  max-width: 640px;
  border-radius: 6px;
  padding: 0.625rem 0.875rem;
  font-size: 0.8rem;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ $type }) =>
    $type === 'info' && `
      background: rgba(37,99,235,0.15);
      color: #93c5fd;
    `}
  ${({ $type }) =>
    $type === 'success' && `
      background: rgba(34,197,94,0.12);
      color: #86efac;
    `}
  ${({ $type }) =>
    $type === 'error' && `
      background: rgba(239,68,68,0.12);
      color: #fca5a5;
    `}
`

export const Footer = styled.footer`
  text-align: center;
  padding: 0.875rem;
  font-size: 0.75rem;
  color: #475569;
  border-top: 1px solid #1e3248;
  width: 100%;
`
