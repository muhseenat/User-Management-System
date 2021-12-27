const db= require('../config/connection')
const collection = require('../config/collections')
const bcrypt = require ('bcrypt');
const objId=require('mongodb').ObjectId;


module.exports={
    //function to insert user 
    addUser:(details)=>{

        return new Promise((resolve,reject)=>{

            console.log(details);
            let newUser={
                username:details.username,
                place:details.place,
                phone:details.phone,
                email:details.email,
                comment:details.comment,
                status:'Active'
            }
            db.get().collection(collection.USER_COLLECTIONS ).insertOne(newUser).then((result)=>{
                console.log(`Successfully inserted item with _id: ${result.insertedId}`);
               resolve(newUser);
            })
    
    })
           
    },
    

    //function retrive user
    getUser:()=>{
          return new Promise(async(resolve,reject)=>{
              const details = await db.get().collection(collection.USER_COLLECTIONS).find().toArray()
              resolve(details)
          })
    },

    //signup 

    signupUser:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTIONS).findOne({email:userData.email})
            if(user){
                console.log('user exist');
                reject('Email already used ,Please choose another one');
            }
           let hashedPass=await bcrypt.hash(userData.password,10)
            let newUser={
                username:userData.username,
                place:userData.place,
                phone:Number(userData.phone),
                email:userData.email,
                comment:userData.comment,
                password:hashedPass,
                status:'Active'
            }
           console.log(newUser);
            db.get().collection(collection.USER_COLLECTIONS ).insertOne(newUser).then((data)=>{
                console.log(data);
                resolve(newUser);
            })
         })  
    },
   //user login
    userLogin:(userData)=>{
        return new Promise(async (resolve,reject)=>{
        
         let user = await db.get().collection(collection.USER_COLLECTIONS).findOne({email:userData.email})
         if(user){
             if(user.status){
                 bcrypt.compare(userData.password,user.password).then(result=>{
                  if(result){
                    console.log('Login succesful');
                    resolve(user);
                   } else{
                    console.log('password mismatch');
                   reject('Email and password not match');
                }
          }).catch(err=>{
            console.log(err)
            reject(err)
          })
          }else{
              reject('Blocked by admin');
          }
         }else{
            console.log('U dont have an account plzz sign up');
            reject("You Don't have an account plz signup");
         }   
        })
    },
   //Delete user
    deleteUSer:(userId)=>{
        return new Promise((resolve,reject)=>{
            console.log(userId);
            console.log(objId(userId));
            db.get().collection(collection.USER_COLLECTIONS).deleteOne({_id:objId(userId)}).then((response)=>{
                console.log(response);
              resolve(response);
            })
        })
    },
  //Edit user
   getUserDetails:(userId)=>{
       return new Promise((resolve,reject)=>{
           db.get().collection(collection.USER_COLLECTIONS).findOne({_id:objId(userId)}).then((details)=>{
               console.log(details);
               resolve(details);
           })
       })
   },



//update user

   updateUser:(userId,details)=>{
       return new Promise((resolve,reject)=>{
           console.log(userId);
           db.get().collection(collection.USER_COLLECTIONS).updateOne({_id:objId(userId)},{
               $set:{
                   username:details.username,
                   email:details.email,
                   phone:details.phone,
                   place:details.place,
                   comments:details.comments
               }
           }).then((details)=>
           resolve(details))
       })

   },

   //Search User
   searchUser:(search)=>{
       return new Promise((resolve,reject)=>{
           db.get().collection(collection.USER_COLLECTIONS).find({username:{$regex:search}}).toArray().then((details)=>{
               console.log(details);
               resolve(details);
           })
       })
   },
   //Block user
   changeStatus:(id)=>{
       return new Promise(async(resolve,reject)=>{
           console.log(id);
           let userDetails = await db.get().collection(collection.USER_COLLECTIONS).findOne({_id:objId(id)})
           console.log(userDetails);
           db.get().collection(collection.USER_COLLECTIONS).updateOne({_id:objId(id)},{$set:{status:!userDetails.status}}).then(result=>{
               console.log(!userDetails.status);
               console.log(userDetails.status);
               resolve(!userDetails.status)
           }).catch(err=>{
               reject(err)
           })
       })
   } ,
   // to chech the status
   checkStatus:(id)=>{
       return new Promise(async (resolve,reject)=>{
         console.log(id);

          
         let userExist = await db.get().collection(collection.USER_COLLECTIONS).findOne({_id:objId(id)})
         console.log('ithaaaannnnn sadhano');
             console.log(userExist);
             
            if(userExist){
                if(userExist.status="Active"){
                    resolve(userExist)
                }else{
                    reject(false);
                }
              }
            
        
         
    
             
        
        })
   }


}