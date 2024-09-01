import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import theme from "./component/theme/theme.js";
import AppContextProvider from './context/Context.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
    </AppContextProvider>
  </BrowserRouter>
)
