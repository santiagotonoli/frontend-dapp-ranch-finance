import "../App.css";
import { Box, Button, Text, Image, Stack, Flex } from "@chakra-ui/react";

function Footer() {
  return (
    <Stack as="footer" isInline p={4} justifyContent="space-between" alignItems="center" marginTop="auto">
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" w="100%" ju>
        <Box>
          <Text color="white" fontWeight="bold" fontSize="lg" mb="5px">
            Integrations{" "}
          </Text>
          <Box>
            <a href="https://www.nftfi.com" target="_blank" rel="noopener noreferrer">
              <Image src="https://www.ranch.finance/static/media/partners/nftfi.png" alt="nftfi" borderRadius="full" boxSize="40px" />
            </a>
          </Box>
        </Box>

        <Box display="flex">
          <a href="https://medium.com/@RanchFinance" target="_blank" rel="noreferrer">
            <Image
              src="https://www.ranch.finance/static/media/social/medium.svg"
              alt="Medium Logo"
              className="mediumLogoColored"
              height="25px"
              pr="15px"
            />
          </a>
          <a href="https://www.twitter.com/RanchFinance" target="_blank" rel="noreferrer">
            <Image
              src="https://www.ranch.finance/static/media/social/twitter.svg"
              alt="twitter logo"
              className="twitterLogoColored"
              height="25px"
              pr="15px"
            />
          </a>
          <a href="https://discord.gg/RgeVBpXfD8" target="_blank" rel="noreferrer">
            <Image src="https://www.ranch.finance/static/media/social/discord.svg" alt="Discord logo" className="discordLogoColored" height="25px" />
          </a>
        </Box>
      </Flex>
    </Stack>
  );
}

export default Footer;
