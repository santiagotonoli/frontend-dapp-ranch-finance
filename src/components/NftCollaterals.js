import "../App.css";
import { Tooltip, Box, Text } from "@chakra-ui/react";

function NftCollaterals(props) {
  function duration(duration) {
    var nb = parseFloat(duration);
    var time = nb / 60 / 60 / 24;
    return time;
  }
  function timeConverter(UNIX_timestamp) {
    var nb = parseFloat(UNIX_timestamp);
    var a = new Date(nb * 1000);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + " " + month + " " + year;
    return time;
  }
  function interest_rate(amount, maxAmount) {
    var interest_amount = maxAmount - amount;
    var rate = (interest_amount * 100) / amount;

    return rate;
  }
  let listImgLoans = props.loans.map((elem, i) => {
    var link = "https://loans.ranch.finance/details/" + elem.loan_id;
    if (i === 0) {
      return (
        <a
          href={link}
          onClick={
            !props.clicked
              ? () => {
                  document.querySelector(`#${props.id}`).classList.add("open");
                  props.clickListner(!props.clicked);
                }
              : () => {
                  document.querySelector(`#${props.id}`).classList.remove("open");
                  props.clickListner(!props.clicked);
                }
          }
        >
          <Tooltip
            hasArrow
            label={
              <Box>
                <Text color="black">
                  <b>Collection: </b> {elem.name}
                </Text>
                <Text color="black">
                  <b>Amount: </b>{" "}
                  {elem.loan_erc20_denomination === "0x6B175474E89094C44Da98b954EedeAC495271d0F"
                    ? elem.loan_princ_ip_al_amount / 1000000 > 999
                      ? elem.loan_princ_ip_al_amount / 1000000000 + "K DAI"
                      : elem.loan_princ_ip_al_amount / 1000000 + " DAI"
                    : (Math.round((elem.loan_princ_ip_al_amount / 1000000) * 100) / 100).toFixed(2) + " ETH"}
                </Text>
                <Text color="black">
                  <b>Rate: </b>{" "}
                  {elem.amount_pa_id_to_lender || elem.maximum_repayment_amount
                    ? (
                        Math.round(interest_rate(elem.loan_princ_ip_al_amount / 1000000, elem.maximum_repayment_amount / 1000000) * 100) / 100
                      ).toFixed(2) + "%"
                    : "Unknown"}
                </Text>
                <Text color="black">
                  <b>Duration: </b> {elem.loan_duration ? duration(elem.loan_duration) + " days" : "Unknown"}
                </Text>
                <Text color="black">
                  <b>End: </b> {elem.loan_start_time ? timeConverter(parseInt(elem.loan_start_time) + parseInt(elem.loan_duration)) : "Unknown"}
                </Text>
              </Box>
            }
            bg="gray.300"
            color="black"
          >
            <img
              alt="LogoNFT"
              className={elem.revenue_share ? "filterIcons iconsRepaid" : elem.loan_mat_uri_ty_date ? "filterIcons iconsLiquidated" : "filterIcons"}
              src={elem.image_url[0] === "i" ? elem.image_url.replace("ipfs://", "https://ipfs.io/ipfs/") : elem.image_url}
            />
          </Tooltip>
        </a>
      );
    } else if (i % 2 === 0) {
      return (
        <a
          href={link}
          className="nft-bundle-line1"
          onClick={
            !props.clicked
              ? () => {
                  document.querySelector(`#${props.id}`).classList.add("open");
                  props.clickListner(!props.clicked);
                }
              : () => {
                  document.querySelector(`#${props.id}`).classList.remove("open");
                  props.clickListner(!props.clicked);
                }
          }
        >
          <Tooltip
            hasArrow
            label={
              <Box>
                <Text color="black">
                  <b>Collection: </b> {elem.name}
                </Text>
                <Text color="black">
                  <b>Amount: </b>{" "}
                  {elem.loan_erc20_denomination === "0x6B175474E89094C44Da98b954EedeAC495271d0F"
                    ? elem.loan_princ_ip_al_amount / 1000000 > 999
                      ? elem.loan_princ_ip_al_amount / 1000000000 + "K DAI"
                      : elem.loan_princ_ip_al_amount / 1000000 + " DAI"
                    : (Math.round((elem.loan_princ_ip_al_amount / 1000000) * 100) / 100).toFixed(2) + " ETH"}
                </Text>
                <Text color="black">
                  <b>Rate: </b>{" "}
                  {elem.amount_pa_id_to_lender || elem.maximum_repayment_amount
                    ? (
                        Math.round(interest_rate(elem.loan_princ_ip_al_amount / 1000000, elem.maximum_repayment_amount / 1000000) * 100) / 100
                      ).toFixed(2) + "%"
                    : "Unknown"}
                </Text>
                <Text color="black">
                  <b>Duration: </b> {elem.loan_duration ? duration(elem.loan_duration) + " days" : "Unknown"}
                </Text>
                <Text color="black">
                  <b>End: </b> {elem.loan_start_time ? timeConverter(parseInt(elem.loan_start_time) + parseInt(elem.loan_duration)) : "Unknown"}
                </Text>
              </Box>
            }
            bg="gray.300"
            color="black"
          >
            <img
              alt="LogoNFT"
              className={elem.revenue_share ? "filterIcons iconsRepaid" : elem.loan_mat_uri_ty_date ? "filterIcons iconsLiquidated" : "filterIcons"}
              src={elem.image_url[0] === "i" ? elem.image_url.replace("ipfs://", "https://ipfs.io/ipfs/") : elem.image_url}
            />
          </Tooltip>
        </a>
      );
    } else {
      return (
        <span
          className="nft-bundle-line2"
          onClick={() => {
            document.querySelector(`#${props.id}`).classList.add("open");
            props.clickListner(!props.clicked);
          }}
        >
          <a href={link}>
            <Tooltip
              hasArrow
              label={
                <Box>
                  <Text color="black">
                    <b>Collection: </b> {elem.name}
                  </Text>
                  <Text color="black">
                    <b>Amount: </b>{" "}
                    {elem.loan_erc20_denomination === "0x6B175474E89094C44Da98b954EedeAC495271d0F"
                      ? elem.loan_princ_ip_al_amount / 1000000 > 999
                        ? elem.loan_princ_ip_al_amount / 1000000000 + "K DAI"
                        : elem.loan_princ_ip_al_amount / 1000000 + " DAI"
                      : (Math.round((elem.loan_princ_ip_al_amount / 1000000) * 100) / 100).toFixed(2) + " ETH"}
                  </Text>
                  <Text color="black">
                    <b>Rate: </b>{" "}
                    {elem.amount_pa_id_to_lender || elem.maximum_repayment_amount
                      ? (
                          Math.round(interest_rate(elem.loan_princ_ip_al_amount / 1000000, elem.maximum_repayment_amount / 1000000) * 100) / 100
                        ).toFixed(2) + "%"
                      : "Unknown"}
                  </Text>
                  <Text color="black">
                    <b>Duration: </b> {elem.loan_duration ? duration(elem.loan_duration) + " days" : "Unknown"}
                  </Text>
                  <Text color="black">
                    <b>End: </b> {elem.loan_start_time ? timeConverter(parseInt(elem.loan_start_time) + parseInt(elem.loan_duration)) : "Unknown"}
                  </Text>
                </Box>
              }
              bg="gray.300"
              color="black"
            >
              <img
                alt="LogoNFT"
                className={elem.revenue_share ? "filterIcons iconsRepaid" : elem.loan_mat_uri_ty_date ? "filterIcons iconsLiquidated" : "filterIcons"}
                src={elem.image_url[0] === "i" ? elem.image_url.replace("ipfs://", "https://ipfs.io/ipfs/") : elem.image_url}
              />
            </Tooltip>
          </a>
        </span>
      );
    }
  });
  return listImgLoans;
}

export default NftCollaterals;
