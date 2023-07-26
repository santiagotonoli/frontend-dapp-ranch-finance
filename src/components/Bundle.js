import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import {
  useDisclosure,
  Tooltip,
  Box,
  Hide,
  Button,
  Input,
  Image,
  InputGroup,
  Text,
  InputRightElement,
  useToast,
  Spinner,
  Center,
  Collapse,
  Skeleton,
  Badge,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { abi, contractAddress } from "../constants";
import NftCollaterals from "./NftCollaterals";
const ALCHEMY = process.env.REACT_APP_ALCHEMY;

function Bundle(props) {
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const [loaderLong, setLoaderLong] = useState(false);
  const [loaderShort, setLoaderShort] = useState(false);
  const [loaderUpdate, setLoaderUpdate] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [nbShort, setNbShort] = useState(0);
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdatable, setIsUpdatable] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    isUpdatableFunction();
  }, []);

  var clickListner = (clicked) => {
    setClicked(!clicked);
  };

  async function updateAPY() {
    if (typeof window.ethereum !== "undefined") {
      // provider = connection to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // signer =  wallet
      const signer = provider.getSigner();
      // contract = to interact with
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.requestDataFromOracle(props.id);
        await listenForTransactionMine(transactionResponse, provider, "Update");
      } catch (error) {
        console.log(error);
      }
      await listenForTransactionMine;
    }
  }

  async function isUpdatableFunction() {
    if (typeof window.ethereum !== "undefined") {
      // provider = connection to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // signer =  wallet
      const signer = provider.getSigner();
      // contract = to interact with
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.getTimestampForBundle(props.id);
        console.log(parseInt(transactionResponse._hex, 16));
        const transactionResponse2 = await provider.getBlockNumber();
        console.log(transactionResponse2);
        if (transactionResponse + 10000 < transactionResponse2) {
          setIsUpdatable(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function Long(id, ethAmount) {
    if (typeof window.ethereum !== "undefined") {
      // provider = connection to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // signer =  wallet
      const signer = provider.getSigner();
      // contract = to interact with
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.MatchLongOpenOrders(id, { value: ethers.utils.parseEther(ethAmount) });
        await listenForTransactionMine(transactionResponse, provider, "Long");
      } catch (error) {
        console.log(error);
      }
      await listenForTransactionMine;
    }
  }

  async function Short(id, ethAmount) {
    if (typeof window.ethereum !== "undefined") {
      // provider = connection to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // signer =  wallet
      const signer = provider.getSigner();
      // contract = to interact with
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.MatchShortOpenOrders(id, { value: ethers.utils.parseEther(ethAmount) });
        await listenForTransactionMine(transactionResponse, provider, "Short");
      } catch (error) {
        console.log(error);
      }
      await listenForTransactionMine;
    }
  }

  function listenForTransactionMine(transactionResponse, provider, type) {
    console.log(`Mineing transaction ${transactionResponse.hash}`);
    if (type === "Long") {
      setLoaderLong(true);
    } else if (type === "Short") {
      setLoaderShort(true);
    } else if (type === "Update") {
      setLoaderUpdate(true);
    }
    // listen for this transaction to finish
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(`Completed with ${transactionReceipt.confirmations} confirmations`);

        if (type === "Long") {
          inputRef.current.value = null;
          setLoaderLong(false);
        } else if (type === "Short") {
          inputRef2.current.value = null;
          setLoaderShort(false);
        } else if (type === "Update") {
          setLoaderUpdate(false);
        }

        toast({
          position: "bottom-right",
          title: `${type} executed successfully.`,
          description:
            type === "Long" || type === "Short" ? "Details are shown in your dashboard" : "APY updated, you can now long or short the bundle",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        resolve();
      });
    });
  }

  function timeLeftConverter(UNIX_timestamp) {
    var nb = parseFloat(UNIX_timestamp);
    var actualTime = Math.floor(Date.now() / 1000);
    var delta = nb - actualTime;
    if (delta < 0) {
      return "Closed";
    }
    var days = Math.trunc(delta / 60 / 60 / 24);
    var hours = Math.trunc(delta / 60 / 60);
    var minutes = Math.trunc(delta / 60);

    if (delta > 86400) {
      return days + " days";
    } else if (delta < 86400 && delta > 3600) {
      return hours + " hours";
    } else if (delta < 3600) {
      return minutes + " minutes";
    }
  }

  function isClosed(UNIX_timestamp) {
    const nb = parseFloat(UNIX_timestamp);
    const actualTime = Math.floor(Date.now() / 1000);
    const delta = nb - actualTime;

    if (delta < 0) {
      return true;
    }

    for (const element of props.loans) {
      if (element.revenue_share || element.loan_mat_uri_ty_date) {
        return true;
      }
    }

    return false;
  }

  function isDefault(loans) {
    let sumAmount = 0;
    let sumLiqui = 0;
    let sumRefund = 0;

    loans.forEach((loan) => {
      const loanAmount = parseFloat(loan.loan_princ_ip_al_amount);

      sumAmount += loanAmount;

      if (loan.loan_mat_uri_ty_date !== null) {
        sumLiqui += loanAmount;
      }

      if (loan.revenue_share !== null) {
        sumRefund += loanAmount;
      }
    });

    const halfSumAmount = sumAmount / 2;

    if (sumLiqui > halfSumAmount) {
      return 1;
    }

    if (sumRefund > halfSumAmount) {
      return 2;
    }

    return 0;
  }

  return (
    <>
      {props.loaded ? (
        <div className={isClosed(props.timeLeft) ? "bundle-box-closed" : "bundle-box"} onClick={isClosed(props.timeLeft) ? null : onToggle}>
          <div className="nft-bundle-data">
            <NftCollaterals loans={props.loans} id={props.id} clicked={clicked} clickListner={clickListner} />
          </div>
          <Hide breakpoint="(max-width: 370px)">
            <div className="bundle-data">#{props.id}</div>
          </Hide>
          <div className="bundle-data">{props.rate}%</div>
          <Hide breakpoint="(max-width: 500px)">
            <div className="bundle-data ">
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row" alignItems="center">
                  {props.insurance}{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    style={{ marginTop: "2px" }}
                    width="25"
                    height="25"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    imageRendering="optimizeQuality"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    viewBox="0 0 784.37 1277.39"
                    {...props}
                  >
                    <g fillRule="nonzero">
                      <path fill="#636890" d="m392.07 0-8.57 29.11v844.63l8.57 8.55 392.06-231.75z" />
                      <path fill="#8992b1" d="M392.07 0 0 650.54l392.07 231.75V472.33z" />
                      <path fill="#636890" d="m392.07 956.52-4.83 5.89v300.87l4.83 14.1 392.3-552.49z" />
                      <path fill="#8992b1" d="M392.07 1277.38V956.52L0 724.89z" />
                      <path fill="#454a74" d="m392.07 882.29 392.06-231.75-392.06-178.21z" />
                      <path fill="#636890" d="m0 650.54 392.07 231.75V472.33z" />
                    </g>
                  </svg>
                </Box>
                {props.volumeShortOpen > 0 ? (
                  <Badge fontSize="9px" position="absolute" mt="30px" borderRadius={15} colorScheme="red">
                    open shorts
                  </Badge>
                ) : null}
                {props.volumeLongOpen > 0 ? (
                  <Badge fontSize="9px" position="absolute" mt={props.volumeShortOpen > 0 ? "60" : "30"} borderRadius={15} colorScheme="green">
                    open longs
                  </Badge>
                ) : null}
              </Box>
            </div>
          </Hide>
          <div className="bundle-data ">{timeLeftConverter(props.timeLeft)}</div>
          <div className="bundle-data ">
            {isClosed(props.timeLeft) ? (
              isDefault(props.loans) === 1 ? (
                <Badge p={1} borderRadius={15} colorScheme="red" className="badge">
                  Default
                </Badge>
              ) : isDefault(props.loans) === 2 ? (
                <Badge p={1} borderRadius={15} colorScheme="green" className="badge">
                  Succeed
                </Badge>
              ) : null
            ) : (
              <ChevronDownIcon className={isOpen ? "rotate" : ""} boxSize="2rem" />
            )}
          </div>
        </div>
      ) : (
        <Skeleton height="115px" endColor="blue" mb="15" borderRadius="35px" isLoaded={isLoaded} fadeDuration={props.count * 2}>
          <div className={isClosed(props.timeLeft) ? "bundle-box-closed" : "bundle-box"} onClick={isClosed(props.timeLeft) ? null : onToggle}>
            <div className="nft-bundle-data">
              <NftCollaterals loans={props.loans} id={props.id} clicked={clicked} clickListner={clickListner} />
            </div>
            <Hide breakpoint="(max-width: 370px)">
              <div className="bundle-data">#{props.id}</div>
            </Hide>
            <div className="bundle-data bundle-data-mobile">{props.rate}%</div>
            <Hide breakpoint="(max-width: 500px)">
              <div className="bundle-data ">
                <Box display="flex" flexDirection="column">
                  <Box display="flex" flexDirection="row">
                    {props.insurance}{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlSpace="preserve"
                      style={{ marginTop: "2px" }}
                      width="25"
                      height="25"
                      shapeRendering="geometricPrecision"
                      textRendering="geometricPrecision"
                      imageRendering="optimizeQuality"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      viewBox="0 0 784.37 1277.39"
                      {...props}
                    >
                      <g fillRule="nonzero">
                        <path fill="#636890" d="m392.07 0-8.57 29.11v844.63l8.57 8.55 392.06-231.75z" />
                        <path fill="#8992b1" d="M392.07 0 0 650.54l392.07 231.75V472.33z" />
                        <path fill="#636890" d="m392.07 956.52-4.83 5.89v300.87l4.83 14.1 392.3-552.49z" />
                        <path fill="#8992b1" d="M392.07 1277.38V956.52L0 724.89z" />
                        <path fill="#454a74" d="m392.07 882.29 392.06-231.75-392.06-178.21z" />
                        <path fill="#636890" d="m0 650.54 392.07 231.75V472.33z" />
                      </g>
                    </svg>
                  </Box>
                  {props.volumeShortOpen > 0 ? (
                    <Badge fontSize="9px" position="absolute" mt="30px" borderRadius={15} colorScheme="red">
                      open shorts
                    </Badge>
                  ) : null}
                  {props.volumeLongOpen > 0 ? (
                    <Badge fontSize="9px" position="absolute" mt={props.volumeShortOpen > 0 ? "60" : "30"} borderRadius={15} colorScheme="green">
                      open longs
                    </Badge>
                  ) : null}
                </Box>
              </div>
            </Hide>
            <div className="bundle-data ">{timeLeftConverter(props.timeLeft)}</div>
            <Hide breakpoint="(max-width: 500px)">
              <div className="bundle-data ">
                {isClosed(props.timeLeft) ? (
                  isDefault(props.loans) === 1 ? (
                    <Badge p={1} borderRadius={15} colorScheme="red" className="badge">
                      Default
                    </Badge>
                  ) : isDefault(props.loans) === 2 ? (
                    <Badge p={1} borderRadius={15} colorScheme="green" className="badge">
                      Succeed
                    </Badge>
                  ) : null
                ) : (
                  <ChevronDownIcon className={isOpen ? "rotate" : ""} boxSize="2rem" />
                )}
              </div>
            </Hide>
          </div>
        </Skeleton>
      )}

      <Collapse in={isOpen} animateOpacity>
        <Box id={props.id} maxHeight="300px" display="flex" marginBottom="10px" backgroundColor="#9C663A" borderRadius="35px">
          <Hide breakpoint="(max-width: 665px)">
            <Box
              width="40%"
              minHeight="250px"
              padding="32px 20px"
              display="flex"
              justifyContent="space-between"
              flexDirection="column"
              borderRight="2px solid rgb(54, 54, 97)"
            >
              <Box>
                <Text fontSize="xl" color="white" fontWeight="bold" className="TextTitle">
                  BUNDLE #{props.id}
                </Text>
                <Tooltip hasArrow label="Volume of longs orders waiting for shorts" bg="gray.300" color="black">
                  <Text fontSize="md" color="white" mt="2" className="Text">
                    Open Longs : <b>{props.volumeLongOpen} ETH</b>
                  </Text>
                </Tooltip>
                <Tooltip hasArrow label="Volume of short orders waiting for long" bg="gray.300" color="black">
                  <Text fontSize="md" color="white" mt="1" className="Text">
                    Open Shorts : <b>{props.volumeShortOpen} ETH</b>
                  </Text>
                </Tooltip>

                <Text fontSize="sm" color="#C2C4DA" mt="2" className="Text">
                  Use the imputs to go long or short on the bundle and see your potential earnings. To know more about the process and outcomes, check
                  the process documentation.
                </Text>
              </Box>

              <Box display="flex" flexDirection="column" justifyContent="center" mt="4">
                {loaderUpdate ? (
                  <Center>
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                  </Center>
                ) : isUpdatable ? (
                  <Button size="lg" colorScheme="blue" className="Text" mb="2" onClick={() => updateAPY()}>
                    Update APY
                  </Button>
                ) : null}
                <Button size="lg" colorScheme="blue" className="Text" mb="20">
                  Process documentation
                </Button>
              </Box>
            </Box>
          </Hide>
          <Box className="action-interaction">
            <Box
              borderRight="2px solid rgb(54, 54, 97)"
              width="50%"
              padding="32px 20px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="xl" color="white" fontWeight="bold" className="TextTitle">
                INSURE
              </Text>
              <Text className="TextTitle" color="rgb(194, 196, 218)">
                BALANCE: {(Math.round(props.balance * 100) / 100).toFixed(4)} ETH
              </Text>
              <InputGroup width="70%" borderColor="#C2C4DA">
                <Input ref={inputRef} color="white" />
                <InputRightElement children="MAX" color="white" mr="1" cursor="pointer" onClick={() => (inputRef.current.value = props.balance)} />
              </InputGroup>
              {loaderLong ? (
                <Center>
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </Center>
              ) : isUpdatable ? (
                <Tooltip
                  hasArrow
                  label="Due to market variation, it's necessary to update the APY every 2 days. Meanwhile the bundle is not updated, it is not possible to short or long."
                  bg="gray.300"
                  color="black"
                >
                  <Button
                    size="lg"
                    style={{ background: "green" }}
                    onClick={() => Long(props.id, inputRef.current.value)}
                    width="70%"
                    disabled={isUpdatable ? true : false}
                  >
                    <Image src="https://www.ranch.finance/static/media/icons/doubleArrow.svg" alt="arrow" style={{ transform: "rotate(180deg)" }} />
                    <Text className="TextTitle" color="white" marginLeft="5px" fontWeight="bold">
                      LONG
                    </Text>
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  size="lg"
                  style={{ background: "green" }}
                  onClick={() => Long(props.id, inputRef.current.value)}
                  width="70%"
                  disabled={isUpdatable ? true : false}
                >
                  <Image src="https://www.ranch.finance/static/media/icons/doubleArrow.svg" alt="arrow" style={{ transform: "rotate(180deg)" }} />
                  <Text className="TextTitle" color="white" marginLeft="5px" fontWeight="bold">
                    LONG
                  </Text>
                </Button>
              )}
            </Box>
            <Box width="50%" padding="32px 20px" display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
              <Text fontSize="xl" color="white" fontWeight="bold" className="TextTitle">
                GET INSURED
              </Text>
              <Text className="TextTitle" color="rgb(194, 196, 218)">
                BALANCE: {(Math.round(props.balance * 100) / 100).toFixed(4)} ETH
              </Text>
              <InputGroup width="70%" borderColor="#C2C4DA">
                <Input ref={inputRef2} color="white" />
                <InputRightElement children="MAX" color="white" mr="1" cursor="pointer" onClick={() => (inputRef2.current.value = props.balance)} />
              </InputGroup>
              {loaderShort ? (
                <Center>
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </Center>
              ) : isUpdatable ? (
                <Tooltip
                  hasArrow
                  label="Due to market variation, it's necessary to update the APY every 2 days. Meanwhile the bundle is not updated, it is not possible to short or long."
                  bg="gray.300"
                  color="black"
                >
                  <Button
                    size="lg"
                    style={{ background: "#df2e2e" }}
                    onClick={() => Short(props.id, inputRef2.current.value)}
                    width="70%"
                    disabled={isUpdatable ? true : false}
                  >
                    <Image src="https://www.ranch.finance/static/media/icons/doubleArrow.svg" alt="arrow" />
                    <Text className="TextTitle" color="white" marginLeft="5px" fontWeight="bold">
                      SHORT
                    </Text>
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  size="lg"
                  style={{ background: "#df2e2e" }}
                  onClick={() => Short(props.id, inputRef2.current.value)}
                  width="70%"
                  disabled={isUpdatable ? true : false}
                >
                  <Image src="https://www.ranch.finance/static/media/icons/doubleArrow.svg" alt="arrow" />
                  <Text className="TextTitle" color="white" marginLeft="5px" fontWeight="bold">
                    SHORT
                  </Text>
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Collapse>
    </>
  );
}
export default Bundle;
