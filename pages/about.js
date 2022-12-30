import { Container, Heading } from "@chakra-ui/react"
import Section from "../components/section"

const About = () => {
  return (
    <Container p={4} maxW='container.xl'>
      <Section delay={0.1}>
        <Heading as='h2' align='center' variant='section-title'>
          About
        </Heading>
      </Section>
      <Section delay={0.2}>

      </Section>
      <Section delay={0.3}>
        
      </Section>
    </Container>
  )
}

export default About