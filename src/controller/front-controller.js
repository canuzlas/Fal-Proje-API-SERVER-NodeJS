const path = require('path')
const getHomePage = (req, res) => {
   res.sendFile(path.resolve(__dirname,'../views/home/index.html'))
}
const getPolicyPage = (req, res) => {
   res.sendFile(path.resolve(__dirname,'../views/home/policy.html'))
}
const getPrivacyPage = (req, res) => {
   res.sendFile(path.resolve(__dirname,'../views/home/privacy.html'))
}


module.exports = {
   getHomePage,
   getPolicyPage,
   getPrivacyPage
}