import {
  Box,
  Button,
  chakra,
  Container,
  Heading,
  Link,
  List,
  ListItem,
  OrderedList,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react'
import Image from 'next/image'
import Section from '../components/section'
import reproductionBefore from "/public/images/rules/reproductionBefore.png"
import reproductionAfter from "/public/images/rules/reproductionAfter.png"

const Home = () => {
  return (
    <Container p={4} maxW='container.xl'>
      <Section delay={0.1}>
        <Heading as="h2" align='center' variant="section-title">
          Rules
        </Heading>
      </Section>
      <Section delay={0.2}>
        <OrderedList>
            <ListItem>
              Reproduction
              <Image src={reproductionBefore} />
              <Image src={reproductionAfter} />
            </ListItem>
            <ListItem>
              Overpopulation
            </ListItem>
            <ListItem>
              Underpopulation
            </ListItem>
            <ListItem>
              Survival
            </ListItem>
          </OrderedList>
      </Section>
    </Container>
  )
}

export default Home