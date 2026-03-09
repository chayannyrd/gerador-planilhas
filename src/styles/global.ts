import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Inter', Arial, sans-serif;
    background: #1f3b5b;
    color: #e6edf3;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
`
