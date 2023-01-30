
export default function(loan = null, action){
    if(action.type === 'pickLoan'){
        console.log(action.loan)
        var loanCopy = action.loan
        return loanCopy
    }  else {
        return loan
    }
}