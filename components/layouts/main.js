import Head from "next/head";
import NavBar from '../navbar'
import { Box, Container } from "@chakra-ui/react"
import Game from "../gol";

const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Game of Life</title>
      </Head>

      <NavBar path={router.asPath} />
      <Container maxW="container.xl" pt={14}>
        <Game />
        {children}
      </Container>
    </Box>
  )
}

export default Main