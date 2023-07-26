import React from "react";
import "../App.css";
import { Tooltip } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function Action(props) {
  var link0 = "https://loans.ranch.finance/details/" + props.loans[0][0].loan_id;
  var link1 = "https://loans.ranch.finance/details/" + props.loans[1][0].loan_id;
  console.log(props.loans);
  let listImgLoans = props.loans.map((elem, i) => {
    var link = "https://loans.ranch.finance/details/" + elem[0].loan_id;
    // if (i % 2 === 0) {
    return (
      <div>
        <a href={link}>
          <Tooltip hasArrow bg="gray.300" color="black">
            <img
              alt="LogoNFT"
              class="filterIcons"
              src={elem[0].image_url[0] === "i" ? elem[0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/") : elem[0].image_url}
            />
          </Tooltip>
        </a>
        <span>
          <a href={link}>
            <Tooltip hasArrow bg="gray.300" color="black">
              <img
                alt="LogoNFT"
                class="filterIcons"
                src={elem[0].image_url[0] === "i" ? elem[0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/") : elem[0].image_url}
              />
            </Tooltip>
          </a>
        </span>
        <a href={link}>
          <Tooltip hasArrow bg="gray.300" color="black">
            <img
              alt="LogoNFT"
              class="filterIcons"
              src={elem[0].image_url[0] === "i" ? elem[0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/") : elem[0].image_url}
            />
          </Tooltip>
        </a>
      </div>
    );
    // } else {
    //   return (
    //     <span>
    //       <a href={link}>
    //         <Tooltip hasArrow bg="gray.300" color="black">
    //           <img
    //             alt="LogoNFT"
    //             class="filterIcons"
    //             src={elem[0].image_url[0] === "i" ? elem[0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/") : elem[0].image_url}
    //           />
    //         </Tooltip>
    //       </a>
    //     </span>
    //   );
    // }
  });
  return (
    <div style={{ textDecoration: "none", borderColor: "black" }} className="loan-box">
      <div className="nft-loan-data nft-loan-data-mobile">
        <div className="sc-fzoant img-nft-wrap">
          <div className="sc-fznzOf eJpBGj">
            <a href={link0} target="_blank" rel="noreferrer">
              <Tooltip hasArrow bg="gray.300" color="black">
                <img
                  alt="LogoNFT"
                  class="filterIcons"
                  src={
                    props.loans[0][0].image_url[0] === "i"
                      ? props.loans[0][0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/")
                      : props.loans[0][0].image_url
                  }
                />
              </Tooltip>
            </a>
            <span>
              <a href={link1} target="_blank" rel="noreferrer">
                <Tooltip hasArrow bg="gray.300" color="black">
                  <img
                    alt="LogoNFT"
                    class="filterIcons"
                    src={
                      props.loans[1][0].image_url[0] === "i"
                        ? props.loans[1][0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/")
                        : props.loans[1][0].image_url
                    }
                  />
                </Tooltip>
              </a>
            </span>
          </div>
          <div className="sc-fznzOf eJpBGj">
            <a href={link0} target="_blank" rel="noreferrer">
              <Tooltip hasArrow bg="gray.300" color="black">
                <img
                  alt="LogoNFT"
                  class="filterIcons"
                  src={
                    props.loans[0][0].image_url[0] === "i"
                      ? props.loans[0][0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/")
                      : props.loans[0][0].image_url
                  }
                />
              </Tooltip>
            </a>
            <span>
              <a href={link1} target="_blank" rel="noreferrer">
                <Tooltip hasArrow bg="gray.300" color="black">
                  <img
                    alt="LogoNFT"
                    class="filterIcons"
                    src={
                      props.loans[1][0].image_url[0] === "i"
                        ? props.loans[1][0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/")
                        : props.loans[1][0].image_url
                    }
                  />
                </Tooltip>
              </a>
            </span>
          </div>
          <div className="sc-fznzOf eJpBGj">
            <a href={link0} target="_blank" rel="noreferrer">
              <Tooltip hasArrow bg="gray.300" color="black">
                <img
                  alt="LogoNFT"
                  class="filterIcons"
                  src={
                    props.loans[0][0].image_url[0] === "i"
                      ? props.loans[0][0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/")
                      : props.loans[0][0].image_url
                  }
                />
              </Tooltip>
            </a>
            <span>
              <a href={link1} target="_blank" rel="noreferrer">
                <Tooltip hasArrow bg="gray.300" color="black">
                  <img
                    alt="LogoNFT"
                    class="filterIcons"
                    src={
                      props.loans[1][0].image_url[0] === "i"
                        ? props.loans[1][0].image_url.replace("ipfs://", "https://ipfs.io/ipfs/")
                        : props.loans[1][0].image_url
                    }
                  />
                </Tooltip>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div className="loan-data">#{props.id}</div>
      <div className="loan-data loan-data-mobile">{props.rate}</div>
      <div className="loan-data ">{props.insurance}</div>
      <div className="loan-data ">{props.timeLeft}</div>
      <div className="loan-data ">
        <ChevronDownIcon boxSize="2rem" />
      </div>
    </div>
  );
}
export default Action;
