import React,{ useState, useEffect } from 'react';
import '../App.css';
import { Tooltip } from '@chakra-ui/react'


function Loans(props) {

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = date + ' ' + month + ' ' + year;
        return time;
      }

    function interest_rate(amount, maxAmount){
        var interest_amount = maxAmount - amount;
        var rate = amount / interest_amount

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
                <div style={{marginTop:"10px", marginBottom:"10px", width:"14.28%", display:'flex', justifyContent:'center', color:'white'}}>
                    <Tooltip hasArrow label={props.name} bg='gray.300' color='black'>
                        <img alt="LogoNFT" class="filterIcons" src={props.image_url[0] === "i" ? props.image_url.replace("ipfs://", "https://ipfs.io/ipfs/"):props.image_url}/>
                    </Tooltip>
                </div>
                <div className="loan-data">
                    {props.loan_id}
                </div>
                <div className="loan-data">
                    {(Math.round((props.loan_princ_ip_al_amount / 1000000000000000000) * 100) / 100).toFixed(2)} ETH
                </div>
                <div className="loan-data">
                {props.loan_duration ?
                    (((props.loan_duration / 60)/60)/24) + " days" : "Unknown"}
                </div>
                <div className="loan-data">
                {props.loan_start_time ?
                    timeConverter(props.loan_start_time) : "Unknown"}
                </div>
                <div className="loan-data">
                {props.amount_pa_id_to_lender || props.maximum_repayment_amount ?
                    (Math.round((interest_rate(props.loan_princ_ip_al_amount / 1000000000000000000, props.maximum_repayment_amount / 1000000000000000000)) * 100) / 100).toFixed(2) + "%" : "Unknown"}
                </div>
                <div className="loan-data">
                    {props.revenue_share? "Repaid": props.loan_mat_uri_ty_date ? "Liquidated" : "In progress"}
                </div>
        </div>
  );
}

  export default (Loans);