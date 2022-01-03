const path = require('path')
const getHomePage = (req, res) => {
   res.sendFile(path.resolve(__dirname,'../views/home/index.html'))
}
const getPolicyPage = (req, res) => {
   res.sendFile(path.resolve(__dirname,'../views/home/policy.html'))
}


module.exports = {
   getHomePage,
   getPolicyPage
}