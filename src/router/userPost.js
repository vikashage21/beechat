

const express = require("express");

const auth = new express.Router();


const path = require('path')

const userPost = require("../modles/post");
const { compareSync } = require("bcryptjs");

const User = require('../modles/registration');
const { connected } = require("process");
const { ObjectId } = require('mongodb');
const { post } = require("../modles/following");

const Relationship = require('../modles/following');
const UserRegistration = require("../modles/registration");


// using multer here for stroing the image in mongoose 



// using middleware


auth.use(express.json());

auth.use(express.urlencoded({ extended: false }))



// creating rest api for user post 



// update the data by user

auth.patch('/post/:id', async (req, res) => {
    try {

        const _id = req.params.id

        const user = await userPost.findByIdAndUpdate(_id, req.body)

        res.status(200).json(user)

    }


    catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Internal Server Error' }); // Add proper error handling and response
    }
})



auth.get('/post/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const user = await userPost.find({ userId: _id })

        res.status(200).send(user)

    }
    catch (e) {
        res.status(500).send(e)
    }
})


//  getting the details in hbs 

const image = path.join(__dirname, '../public/image/')
console.log(image)


auth.get('/user-posts', async (req, res) => {
    try {
        // Fetch user posts from the database (modify the query as needed)
        const posts = await userPost.find({});
        // const deafaultImg =



        // Fetching user details for each post
        for (const element of posts) {
            const userId = element.userId;

            // const likes = element.freinds.length
            // console.log(likes)


            // let likes = following.freinds.length;


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


// adding user-profile feature here

auth.get('/user-profile/:userId', async (req, res) => {
    try {

        const userId = req.params.userId

        const posts = await userPost.find({ userId })

        console.log(posts)
        // console.log(userId)

        // console.log(posts)

        const user = await User.findOne({ _id: ObjectId(userId) });



        // Render the 'userprofile' view and pass the posts data and user details
        res.render('userprofile', { posts, user });


    } catch (e) {

    }
})


// adding  like feautres inside the posts
auth.post('/like/:userId/:_id', async (req, res) => {
    try {
        const userId = req.params.userId;
        const postId = req.params._id;

        const following = await userPost.findOne({ _id: ObjectId(postId) });

        // Check if the user has already liked the post
        const alreadyLiked = following.freinds.some(friend => friend.userId === userId);

        if (!alreadyLiked) {
            following.freinds.push({ userId: userId });
            await following.save();
            res.redirect(`/user-posts`);
        } else {
            res.send('Already liked the post');
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal server error');
    }
});









// to get total likes of users 


auth.get(`/user-posts/likes-json/:userId/:postId`, async (req, res) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;

        const following = await userPost.findOne({ _id: ObjectId(postId) });
        let likes = following.freinds.length;

        res.json({ likes });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});





// deleting the user data form database 

auth.delete('/post/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const user = await userPost.findByIdAndDelete({ _id })

        res.status(200).send(user)

    }
    catch (e) {
        res.status(500).send(e)
    }
})










module.exports = auth;
