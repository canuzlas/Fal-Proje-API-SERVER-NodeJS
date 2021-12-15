const path = require('path')
const getHomePage = (req, res) => {
   res.sendFile(path.resolve(__dirname,'../screens/index.html'))
}


module.exports = {
   getHomePage
}