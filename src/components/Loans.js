import React from 'react';
import '../App.css';
import { Tooltip } from '@chakra-ui/react'


function Loans(props) {

    function timeConverter(UNIX_timestamp){
        var nb = parseFloat(UNIX_timestamp)
        var a = new Date(nb * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = date + ' ' + month + ' ' + year;
        return time;
      }
    function duration(duration){
        var nb = parseFloat(duration)
        var time = (((nb / 60) / 60) / 24)
        return time
    }

    function interest_rate(amount, maxAmount){
        var interest_amount = maxAmount - amount;
        var rate = (interest_amount * 100) / amount

        return rate;
    }

    var type;
    if(props.revenue_share){
        type = "loan-box-repaid"
    } else if (props.loan_mat_uri_ty_date){
        type = "loan-box-liqui"
    } else {
        type = "loan-box"
    }

  return (
        <div className={type}>
                <div className="nft-loan-data nft-loan-data-mobile">
                    <Tooltip hasArrow label={props.name} bg='gray.300' color='black'>
                        <img alt="LogoNFT" class="filterIcons" src={props.image_url[0] === "i" ? props.image_url.replace("ipfs://", "https://ipfs.io/ipfs/"):props.image_url}/>
                    </Tooltip>
                </div>
                <div className="loan-data mobileHide">
                    {props.loan_id}
                </div>
                <div className="loan-data loan-data-mobile">
                {props.loan_erc20_denomination === "0x6B175474E89094C44Da98b954EedeAC495271d0F" ? (props.loan_princ_ip_al_amount/1000000 > 999 ? props.loan_princ_ip_al_amount/1000000000 + "K DAI": props.loan_princ_ip_al_amount/1000000 + " DAI" ) : (Math.round((props.loan_princ_ip_al_amount / 1000000) * 100) / 100).toFixed(2) + " ETH"}
                </div>
                <div className="loan-data mobileHide">
                {props.loan_duration ?
                    duration(props.loan_duration) + " days" : "Unknown"}
                </div>
                <div className="loan-data mobileHide">
                {props.loan_start_time ?
                    timeConverter(props.loan_start_time) : "Unknown"}
                </div>
                <div className="loan-data loan-data-mobile">
                  <Tooltip hasArrow label={"APR: "+(Math.round((((interest_rate(props.loan_princ_ip_al_amount / 1000000, props.maximum_repayment_amount / 1000000)/duration(props.loan_duration))*360)) * 100) / 100).toFixed(2) + "%"} bg='gray.300' color='black'>
                    {props.amount_pa_id_to_lender || props.maximum_repayment_amount ?
                        (Math.round((interest_rate(props.loan_princ_ip_al_amount / 1000000, props.maximum_repayment_amount / 1000000)) * 100) / 100).toFixed(2) + "%" : "Unknown"}
                  </Tooltip>
                </div>
                <div className="loan-data loan-data-mobile">
                    {props.revenue_share? "Repaid": props.loan_mat_uri_ty_date ? "Liquidated" : "In progress"}
                </div>
        </div>
  );
}

  export default (Loans);