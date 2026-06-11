//src/styles/styles.ts
import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: #0f1e2e;
    color: #cbd5e1;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 52px;
  }
`