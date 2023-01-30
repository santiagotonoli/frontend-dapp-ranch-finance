import React,{ useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import './App.css';
import Header from './components/Header'
import Divider from './components/Divider'
import Footer from './components/Footer'
import {connect} from 'react-redux'

import {
    Text,
    Image,
    Box
  } from '@chakra-ui/react'

function LoansDetails(props) {

  var { id } = useParams();
  const [loan, setLoan] = useState(null); 

  useEffect(() => {
    async function loadData() {
      var rawdata = await fetch(`https://subprime.uk.r.appspot.com/details/${id}`);
      var data = await rawdata.json()
      console.log(data)
      setLoan(data)
    }
    loadData()
  }, []);

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
var dataMap = "No loan"

if(loan){
  let data = [{key:"Amount",value:loan[0].loan_erc20_denomination === "0x6B175474E89094C44Da98b954EedeAC495271d0F" ? (loan[0].loan_princ_ip_al_amount/1000000 > 999 ? loan[0].loan_princ_ip_al_amount/1000000000 + "K DAI": loan[0].loan_princ_ip_al_amount/1000000 + " DAI" ) : (Math.round((loan[0].loan_princ_ip_al_amount / 1000000) * 100) / 100).toFixed(2) + " ETH"},{key:"Duration",value:loan[0].loan_duration ? duration(loan[0].loan_duration) + " days" : "Unknown"},{key:"Start",value:loan[0].loan_start_time ? timeConverter(loan[0].loan_start_time) : "Unknown"},{key:"End",value: loan[0].loan_start_time ? timeConverter(loan[0].loan_start_time + duration(loan[0].loan_duration)) : "Unknown"},{key:"Rate",value:loan[0].amount_pa_id_to_lender || loan[0].maximum_repayment_amount ? (Math.round((interest_rate(loan[0].loan_princ_ip_al_amount / 1000000, loan[0].maximum_repayment_amount / 1000000)) * 100) / 100).toFixed(2) + "%" : "Unknown"},{key:"APR",value:(Math.round((((interest_rate(loan[0].loan_princ_ip_al_amount / 1000000, loan[0].maximum_repayment_amount / 1000000)/duration(loan[0].loan_duration))*360)) * 100) / 100).toFixed(2) + "%"}]

  dataMap = data.map((element,i) => {
    return(
      <Box key={i} className="dataContent">
        <Text fontSize="3xl" color="white" fontWeight="bold" flexWrap='nowrap'>
          {element.key}
        </Text>
        <Text fontSize="xl" mt="5px" color="white">
          {element.value}
        </Text>
      </Box>
    )})
}

    return (
      <ChakraProvider>
        <Box height='100vh'>
          <Header/>
          <Divider/>
          {loan ? 
          <div>
          <Text fontSize="4xl" ml="5%" mt="1%" color='white'>
            Loan <b>#{loan[0].loan_id}</b>
          </Text>
          <div className='detailLoan'>
            <div style={{display:'flex', flexDirection:'column'}}>
              <Text display="flex" justifyContent="center" width="35%" mb="10px" fontSize="xl" alignItems="flex-start" backgroundColor={loan[0].revenue_share? "#009E39": loan[0].loan_mat_uri_ty_date ? "#9C663A" : "#5079F2"} borderRadius='xl'  color='white'>
                <b>{loan[0].revenue_share? "Repaid": loan[0].loan_mat_uri_ty_date ? "Liquidated" : "In progress"}</b>
              </Text>
              <Image boxSize='25rem' src={loan[0].image_url} alt='NFT LOGO' sizeborderWidth='2px' borderRadius='lg' borderColor="white"/>
              <Text fontSize="3xl" mt="10px" color="white">
                <b>{loan[0].name}</b> collection
              </Text>
            </div>
            <Box className='dataBox'>
                {dataMap}
            </Box>
          </div>
          </div> : null}
          <Footer class="footer2"/> 
        </Box>
      </ChakraProvider>
    );
  }

  function mapStateToProps(state){
    return {pickLoan: state.pickLoan}
  }
  
  export default connect(
    mapStateToProps,
    null
  )(LoansDetails)