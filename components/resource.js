import { Box, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import Image from "next/image";

export const ResourceItem = ({ children, href, title, thumbnail,  width }) => (
  <Box maxW={width} textAlign="center">
    <LinkBox cursor="pointer">
      <Image
        src={thumbnail}
        alt={title}
        className="resource-thumbnail"
        placeholder="blur"
        loading="lazy"
      />
      <LinkOverlay href={href} rel="noopener noreferrer" target="_blank">

      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

export const ResourceItemStyle = () => {
  <Global
    styles={`
      .resource-thumbnail {
        border-radius: 12px;
      }
    `}
  />
}