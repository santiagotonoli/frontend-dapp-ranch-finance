
export default function(dataLoans = [], action){
    if(action.type === 'loadLoans'){
        console.log(action.data)
        var dataLoansCopy = action.data
        return dataLoansCopy
    }  else {
        return dataLoans
    }
}