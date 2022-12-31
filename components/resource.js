import { Box, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import Image from "next/image";

export const ResourceItem = ({ title, thumbnail, width, height }) => (
  <Box 
    w={width}
    h={height+20}
    textAlign="center" 
    borderRadius="lg" 
    overflow="hidden"
    borderWidth={1}
  >
    <Image
      src={thumbnail}
      alt={title}
      loading="lazy"
    />
    <Text mt={2} mb={2}>{title}</Text>
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