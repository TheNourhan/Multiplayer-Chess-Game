const mongoose = require('mongoose');
class Database{
    constructor(){
        this.connect();
    }
    connect(){
        mongoose.connect(process.env.MONGO_URL)
        .then(()=>{
            console.log("database connection successful");
        })
        .catch((err)=>{
            console.log("database connection error " + err);
        });
    }
}
module.exports = new Database();