import Link from "next/link";
import { Text, useColorModeValue } from '@chakra-ui/react'
import styled from "@emotion/styled";

const HeaderBox = styled.span`
	font-weight: bold;
	font-size: 32px;
	display: inline-flex;
	align-items: center;
	height: 30px;
	line-height: 20px;
	padding: 10px;

	> svg {
		transition: 200ms ease;
	}

	&:hover > svg {
		transform: rotate(20deg);
	}
`

const CustomHeader = () => {	
	return (
		<Link href="/" scroll={false}>
				<HeaderBox>
						<Text
						color={useColorModeValue('gray.800', 'whiteAlpha.900')}
						fontFamily='Press Start 2P'
						fontWeight="bold"
						ml={3}
						>
							Game of Life
					</Text>
				</HeaderBox>
		</Link>
	)
}

export default CustomHeader