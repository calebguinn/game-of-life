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
import overpopulationBefore from "/public/images/rules/overpopulationBefore.png"
import overpopulationAfter from "/public/images/rules/overpopulationAfter.png"
import underpopulationBefore from "/public/images/rules/underpopulationBefore.png"
import underpopulationAfter from "/public/images/rules/underpopulationAfter.png"
import survivalBefore from "/public/images/rules/survivalBefore.png"
import survivalAfter from "/public/images/rules/survivalAfter.png"

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
              <Image src={reproductionBefore} width={100} />
              <Image src={reproductionAfter} width={100} />
            </ListItem>
            <ListItem>
              Overpopulation
              <Image src={overpopulationBefore} width={100} />
              <Image src={overpopulationAfter} width={100} />
            </ListItem>
            <ListItem>
              Underpopulation
              <Image src={underpopulationBefore} width={100} />
              <Image src={underpopulationAfter} width={100} />
            </ListItem>
            <ListItem>
              Survival
              <Image src={survivalBefore} width={100} />
              <Image src={survivalAfter} width={100} />
            </ListItem>
          </OrderedList>
      </Section>
    </Container>
  )
}

export default Home