var express = require('express');
var router = express.Router();
const helpers = require('../helpers/user-helpers')


//custom middleware
const userCheck = (req, res, next) => {
  
  if (req.session.user){
    console.log('IDDDDDDD');
    console.log(req.session.user._id);
    helpers.checkStatus(req.session.user._id).then(result=>{
      req.session.user=result
      next();
    }) .catch(err=>{
      delete req.session.user
      res.redirect("/login");
    })  
  } else {
    res.redirect("/login");
  }
};

router.get('/',userCheck,(req,res)=>{
   let {user}=req.session
   res.set('Cache-Control', 'no-store')
   res.render('user-home',{user})
})

router.get("/login", (req, res) => {
  if(req.session.user){
   res.redirect('/')
  }
  if(req.session.loginError){
      let err=req.session.loginError;
     delete req.session.loginError;
      res.set('Cache-Control', 'no-store')
      res.render('user-login',{error:err});
      
    }else{
      res.set('Cache-Control', 'no-store')
      res.render('user-login',{error:""});
    }
  
});



//signup get
router.get('/user-signup',function(req,res){
  if(req.session.user){ 
    res.set('Cache-Control', 'no-store')
    res.render('user-home');
  }else{
  if(req.session.signupError){
    let err=req.session.signupError;
    delete req.session.signupError;
    res.set('Cache-Control', 'no-store')
    res.render('user-signup',{error:err});
  }else{
    res.set('Cache-Control', 'no-store')
    res.render('user-signup',{error:""});
  }
}
})

// user signup
router.post('/signup',(req,res)=>{
     if(req.body.password==req.body.password2){
    helpers.signupUser(req.body).then((result)=>{
    console.log(result);
    req.session.user=result;
    console.log('session ulluil illath');
    console.log(req.session.user._id);
   console.log('ith enthe berathe');
    console.log(req.session.user);
    res.set('Cache-Control', 'no-store')
    res.redirect('/user-signup');
}).catch(error=>{
  req.session.signupError=error;
  res.set('Cache-Control', 'no-store')
  res.redirect('/user-signup');
})
}else{
 req.session.signupError="Password Doesn't match"
 res.set('Cache-Control', 'no-store')
 res.redirect('/user-signup');
}
})


//user login
 router.post('/user-login',(req,res)=>{
   helpers.userLogin(req.body).then((response)=>{
    console.log(req.session.user);
     req.session.user=response;
     res.redirect('/login');
   }).catch(error=>{
     req.session.loginError=error
     res.redirect('/login')
   })

 })

//user logout
router.get('/logout',(req,res)=>{
    
  delete req.session.user;
  // req.session.destroy();
 
  res.redirect('/');
});




module.exports = router;
