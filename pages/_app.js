import "@/styles/globals.css";
import { ChakraProvider } from '@chakra-ui/react'
import Home from "./index";

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Home {...pageProps} />
    </ChakraProvider>
  )
}
