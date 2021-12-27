
const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}



module.exports.connect=(success)=>{
    const url ='mongodb://localhost:27017';
    const dbname='User';

 mongoClient.connect(url,(err,data)=>{
 if(err){
     return success(err)
 }
 state.db=data.db(dbname);
 

 success()
 })
 



}

module.exports.get=()=>state.db;

