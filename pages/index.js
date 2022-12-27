import {
  Container,
  Heading,
  ListItem,
  OrderedList,
  Spacer,
  Stack,
  Text
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
import { ArrowForwardIcon } from '@chakra-ui/icons'

const Home = () => {
  return (
    <Container p={4} maxW='container.md'>
      <Section delay={0.1}>
        <Heading as="h2" align='center' variant="section-title">
          Rules
        </Heading>
      </Section>
      <Section delay={0.2}>
        <OrderedList>
            <ListItem fontFamily='heading'>
              <Text>Reproduction</Text>
              <Stack align='center' p={5} direction='row'> 
                <Text maxW='33%' fontFamily='sans-serif'>
                  Any dead cell with 2 or more live neighbors comes to life by reproduction.
                </Text>
                <Spacer />
                <Image src={reproductionBefore} width={100} />
                <ArrowForwardIcon boxSize={6} />
                <Image src={reproductionAfter} width={100} />
              </Stack> 
            </ListItem>
            <ListItem fontFamily='heading'>
              <Text>Overpopulation</Text>
              <Stack align='center' p={5} direction='row'>
                <Text maxW='33%' fontFamily='sans-serif'>
                  Any live cell with 4 or more neighbors will die from overpopulation.
                </Text>
                <Spacer />
                <Image src={overpopulationBefore} width={100} />
                <ArrowForwardIcon boxSize={6} />
                <Image src={overpopulationAfter} width={100} />
              </Stack>
            </ListItem>
            <ListItem fontFamily='heading'>
              <Text>Underpopulation</Text>
              <Stack align='center' p={5} direction='row'>
                <Text maxW='33%' fontFamily='sans-serif'>
                  Any live cell with less than 2 live neighbors dies from underpopulation.
                </Text>
                <Spacer />
                <Image src={underpopulationBefore} width={100} />
                <ArrowForwardIcon boxSize={6} />
                <Image src={underpopulationAfter} width={100} />
              </Stack>
            </ListItem>
            <ListItem fontFamily='heading'>
              <Text>Survival</Text>
              <Stack align='center' p={5} direction='row'>
                <Text maxW='33%' fontFamily='sans-serif'>
                  Any live cell with 2 or 3 live neighbors lives to the next generation.
                </Text>
                <Spacer />
                <Image src={survivalBefore} width={100} />
                <Image src={survivalAfter} width={100} />
              </Stack>
            </ListItem>
          </OrderedList>
      </Section>
    </Container>
  )
}

export default Home