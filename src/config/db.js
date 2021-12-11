const mongodb = require("mongoose")
mongodb.connect(process.env.MONGO_DB_URL,{
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(success => console.log("mongoDB bağlandı"))
 .catch(err => console.log(err)) 