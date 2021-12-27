var express = require('express');
var router = express.Router();
const helpers = require('../helpers/user-helpers');

//custom middleware for checking if admin is present

const adminCheck=(req,res,next)=>{
    if(req.session.admin){
        next();
    }else{
        res.redirect('/admin')
    }
}

//admin get request
router.get('/',(req,res)=>{
if( req.session.admin){
    res.redirect('/admin/dashboard');  
    }else{
    let error=req.session.adminError?req.session.adminError:""
    delete req.session.adminError
    res.set('Cache-Control', 'no-store')
    res.render('admin-login',{error});
    }
});

//admin dashboard
router.get('/dashboard',adminCheck,(req,res)=>{
 helpers.getUser().then(details=>{
 res.set('Cache-Control', 'no-store')
 res.render('admin-dashboard',{data:details});

}).catch(err=>{
    console.log(err);
})
});

//Admin login
router.post('/admin-login',(req,res)=> {
 
  if(req.body.username=='Admin' && req.body.password == '123456'){
      req.session.admin= true;
      res.redirect('/admin/dashboard')
      
  }else{ 
      req.session.adminError='Please Enter correct details'; 
      res.redirect('/admin');   
     }
});



//Add user

router.get('/add/user',adminCheck,(req,res)=>{
    res.set('Cache-Control', 'no-store')
    res.render('add-user');
})
router.get('/home',(req,res)=>{
     res.redirect('/admin/dashboard')
    
   });

router.post('/add/insert',adminCheck,(req,res)=>{

helpers.addUser(req.body).then((result)=>{
    console.log(result);
    
    res.redirect('/admin/add/user');
})
})

//Edit user

router.get('/edit/user/:id',adminCheck,async(req,res)=>{
   
    const details=await helpers.getUserDetails(req.params.id);
    console.log(details);
    res.set('Cache-Control', 'no-store')
    res.render('edit-user',{details});
})

 router.post('/update/:id',adminCheck,(req,res)=>{
     console.log("id",req.params.id);
      helpers.updateUser(req.params.id,req.body).then(()=>{
          
          res.redirect('/admin/dashboard');
      })
 })


   


   //Search User
   router.post('/search',async(req,res)=>{

    const search=req.body.search
    console.log(search);
    const data=await helpers.searchUser(search);
         console.log(data);
        res.set('Cache-Control', 'no-store')
        res.render('search',{data})
    
})
//Delete User
router.get('/delete/user/:id',(req,res)=>{
     const userId=req.params.id
     console.log(userId);
     delete req.session.user;
     helpers.deleteUSer(userId).then((response)=>{
         res.redirect('/admin/dashboard');
     })

     
})
// Block User
router.get('/status/user/:id',(req,res)=>{
    let id= req.params.id
    console.log('prblm heere');
    helpers.changeStatus(id).then((result)=>{
        console.log('pdshjffjsdnfj');
        console.log(result);
        res.json({status:result})
    }).catch(err=>{
        console.log(err);
    })
})


//Logout
router.get('/adminlogout',adminCheck,(req,res)=>{
    
    delete req.session.admin;
    // req.session.destroy();
   
    res.redirect('/admin');
  });
  



module.exports = router;
