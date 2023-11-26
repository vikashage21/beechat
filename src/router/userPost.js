

const express = require("express");

const auth = new express.Router();


const path = require('path')

const userPost = require("../modles/post");
const { compareSync } = require("bcryptjs");

const User = require('../modles/registration');
const { connected } = require("process");
const { ObjectId } = require('mongodb');


// using multer here for stroing the image in mongoose 



// using middleware


auth.use(express.json());

auth.use(express.urlencoded({extended:false}))



// creating rest api for user post 



// update the data by user

auth.patch('/post/:id', async  (req, res)=>{
    try{
       
 const _id = req.params.id
 
 const user = await userPost.findByIdAndUpdate(_id, req.body)
    
res.status(200).json(user)

    }


    catch(e){
        console.log(e)
        res.status(500).json({ error: 'Internal Server Error' }); // Add proper error handling and response
    }
})



auth.get('/post/:id', async (req, res)=>{
    try{
        const _id = req.params.id

        const user = await userPost.find({userId:_id})

        res.status(200).send(user)

    }
    catch(e){
        res.status(500).send(e)
    }
} )


//  getting the details in hbs 


auth.get('/user-posts', async (req, res) => {
    try {
        // Fetch user posts from the database (modify the query as needed)
        const posts = await userPost.find({});

        // Fetching user details for each post
        for (const element of posts) {
            const userId = element.userId;

            // Use await to wait for the asynchronous operation to complete
            const user = await User.findOne({ _id: ObjectId(userId) });

            // Check if the user is found before accessing properties
            if (user) {
              

                // Add firstName property to each post
                element.firstName = user.firstName;
                element.profileImg = user.profileImg
                
            } else {
                console.log('User not found for userId:', userId);
            }
        }

        // Render the 'user-posts' view and pass the posts data and user details
        res.render('user-posts', { posts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});





// deleting the user data form database 

auth.delete('/post/:id', async (req, res)=>{
    try{
        const _id = req.params.id

        const user = await userPost.findByIdAndDelete({_id})

        res.status(200).send(user)

    }
    catch(e){
        res.status(500).send(e)
    }
} )










module.exports = auth;
