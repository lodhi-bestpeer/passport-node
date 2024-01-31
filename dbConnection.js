
const mongoose = require("mongoose")

const connection = ()=>{
  mongoose.connect("mongodb://mongo:27017/passport").then(()=>{
    console.log("db connected")
  }).catch((error)=>{
    console.log(error)
  })
}

module.exports = {connection}