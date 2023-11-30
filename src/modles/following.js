const mongoose = require('mongoose')
const releationshipSchema = new mongoose.Schema({
 freinds:[{
    userId:{
        
        type:String
    
    }
 }
   
        
 ]


})


const Relationship = mongoose.model('Relationship', releationshipSchema)

module.exports= Relationship