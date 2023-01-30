
export default function(listLoans = [], action){
    if(action.type === 'loadList'){
        console.log(action.data)
        var listLoansCopy = action.data
        return listLoansCopy
    } else if(action.type === 'updateList'){
        console.log(action.data)
        var listLoansCopy = action.data
        return listLoansCopy
    } else {
        return listLoans
    }
}