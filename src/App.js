import React, { useState, useEffect, useRef } from "react";
import {
  ChakraProvider,
  Text,
  Box,
  Tabs,
  TabPanel,
  TabPanels,
  TabList,
  Tab,
  Hide,
  Skeleton,
  Tooltip,
  Stack,
  Button,
  Show,
  Input,
} from "@chakra-ui/react";
import { InfoOutlineIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import { abi, contractAddress } from "./constants";
import Header from "./components/Header";
import Bundle from "./components/Bundle";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";

const ALCHEMY = process.env.REACT_APP_ALCHEMY;

function App() {
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const inputRef5 = useRef(null);
  const inputRef6 = useRef(null);
  const [connection, setConnection] = useState(false);
  const [isMetamask, setMetamask] = useState(false);
  const [userAddress, setUserAddres] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [listBundle, setListBundleSC] = useState();
  const [listUserShort, setListUserShort] = useState();
  const [listUserLong, setListUserLong] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const isConnect = async () => {
      if (typeof window.ethereum !== "undefined") {
        setMetamask(true);
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setUserAddres(accounts[0]);
          const balance = await window.ethereum.request({ method: "eth_getBalance", params: [accounts[0], "latest"] });
          setUserBalance(ethers.utils.formatEther(balance));
          setConnection(true);
        }
      }
    };
    isConnect();

    const getListBundle = async () => {
      // provider = connection to the blockchain
      const provider = new ethers.providers.WebSocketProvider(`wss://eth-sepolia.g.alchemy.com/v2/${ALCHEMY}`);
      console.log(provider);
      // contract from Alchemy
      const contract = new ethers.Contract(contractAddress, abi, provider);
      console.log(contract);

      try {
        const transactionResponse = await contract.bundleIDCount();
        let list = [];
        let listLong = [];
        let listShort = [];
        //loop on each bundle
        for (let i = 0; i < parseInt(transactionResponse._hex, 16); i++) {
          let bundle = { id: i, loans: [], apy: null, volumeLongClosed: 0, volumeLongOpen: 0, volumeShortOpen: 0 };

          //get volume Longs closed
          const transactionResponse2 = await contract.volumeLongClosedOrders(i);
          bundle.volumeLongClosed = ethers.utils.formatEther(transactionResponse2._hex);
          //get volume Longs open
          const transactionResponse3 = await contract.volumeLongOpenOrders(i);
          bundle.volumeLongOpen = ethers.utils.formatEther(transactionResponse3._hex);
          //get volume Short open
          const transactionResponse4 = await contract.volumeShortOpenOrders(i);
          bundle.volumeShortOpen = ethers.utils.formatEther(transactionResponse4._hex);

          //get loans of bundle[i]
          const transactionResponse5 = await contract.getBundle(i);
          //get APY
          let requete = transactionResponse5.join("-");
          console.log(requete);
          fetch(`https://ranch.finance/rate/${requete}`)
            .then((response) => response.json())
            .then((data) => (bundle.apy = data.BundleRate / 100));

          //get data of each loans
          for (let j = 0; j < transactionResponse5.length; j++) {
            var rawdata = await fetch(`https://subprime.uk.r.appspot.com/details/${parseInt(transactionResponse5[j]._hex, 16)}`);
            var data = await rawdata.json();
            if (data.length > 0) {
              bundle.loans.push(data[0]);
            }
          }

          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            // provider user
            const providerUser = new ethers.providers.Web3Provider(window.ethereum);
            //signer
            const signer = providerUser.getSigner();
            // contract from user
            const contractUser = new ethers.Contract(contractAddress, abi, signer);

            //get user open long
            const transactionResponse7 = await contractUser.getLongOpenPosition(i);
            if (parseInt(transactionResponse7._hex, 16) > 0) {
              let longOpen = { status: "Open", bundleID: i, loans: [], apy: null, amount: 0 };
              longOpen.amount = ethers.utils.formatEther(transactionResponse7._hex, 16);
              longOpen.loans.push(bundle.loans);
              longOpen.apy = bundle.apy;
              listLong.push(longOpen);
            }
            //get user open short
            const transactionResponse8 = await contractUser.getShortOpenPosition(i);
            if (parseInt(transactionResponse8._hex, 16) > 0) {
              let shortOpen = { status: "Open", bundleID: i, loans: [], apy: null, amount: 0 };
              shortOpen.amount = ethers.utils.formatEther(transactionResponse8._hex, 16);
              shortOpen.loans.push(bundle.loans);
              shortOpen.apy = bundle.apy;
              listShort.push(shortOpen);
            }
            //get user closed longed
            const transactionResponse6 = await contractUser.getLongClosedPosition(i);
            for (let k = 0; k < transactionResponse6.length; k++) {
              let longClosed = { status: "Closed", bundleID: i, loans: [], apy: null, amount: 0 };
              if (parseInt(transactionResponse6[k]._hex, 16) > 0) {
                longClosed.amount = ethers.utils.formatEther(transactionResponse6[k]._hex, 16);
                longClosed.loans.push(bundle.loans);
                longClosed.apy = bundle.apy;
                listLong.push(longClosed);
              }
            }
            //get user closed short
            const transactionResponse9 = await contractUser.getShortClosedPosition(i);
            for (let l = 0; l < transactionResponse9.length; l++) {
              let shortClosed = { status: "Closed", bundleID: i, loans: [], apy: null, amount: 0 };
              if (parseInt(transactionResponse9[l]._hex, 16) > 0) {
                shortClosed.amount = ethers.utils.formatEther(transactionResponse9[l]._hex, 16);
                shortClosed.loans.push(bundle.loans);
                shortClosed.apy = bundle.apy;
                listShort.push(shortClosed);
              }
            }
          }

          list.push(bundle);
        }
        setListBundleSC(list);
        console.log("shorts: " + listShort + " longs: " + listLong);
        setListUserShort(listShort);
        setListUserLong(listLong);
      } catch (error) {
        console.log(error);
      }
    };
    getListBundle();
  }, []);
  async function listenEvent() {
    // provider = connection to the blockchain
    const provider = new ethers.providers.WebSocketProvider(`wss://eth-goerli.g.alchemy.com/v2/${ALCHEMY}`);
    // contract = to interact with
    const contract = new ethers.Contract(contractAddress, abi, provider);
    console.log(contract);
    contract.on("BundleCreated", (_from, _id, event) => {
      let eventBundle = {
        from: _from,
        id: _id,
        data: event,
      };
      console.log(eventBundle);
    });
  }

  async function createBundle(id1, id2, id3, id4, id5, id6) {
    // provider = connection to the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //signer
    const signer = provider.getSigner();
    // contract = to interact with
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log(contract);
    try {
      const transactionResponse = await contract.addBundle(id1, id2, id3, id4, id5, id6);
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }

  function listenForTransactionMine(transactionResponse, provider) {
    console.long(`Mineing transaction ${transactionResponse.hash}`);
    // listen for this transaction to finish
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(`Completed with ${transactionReceipt.confirmations} confirmations`);
        resolve();
      });
    });
  }

  var bundleList;
  var nbSkeleton = [0, 1, 2, 3];
  if (listBundle) {
    bundleList = listBundle
      .slice()
      .reverse()
      .map((elem, i) => {
        var timeLeft = 0.1;
        var actualTime = Math.floor(Date.now() / 1000);
        elem.loans.forEach((element) => {
          if (parseInt(element.loan_start_time) + parseInt(element.loan_duration) > timeLeft && timeLeft !== 0) {
            timeLeft = parseInt(element.loan_start_time) + parseInt(element.loan_duration);
          }
          if (parseInt(element.loan_start_time) + parseInt(element.loan_duration) < actualTime) {
            timeLeft = 0;
          }
        });
        return (
          <Bundle
            key={i}
            count={i}
            loans={elem.loans}
            id={elem.id}
            rate={elem.apy}
            insurance={elem.volumeLongClosed}
            timeLeft={timeLeft}
            address={userAddress}
            balance={userBalance}
            volumeLongOpen={elem.volumeLongOpen}
            volumeShortOpen={elem.volumeShortOpen}
            loaded={isLoaded}
          />
        );
      });
  } else {
    bundleList = nbSkeleton.map((elem, i) => {
      return <Skeleton height="115px" endColor="blue" mb="15" borderRadius="35px" />;
    });
  }

  return (
    <ChakraProvider>
      <Box className="wrapper" minHeight="100vh" display="flex" flexDirection="column">
        <Header />

        <Tabs mt="25" variant="soft-rounded" isLazy={true} onChange={listBundle ? () => setIsLoaded(true) : null}>
          <TabList color="white">
            <Tab fontSize="xl" fontWeight="bold">
              Markets
            </Tab>
            <Tab fontSize="xl" fontWeight="bold">
              Dashboard
            </Tab>
          </TabList>
          <Show breakpoint="(max-width: 665px)">
            <Box display="flex" mt="5" ml="3">
              <WarningTwoIcon />
              <Text color="white" fontSize="md" ml="2" fontWeight="bold" opacity="calc(60%)">
                This is a beta version, this Dapp is not optimised for small screens.
              </Text>
            </Box>
          </Show>

          <TabPanels>
            <TabPanel height="100%">
              <Box className="bundle-wrapper">
                <div className="column-title">
                  <div className="bundle-title-img">COLLATERALS NFT</div>
                  <Hide breakpoint="(max-width: 370px)">
                    <div className="bundle-title">BUNDLE ID</div>
                  </Hide>
                  <div className="bundle-title">APY</div>
                  <Hide breakpoint="(max-width: 500px)">
                    <div className="bundle-title">
                      VALUE INSURED
                      <Tooltip hasArrow label="Volume of long orders already matched" bg="gray.300" color="black">
                        <InfoOutlineIcon ml="1" />
                      </Tooltip>
                    </div>
                  </Hide>
                  <div className="bundle-title">TIME LEFT</div>
                  <Hide breakpoint="(max-width: 500px)">
                    <div className="bundle-title"></div>
                  </Hide>
                  <Show breakpoint="(max-width: 500px)">
                    <Box width="5%" />
                  </Show>
                </div>

                {/* <Stack direction="row" spacing={4} flexWrap="wrap">
                  <Input ref={inputRef} ml="10" size="sm" width="30" placeholder="Loan ID" />
                  <Input ref={inputRef2} ml="10" size="sm" width="30" placeholder="Loan ID 2" />
                  <Input ref={inputRef3} ml="10" size="sm" width="30" placeholder="Loan ID 3" />
                  <Input ref={inputRef4} ml="10" size="sm" width="30" placeholder="Loan ID 4" />
                  <Input ref={inputRef5} ml="10" size="sm" width="30" placeholder="Loan ID 5" />
                  <Input ref={inputRef6} ml="10" size="sm" width="30" placeholder="Loan ID 6" />
                  <Button
                    variantColor="teal"
                    size="sm"
                    onClick={() => {
                      createBundle(
                        inputRef.current.value,
                        inputRef2.current.value,
                        inputRef3.current.value,
                        inputRef4.current.value,
                        inputRef5.current.value,
                        inputRef6.current.value
                      );
                    }}
                  >
                    Create bundle
                  </Button>
                </Stack> */}

                {bundleList}
              </Box>
            </TabPanel>
            <TabPanel height="100%">
              {connection ? (
                <Dashboard listUserShort={listUserShort} listUserLong={listUserLong} />
              ) : (
                <Text color="white" fontSize="xl" mt="10" fontWeight="bold">
                  Please connect your wallet to access to your dashboard
                </Text>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
