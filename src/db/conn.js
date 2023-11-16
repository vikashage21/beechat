const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE).then(()=>{
    console.log('connecting to database succesfully')
}).catch((e)=>{

    console.log('database connections failed !')
})

