
export default function(collections = [], action){
    if(action.type === 'loadCollections'){
        console.log(action.data)
        var collectionsCopy = action.data
        return collectionsCopy
    }  else {
        return collections
    }
}