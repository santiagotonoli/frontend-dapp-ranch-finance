import "../App.css";
import React, { useState, useEffect } from "react";
import {
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Tabs,
  TabPanel,
  TabPanels,
  TabList,
  Tab,
  TabIndicator,
} from "@chakra-ui/react";
import NftCollaterals from "./NftCollaterals";

function Dashboard(props) {
  const [isSettled, setIsSettled] = useState(false);

  console.log(props.listUserLong);
  console.log(props.listUserShort);

  function timeLeftConverter(UNIX_timestamp) {
    var nb = parseFloat(UNIX_timestamp);
    var actualTime = Math.floor(Date.now() / 1000);
    var delta = Math.abs(nb - actualTime);
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
  let listLong;
  if (props.listUserLong.length > 0) {
    listLong = props.listUserLong.map((elem, i) => {
      let sumAmount;
      for (let j = 0; j < elem.loans[0].length; j++) {
        sumAmount += elem.loans[0][j];
      }
      var timeLeft = 1;
      var actualTime = Math.floor(Date.now() / 1000);
      elem.loans[0].forEach((element) => {
        if (parseInt(element.loan_start_time) + parseInt(element.loan_duration) > timeLeft && timeLeft !== 0) {
          timeLeft = parseInt(element.loan_start_time) + parseInt(element.loan_duration);
        }
        if (parseInt(element.loan_start_time) + parseInt(element.loan_duration) < actualTime) {
          timeLeft = 0;
        }
      });
      return (
        <Tr key={i}>
          <Td>
            <Badge
              display={"flex"}
              justifyContent={"center"}
              w="4rem"
              borderRadius={15}
              colorScheme="green"
              variant={elem.status === "Open" ? "outline" : "subtle"}
            >
              {elem.status}
            </Badge>
          </Td>
          <Td>
            <div className="nft-bundle-data" style={{ width: "100%" }}>
              <NftCollaterals loans={elem.loans[0]} id={i} />
            </div>
          </Td>
          <Td>#{elem.bundleID}</Td>
          <Td>{elem.amount} ETH</Td>
          <Td>{elem.apy}%</Td>
          <Td>{elem.apy} ETH</Td>
          <Td>
            {timeLeft > 0 ? (
              timeLeftConverter(timeLeft)
            ) : (
              <Badge cursor="pointer" display={"flex"} justifyContent={"center"} w="4rem" borderRadius={15} colorScheme="green" variant={"solid"}>
                Claim
              </Badge>
            )}
          </Td>
        </Tr>
      );
    });
  }
  let listShort;
  if (props.listUserShort.length > 0) {
    listShort = props.listUserShort.map((elem, i) => {
      let timeLeft = 1;
      var actualTime = Math.floor(Date.now() / 1000);
      elem.loans[0].forEach((element) => {
        if (parseInt(element.loan_start_time) + parseInt(element.loan_duration) > timeLeft && timeLeft !== 0) {
          timeLeft = parseInt(element.loan_start_time) + parseInt(element.loan_duration);
        }
        if (parseInt(element.loan_start_time) + parseInt(element.loan_duration) < actualTime) {
          timeLeft = 0;
          console.log(element.loan_id);
        }
      });
      return (
        <Tr key={i}>
          <Td>
            <Badge
              display={"flex"}
              justifyContent={"center"}
              w="4rem"
              borderRadius={15}
              colorScheme="green"
              variant={elem.status === "Open" ? "outline" : "subtle"}
            >
              {elem.status}
            </Badge>
          </Td>
          <Td>
            <div className="nft-bundle-data" style={{ width: "100%" }}>
              <NftCollaterals loans={elem.loans[0]} id={i} />
            </div>
          </Td>
          <Td>#{elem.bundleID}</Td>
          <Td>{elem.amount} ETH</Td>
          <Td>{elem.apy}%</Td>
          <Td>{elem.apy} ETH</Td>
          <Td>
            {timeLeft > 0 ? (
              timeLeftConverter(timeLeft)
            ) : (
              <Badge cursor="pointer" display={"flex"} justifyContent={"center"} w="4rem" borderRadius={15} colorScheme="green" variant={"solid"}>
                Claim
              </Badge>
            )}
          </Td>
        </Tr>
      );
    });
  }
  return (
    <Box>
      <Tabs position="relative" variant="unstyled">
        <TabList color="white">
          <Tab fontWeight="bold">My long(s)</Tab>
          <Tab fontWeight="bold">My short(s)</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="3px" bg="white" borderRadius="3px" />
        <TabPanels>
          <TabPanel>
            {props.listUserLong.length > 0 ? (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th color="white">Status</Th>
                      <Th color="white">Collaterals NFT</Th>
                      <Th color="white">Bundle</Th>
                      <Th color="white">Amount</Th>
                      <Th color="white">Rate</Th>
                      <Th color="white">Claimable</Th>
                      <Th color="white">Time left</Th>
                    </Tr>
                  </Thead>
                  <Tbody color="white">{listLong}</Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text color="white" fontSize="lg" mt="15">
                You don't have longed for the moment.
              </Text>
            )}
          </TabPanel>
          <TabPanel>
            {props.listUserShort.length > 0 ? (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th color="white">Status</Th>
                      <Th color="white">Collaterals NFT</Th>
                      <Th color="white">Bundle</Th>
                      <Th color="white">Amount</Th>
                      <Th color="white">Rate</Th>
                      <Th color="white">Claimable</Th>
                      <Th color="white">Time left</Th>
                    </Tr>
                  </Thead>
                  <Tbody color="white">{listShort}</Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text color="white" fontSize="lg" mt="15">
                You don't have shorted for the moment.
              </Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Dashboard;
