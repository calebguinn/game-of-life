import { Container, Heading } from "@chakra-ui/react"
import Section from "../components/section"
import Paragraph from "../components/paragraph"

const About = () => {
  return (
    <Container p={4} maxW='container.md'>
      <Section delay={0.1}>
        <Heading pb={2} as='h2' align='center' variant='section-title'>
          History
        </Heading>
        <Paragraph>
          The Game of Life was created by British Mathematician John Conway in 1970. It is also
          known as Life or John Conway's Game of Life. The Game of Life is a 2-dimensional cellular
          automaton that follows a simple set of rules that have the ability to produce complex
          patterns and simulated biological life. The original game was created by Conway with the
          idea of creating a "universal" cellular automaton where unpredictable patterns could
          evolve. From years of experiments with variations of rules, the Game of Life was 
          eventually created and published in a 1970 issue of Scientific American and has since
          grown tremendously in popularity.
        </Paragraph>
      </Section>
      <Section delay={0.2}>
        <Paragraph>
          Since the first publication of the game, the Game of Life and the patterns that evolve
          from the simple rules governing it have been extensively documented and studied by people
          all around the world. The reason for the interest in the game comes from the complex
          patterns that have been produced using the rules of it as well as the fact that the 
          Game of Life is theoretically a universal Turing machine. Being a universal Turing machine
          means that any computation done by a computer could also theoretically be done using a 
          very large Game of Life board. 
        </Paragraph>
      </Section>
      <Section delay={0.3}>
        <Heading pb={2} as='h2' align='center' variant='section-title'>
          Patterns
        </Heading>
        <Paragraph>
          In the Game of Life, recurring patterns are usually classified into three categories
          based on their behavior over a certain amount of time. Still lifes are defined as
          structures that do not change from one generation to the next and tend to be
          smaller in size. Oscillators are structures that eventually return to their original
          position after a number of generations. The period associated with the Oscillator class
          refers to the number of steps required to return to the original state. Spaceships are
          defined as structures that move through a space keeping their overall structure and
          can function similarly to Oscillators but do not remain in the same position.
        </Paragraph>
      </Section>
      <Section delay={0.4}>
        <Heading pb={2} as='h2' align='center' variant='section-title'>
          More
        </Heading>
      </Section>
    </Container>
  )
}

export default About