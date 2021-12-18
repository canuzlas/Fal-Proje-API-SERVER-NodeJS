const adminCheck = (req,res,next)=>{
   if(req.session.admin){
      return next()
   }else{
      return res.redirect("/staff/admin")
   }
}

module.exports = {adminCheck}