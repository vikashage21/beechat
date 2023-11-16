const mongoose = require('mongoose')

mongoose.set('strictQuery', false); // Address the deprecation warning

mongoose.connect(process.env.DATABASE,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('connecting to database succesfully')
}).catch((e)=>{

    console.log('database connections failed !')
})

