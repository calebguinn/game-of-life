import { Box, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import Image from "next/image";
import { AiFillYoutube } from "react-icons/ai"

export const ResourceItem = ({ children, href, title, thumbnail, width, height, float }) => (
  <Box 
    w={width}
    h={height}
    m={5}
    textAlign="center" 
    borderRadius="12px" 
    float={float}
    overflow="hidden"
    borderWidth={1}
  >
    <LinkBox cursor="pointer">
      <Image
        src={thumbnail}
        alt={title}
        placeholder="blur"
        loading="lazy"
      />
      <LinkOverlay href={href} rel="noopener noreferrer" target="_blank">
        <Text mt={2} mb={2}>{title}</Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

export const VideoBox = ({ children, href, title, width, height }) => (
  <Box
    w={width}
    h={height}
    textAlign="center"
    borderRadius="12px"
    overflow="hidden"
    align="center"
  >
    <iframe 
      width={width} 
      height={height} 
      src={href} 
      title={title} 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    >
    </iframe>
    <Text fontSize={14}>{children}</Text>
  </Box>
)