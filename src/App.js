import React,{ useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import './App.css';
import Header from './components/Header'
import Divider from './components/Divider'
import Loans from './components/Loans'
import Footer from './components/Footer'
import {
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Stack,
  Tooltip,
  Select,
  Box
} from '@chakra-ui/react'
import { InfoOutlineIcon, SmallCloseIcon } from '@chakra-ui/icons'

function App() {

  const [loansList, setLoansList] = useState([]);
  const [allLoans, setallLoans] = useState([]);
  const [status, setStatus] = useState("");
  const [collectionList, setListCollection] = useState([]);
  const [isCollection, setIsCollection] = useState("");
  const [showCollection, setShowCollection] = useState([]);
  const [listLength, setLength] = useState(10);
  const [isStatus, setisStatus] = useState(false)
  const [isSort, setisSort] = useState("")

  useEffect(() => {
    async function loadData() {
      var rawdata = await fetch(`https://ranch-finance.herokuapp.com/loans`);
      var data = await rawdata.json()
      
      var rawdataR = await fetch(`https://ranch-finance.herokuapp.com/loansrepaid`)
      var dataR = await rawdataR.json()

      var rawdataL = await fetch(`https://ranch-finance.herokuapp.com/loansliquidated`)
      var dataL = await rawdataL.json()

      for(var i=0;i<data.length;i++){
        for(var j=0;j<dataR.length;j++){
          if(data[i].loan_id === dataR[j].loan_id){
            dataR.splice(j,1)
          }
        }
        for(var k=0;k<dataL.length;k++){
          if(data[i].loan_id === dataL[k].loan_id){
            dataL.splice(k,1)
          }
        }
      }
      setLoansList([...data,...dataR,...dataL])
      setallLoans([...data,...dataR,...dataL])
    }
    loadData()
    async function loadCollection() {
      var rawdata = await fetch('https://ranch-finance.herokuapp.com/collections');
      var data = await rawdata.json()
      setListCollection(data);
    }
    loadCollection()
   }, []);
   

   var LoadMore = async () =>{
    setLength(listLength + 10)
   }

  var Status = async (filter) => {
      if(filter === "Repaid"){
        setLength(10)
        setLoansList(allLoans.filter(loan => loan.revenue_share))
        setisStatus(true)
        setStatus("Repaid")
        setIsCollection("")
        setisSort("")
      } 
      else if(filter === "Liquidated"){
        setLength(10)
        setLoansList(allLoans.filter(loan => loan.loan_mat_uri_ty_date ))
        setisStatus(true)
        setStatus("Liquidated")
        setIsCollection("")
        setisSort("")
      } 
      else if(filter === "In progress"){
        setLength(10)
        setisStatus(true)
        setStatus("In progress")
        setLoansList(allLoans.filter(loan => !loan.loan_mat_uri_ty_date && !loan.revenue_share))
        setIsCollection("")
        setisSort("")
      }else if(filter === "All"){
        setLength(10)
        setisStatus(false)
        setStatus("")
        setLoansList(allLoans.sort((a,b) => b.loan_id - a.loan_id))
        setIsCollection("")
        setisSort("")
      }
  }

  var Sort = async (sort) => {
    if(sort === "Amount: Low to high" && !isCollection){
      setLength(10)
      setLoansList(loansList.sort((a,b) => a.loan_princ_ip_al_amount - b.loan_princ_ip_al_amount))
      setisSort(sort)
    } else if(sort === "Amount: Low to high" && isCollection){
      setLength(10)
      setLoansList(showCollection.sort((a,b) => a.loan_princ_ip_al_amount - b.loan_princ_ip_al_amount))
      setisSort(sort)
    }
    if( sort === "Amount: High to low" && !isCollection){
      setLength(10)
      setLoansList(loansList.sort((a,b) => b.loan_princ_ip_al_amount - a.loan_princ_ip_al_amount))
      setisSort(sort)
    } else if(sort === "Amount: High to low" && isCollection){
      setLength(10)
      setLoansList(showCollection.sort((a,b) => b.loan_princ_ip_al_amount - a.loan_princ_ip_al_amount))
      setisSort(sort)
    }
    if( sort === "Duration: Low to high" && !isCollection){
      setLength(10)
      setLoansList(loansList.sort((a,b) => a.loan_duration - b.loan_duration))
      setisSort(sort)
    } else if(sort === "Duration: Low to high" && isCollection){
      setLength(10)
      setLoansList(showCollection.sort((a,b) => a.loan_duration - b.loan_duration))
      setisSort(sort)
    }
    if( sort === "Duration: High to low" && !isCollection){
      setLength(10)
      setLoansList(loansList.sort((a,b) => b.loan_duration - a.loan_duration))
      setisSort(sort)
    } else if(sort === "Duration: High to low" && isCollection){
      setLength(10)
      setLoansList(showCollection.sort((a,b) => b.loan_duration - a.loan_duration))
      setisSort(sort)
    }
    if( sort === "Old to new" && !isCollection){
      setLength(10)
      setLoansList(loansList.sort((a,b) => a.loan_start_time - b.loan_start_time))
      setisSort(sort)
    } else if(sort === "Old to new" && isCollection){
      setLength(10)
      setLoansList(showCollection.sort((a,b) => a.loan_start_time - b.loan_start_time))
      setisSort(sort)
    }
    if( sort === "New to old" && !isCollection){
      setLength(10)
      setLoansList(loansList.sort((a,b) => b.loan_start_time - a.loan_start_time))
      setisSort(sort)
    } else if(sort === "New to old" && isCollection){
      setLength(10)
      setLoansList(showCollection.sort((a,b) => b.loan_start_time - a.loan_start_time))
      setisSort(sort)
    }
  }
 
  var collectionFilter = async (collection) => {
      setShowCollection(loansList.filter(loan => loan.name === collection))
      setIsCollection(collection)
  }
  
  var collectionMap = collectionList.map((loan ,i) => {
    return(
    <option key={i} value={loan.name} >{loan.name}</option>
  )})

  var unselectFilters = () => {
    setIsCollection("")
    setisStatus("")
    setisSort("")
    setLoansList(allLoans.sort((a,b) => b.loan_id - a.loan_id))
    setLength(10)
    var selectStatus = document.getElementById("Status");
    selectStatus.value = ""
    var selectCollection = document.getElementById("Collection");
    selectCollection.value = ""
    var selectSort = document.getElementById("Sort");
    selectSort.value = ""
  }

  return (
    <ChakraProvider>
    <div className="App">
      <Header/>
      <Divider/>
        <div style={{display:'flex', marginTop:'1.5%',marginLeft:'5%'}}>
          <Popover>
            <PopoverTrigger placement="bottom">
              <Text className="NFTfi">
                 NFTfi Loans
              </Text>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Howdy Cowboy! 🐎 </PopoverHeader>
              <PopoverBody>
                Welcome on our NFTfi data tool. We extracted all that gold directly from the mine, the NFTfi smartcontract. Remember this is for informative purpose. Grab your pickaxe, and start looking for what you came for ! ⛏ 
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
        <div style={{marginTop:'1%', marginBottom:'1.5%', marginLeft:'5%', color:"white"}}>
          <Accordion allowToggle="true" borderColor="#9c663a00">
            <AccordionItem>
              <div className='accordionTitleBox'>
                <AccordionButton>
                  <Box className='accordionTitle'>
                      Some gold nuggets informations  
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </div>
              <div style={{width:"80%"}}>
              <AccordionPanel pb={4}>
                <b>Number of loans fetched: {allLoans.length}<br/>
                In progress: {allLoans.filter(loan => !loan.loan_mat_uri_ty_date && !loan.revenue_share).length}<br/>
                Repaid: {allLoans.filter(loan => loan.revenue_share).length}<br/>
                Liquidated: {allLoans.filter(loan => loan.loan_mat_uri_ty_date ).length}<br/>
                Number of collections: {collectionList.length}<br/>
                <br/>
                Fellow friends, as you could have seen, for some loans there is missing data. Indeed, we can't get those informations for all repaid and liquidated loans with a maturity date before the 28th of September, date we started to fill our database.<br/>
                Note as well that some loans can be missing from our database due to some missing informations.<br/>
                By mining this golden data we also mined dark dirty coal loans data that never really existed, like the ones with negative amounts.</b>
              </AccordionPanel>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
        
      <div className="loan-wrapper">
        <Stack direction="row" spacing={4} mb={4}>
          {isStatus === true ? 
          <div className="filterButton">
            <Select id="Status" onChange={(e)=>{Status(e.target.value)}} placeholder={status} focusBorderColor="white" bg="white" borderRadius='15px' borderWidth='1px' borderColor="white" mr="10px" color="9c663a00">
              <option value="All">All</option>
              <option value="In progress">In progress</option>
              <option value="Repaid">Repaid</option>
              <option value="Liquidated">Liquidated</option>
            </Select>
          </div> :
          <div className="filterButton">
            <Select id="Status" onChange={(e)=>{Status(e.target.value)}} placeholder="Status" focusBorderColor="white" bg="#9c663a00" borderRadius='15px' borderWidth='1px' borderColor="white" mr="10px" color="white">
              <option value="All">All</option>
              <option value="In progress">In progress</option>
              <option value="Repaid">Repaid</option>
              <option value="Liquidated">Liquidated</option>
            </Select>
          </div>}
    
          {isCollection !== "" ? 
          <div className="filterButton">
            <Select id="Collection" onChange={(e)=>{collectionFilter(e.target.value)}} placeholder={isCollection} focusBorderColor="white" bg="white" borderRadius='15px' borderWidth='1px' borderColor="white" mr="10px" color="9c663a00">
              {collectionMap}
            </Select> 
          </div>:
          <div className="filterButton">
            <Select id="Collection" onChange={(e)=>{collectionFilter(e.target.value)}} placeholder="Collection" focusBorderColor="white" bg="#9c663a00" borderRadius='15px' borderWidth='1px' borderColor="white" mr="10px" color="white">
              {collectionMap}
            </Select>
          </div>}

          {isSort !== "" ? 
          <div className="filterButton">
            <Select id="Sort" onChange={(e)=>{Sort(e.target.value)}} placeholder={isSort} focusBorderColor="white" bg="white" borderRadius='15px' borderWidth='1px' borderColor="white" mr="10px" color="9c663a00">
              <option value="Amount: High to low">Amount: Low to high</option>
              <option value="Amount: High to low">Amount: High to low</option>
              <option value="Duration: Low to high">Duration: Low to high</option>
              <option value="Duration: High to low">Duration: High to low</option>
              <option value="Old to new">Old to new</option>
              <option value="New to old">New to old</option>
            </Select> 
          </div>:
          <div className="filterButton">
            <Select id="Sort" onChange={(e)=>{Sort(e.target.value)}} placeholder="Sort by" focusBorderColor="white" bg="#9c663a00" borderRadius='15px' borderWidth='1px' borderColor="white" mr="10px" color="white">
              <option value="Amount: High to low">Amount: Low to high</option>
              <option value="Amount: High to low">Amount: High to low</option>
              <option value="Duration: Low to high">Duration: Low to high</option>
              <option value="Duration: High to low">Duration: High to low</option>
              <option value="Old to new">Old to new</option>
              <option value="New to old">New to old</option>
            </Select> 
          </div>}
          
        
          {isCollection || isStatus || isSort ?
            <Tooltip hasArrow label="Clear filters" bg='gray.300' color='black'>
              <SmallCloseIcon onClick={()=>{unselectFilters()}} mr="10px" mt="1%" color="white"/>
            </Tooltip>
          : null}

        </Stack>
        <div className="column-title">
              <div className="loan-title">
                  NFT
              </div>
              <div className="loan-title">
                  ID
              </div>
              <div className="loan-title">
                  Amount
              </div>
              <div className="loan-title">
                  Duration
              </div>
              <div className="loan-title">
                  Start
              </div>
              <div className="loan-title">
                  Rate
              </div>
              <div className="loan-title">
                  Status
              </div>

          </div>
        {isCollection ?
        showCollection.slice(0, listLength).map((loan ,i) =>
        <Loans key={i} status={status} name={loan.name} image_url={loan.image_url} loan_id={loan.loan_id} loan_princ_ip_al_amount={loan.loan_princ_ip_al_amount} maximum_repayment_amount={loan.maximum_repayment_amount} loan_duration={loan.loan_duration} loan_start_time={loan.loan_start_time} revenue_share={loan.revenue_share} loan_mat_uri_ty_date={loan.loan_mat_uri_ty_date} />
        ): status === "" || status === "In progress" ? loansList.slice(0, listLength).map((loan ,i) =>
          <Loans key={i} status={status} name={loan.name} image_url={loan.image_url} loan_id={loan.loan_id} loan_princ_ip_al_amount={loan.loan_princ_ip_al_amount} maximum_repayment_amount={loan.maximum_repayment_amount} loan_duration={loan.loan_duration} loan_start_time={loan.loan_start_time} revenue_share={loan.revenue_share} loan_mat_uri_ty_date={loan.loan_mat_uri_ty_date} />
          ): status === "Repaid" ? loansList.slice(0, listLength).map((loan ,i) =>
          <Loans key={i} status={status} name={loan.name} image_url={loan.image_url} loan_id={loan.loan_id} loan_princ_ip_al_amount={loan.loan_princ_ip_al_amount} maximum_repayment_amount={loan.amount_pa_id_to_lender} loan_duration={loan.loan_duration} loan_start_time={loan.loan_start_time} revenue_share={loan.revenue_share} loan_mat_uri_ty_date={loan.loan_mat_uri_ty_date} />
          ): status === "Liquidated" ? loansList.slice(0, listLength).map((loan ,i) =>
          <Loans key={i} status={status} name={loan.name} image_url={loan.image_url} loan_id={loan.loan_id} loan_princ_ip_al_amount={loan.loan_princ_ip_al_amount} maximum_repayment_amount={loan.amount_pa_id_to_lender} loan_duration={loan.loan_duration} loan_start_time={loan.loan_start_time} revenue_share={loan.revenue_share} loan_mat_uri_ty_date={loan.loan_mat_uri_ty_date} />
          ):null }
   
        <div className="buttonWrap">
          <div>
          </div>

          {/* Button load more when there is a collection filter applied */}
          {isCollection && showCollection.length > 10 ? 
            (listLength >= showCollection.length ?
            null : 
            <div className="button" onClick={()=>{LoadMore()}}>
              Load more
            </div>): null}

          {/* Button load more when there is no collection filter applied */}
          {isCollection ? null :
          (loansList.length <= 10 ?
          null: listLength >= loansList.length ? null:
          <div className="button" onClick={()=>{LoadMore()}}>
            Load more
          </div>)}

          {isCollection && showCollection.length > 0 && listLength <= showCollection.length ?
            <div style={{color:"white"}}>
              {listLength}/{showCollection.length} loans
            </div>: listLength > showCollection.length && isCollection ?
            <div style={{color:"white"}}>
              {showCollection.length}/{showCollection.length} loans
            </div>
            : null }

          {loansList.length > 0 && listLength <= loansList.length && !isCollection ?
            <div style={{color:"white"}}>
              {listLength}/{loansList.length} loans
            </div>: listLength > loansList.length && loansList.length > 0 && !isCollection  ?
            <div style={{color:"white"}}>
              {loansList.length}/{loansList.length} loans
            </div>
            : null }

        </div> 
      </div> 
      <Footer/>
    </div>
    </ChakraProvider>
  );
}

export default App;
