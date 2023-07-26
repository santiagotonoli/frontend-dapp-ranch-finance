import React, { useState, useEffect } from "react";
import "../App.css";
import { Box, Button, Text, Image, Divider } from "@chakra-ui/react";

function Header() {
  const [connection, setConnection] = useState(false);
  const [isMetamask, setMetamask] = useState(false);

  useEffect(() => {
    const isConnect = async () => {
      if (typeof window.ethereum !== "undefined") {
        setMetamask(true);
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setConnection(true);
        }
      }
    };
    isConnect();
  }, []);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setConnection(true);
      }
      console.log(accounts);
    }
  };
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Box boxSize="15%" minWidth="100px">
            <a href="https://ranch.finance/">
              <img src="https://www.ranch.finance/static/media/logo/hat.png" alt="Logo" />
            </a>
          </Box>
          <a href="https://ranch.finance/" className="mobileHide">
            <Image src="https://www.ranch.finance/static/media/logo/ranch.finance_transparent.svg" alt="LogoText" boxSize="40%" minWidth="200px" />
          </a>
        </Box>
        <Box>
          {isMetamask ? (
            connection ? (
              <Box display="flex" alignItems="center">
                <Button
                  padding="1.5rem"
                  leftIcon={<img src="https://www.ranch.finance/static/media/icons/wallet.svg" alt="wallet" />}
                  colorScheme="green"
                  borderRadius="20"
                >
                  Connected
                </Button>
              </Box>
            ) : (
              <Box display="flex" alignItems="center">
                <Button
                  padding="1.5rem"
                  leftIcon={<img src="https://www.ranch.finance/static/media/icons/wallet.svg" alt="wallet" />}
                  colorScheme="blue"
                  borderRadius="20"
                  onClick={() => connect()}
                >
                  Connect Wallet
                </Button>
              </Box>
            )
          ) : (
            <Box display="flex" alignItems="center">
              <Text fontSize="sm" mt="2" fontWeight="bold">
                Please install Metamask
              </Text>
            </Box>
          )}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
}

export default Header;
