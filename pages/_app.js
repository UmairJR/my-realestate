import "@/styles/globals.css";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Home from "./index";

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider disableGlobalStyle>
      <Home {...pageProps} />
    </ChakraProvider>
  )
}
