export default function (loansbdd = [], action) {
    if (action.type == 'addLoans') {
        return action.loansbdd
    } else {
        return loansbdd
    }
}