const path = require('path')
const getHomePage = (req, res) => {
   res.sendFile(path.resolve(__dirname,'../views/home/index.html'))
}


module.exports = {
   getHomePage
}