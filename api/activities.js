
const express = require('express');
const router = express.Router();



router.use((req, res, next ) =>{
    console.log("A request is being made to /activities")

    next();
});

// GET /api/activities/:activityId/routines

// GET /api/activities

// router.get('/', async (req, res) => {
//    // const allPosts = await getAllPosts();

//     const posts = allPosts.filter(post => {
//         return post.active || (req.user && post.author.id === req.user.id);
//       });

//     res.send({
//       "posts": posts
//     });
//   });

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
