//creating a post schema here 
const mongoose = require('mongoose')

 const postSchema = new mongoose.Schema({
userId:{
    type:String,
    required:"true"
    
},
desc:{
    type:String,
    required:"true"


},
img:{
    type:String,
    // required:"true"

}
,
freinds:[{
    userId:{
        
        type:String
    
    }
 }
   
        
 ]


})


const userPost = new mongoose.model('userPost',postSchema)

module.exports=userPost