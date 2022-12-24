import { AnimatePresence, motion } from "framer-motion";
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

const ThemeToggleButton = () => {
	const { toggleColorMode } = useColorMode()
	return (
		<AnimatePresence exitBeforeEnter initial={false}>
			<motion.div
				style={{ display: 'inline-block' }}
				key={useColorModeValue('light','dark')}
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 20, opacity: 0 }}
				transition={{ duration: 0.2 }}
			>
				<IconButton
					aria-label="Toggle theme"
					backgroundColor={useColorModeValue('#3c25d0','#F8D648')}
					color={useColorModeValue('white','black')}
					_hover={{ bg: useColorModeValue('#2a1a93', '#b3950f') }}
					icon={useColorModeValue(<MoonIcon />,<SunIcon />)}
					onClick={toggleColorMode}
				></IconButton>
			</motion.div>
		</AnimatePresence>
	)
}

export default ThemeToggleButton
