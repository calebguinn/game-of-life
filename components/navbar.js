import NextLink from 'next/link'
import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue,
  Text
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { IoLogoGithub } from 'react-icons/io5'
import ThemeToggleButton from './theme-toggle-button'
import CustomHeader from './header'

const LinkItem = ({ href, path, target, children, ...props }) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray200','whiteAlpha.900')
  return (
    <NextLink href={href} passHref scroll={false}>
      <Link
        p={2}
        bg={active ? '#70EFFC' : undefined}
        color={active ? '#202023' : inactiveColor}
        target={target}
        {...props}
      >
        {children}
      </Link>
    </NextLink>
  )
}

const NavBar = props => {
  const { path } = props

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#f0e7db40', '#050D2180')}
      css={{ backdropFilter: 'blur(10px)' }}
      zIndex={2}
      {...props}
    >
      <Container
        display="flex"
        p={4}
        maxW="container.xl"
        wrap="wrap"
        align="center"
        justify="space-between"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            <CustomHeader />
          </Heading>
        </Flex>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          <LinkItem href="/configs" path={path}>
            Configurations
          </LinkItem>
          <LinkItem href="/about" path={path}>
            About
          </LinkItem>
          <LinkItem 
            target="_blank"
            href="https://github.com/calgui1/game-of-life"
            path={path}
            display="inline-flex"
            alignItems="center"
            style={{ gap: 4 }}
            pl={2}
          >
            <IoLogoGithub />Source Code
          </LinkItem>
        </Stack>

        <Box flex={1} align="right">
          <ThemeToggleButton />
					<Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
						<Menu isLazy id="navbar-menu">
							<MenuButton	
								as={IconButton}
								icon={<HamburgerIcon />}
								variant="outline"
								aria-label="Options"
							/>
							<MenuList>
								<NextLink href="/" passHref>
									<MenuItem as={Link}>Play</MenuItem>
								</NextLink>
								<NextLink href="/configs" passHref>
									<MenuItem as={Link}>Configurations</MenuItem>
								</NextLink>
								<MenuItem	
									as={Link}
									href="https://github.com/calgui1/game-of-life"
								>
									Source Code
								</MenuItem>
							</MenuList>
						</Menu>
					</Box>
				</Box>

      </Container>
    </Box>
  )
}

export default NavBar