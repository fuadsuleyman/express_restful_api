const fs = require('fs');
const path = require('path');

const io = require('../socket');

const { validationResult } = require('express-validator');
const Post = require('../models/post');
const User = require('../models/user');

// exports.getPosts = (req, res, next) => {
//     const currentPage = req.query.page || 1;
//     const perPage = 2;
//     let totalItems;
//     Post.find()
//         .countDocuments()
//         .then(count => {
//             totalItems = count;
//             return Post.find()
//                 .skip((currentPage - 1) * perPage)
//                 .limit(perPage);
//         })
//         .then(posts => {
//             res.status(200).json({
//                 message: 'Posts were fetched!',
//                 posts: posts,
//                 totalItems: totalItems
//             })
//         })
//         .catch(err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//         next(err);    
//     })
// }

// async & await version of above function
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .populate('creator')
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
                res.status(200).json({
                    message: 'Posts were fetched!',
                    posts: posts,
                    totalItems: totalItems
              })
        } catch (err) {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        }
}

// exports.createPost = (req, res, next) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         const error = new Error('Validation failed, entered data is incorrect!')
//         error.statusCode = 422;
//         throw error;
//     }
//     if(!req.file) {
//         const error = new Error('No images provided.');
//         error.statusCode = 422;
//         throw error;
//     }
//     // bu asagidaki req.file.path mutlet vasitesi ile yaranir, app.js de app.use(mutler) ile
//     const imageUrl = req.file.path;
//     const content = req.body.content;
//     const title = req.body.title;
//     let creator;
//     const post = new Post({
//         title: title,
//         content: content,
//         imageUrl: imageUrl,
//         creator: req.userId
//     });
//     post.save()
//         .then(result => {
//             return User.findById(req.userId);
//         })
//         .then(user => {
//             creator = user;
//             user.posts.push(post);
//             return user.save();
//         })
//         .then(result => {
//             res.status(201).json({
//                 message: 'Post created succussfully!',
//                 post: post,
//                 creator: {
//                     _id: creator._id,
//                     name: creator.name
//                 }
//             })
//         })
//         .catch(err => {
//             if(!err.statusCode){
//                 err.statusCode= 500;
//             }
//             next(err);
//         })
// }

// async & await version
exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect!')
        error.statusCode = 422;
        throw error;
    }
    if(!req.file) {
        const error = new Error('No images provided.');
        error.statusCode = 422;
        throw error;
    }
    // bu asagidaki req.file.path mutlet vasitesi ile yaranir, app.js de app.use(mutler) ile
    const imageUrl = req.file.path;
    const content = req.body.content;
    const title = req.body.title;
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    
    try {
        await post.save()
        // console.log('req.userId: ' + req.userId)
        const user = await User.findById(req.userId);
        // console.log("user: " + user.name);
        creator = user;
        user.posts.push(post);
        const savedUser = await user.save();
        // butun connection-u olan user-lere posts cannal-i uzre melumat oturur
        io.getIO().emit('posts', {
            action: 'create',
            post: { ...post._doc, creator: { _id: req.userId, name: user.name }}
        })
        res.status(201).json({
            message: 'Post created succussfully!',
            post: post,
            creator: {
                _id: user._id,
                name: user.name
            }
        });
        return savedUser;
    } catch(err) {
        if(!err.statusCode){
            err.statusCode= 500;
        }
        next(err);
    }
}

// exports.getPost = (req, res, next) => {
//     const postId = req.params.postId;
//     Post.findById(postId)
//         .then(post => {
//             if(!post){
//                 const error = new Error('Counl not find a post!');
//                 error.statusCode = 404;
//                 throw error;
//             }
//             res.status(200).json({
//                 message: 'Post fetched',
//                 post: post
//             })
//         })
//         .catch(err => {
//             if(!err.statusCode){
//                 err.statusCode= 500;
//             }
//             next(err);
//     })
// }

// async & await version
exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try{
        const post = await Post.findById(postId);
        if(!post){
            const error = new Error('Counl not find a post!');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Post fetched',
            post: post
        })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode= 500;
        }
        next(err);
    }
}

// exports.updatePost = (req, res, next) => {
//     const postId = req.params.postId;
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         const error = new Error('Validation failed, entered data is incorrect!')
//         error.statusCode = 422;
//         throw error;
//     }
//     const title = req.body.title;
//     const content = req.body.content;
//     let imageUrl = req.body.image;
//     if(req.file) {
//         imageUrl = req.file.path;
//     }
//     if(!imageUrl) {
//         const error = new Error('No file picked.');
//         error.statusCode = 422;
//         throw error;
//     }
//     Post.findById(postId)
//         .then(post => {
//             if (!post) {
//                 const error = new Error('Could not find post.');
//                 error.statusCode = 404;
//                 throw error;
//             }
//             if(post.creator.toString() !== req.userId){
//                 const error = new Error('Not Authorized!')
//                 error.statusCode = 403;
//                 throw error;
//             }
//             if(imageUrl !== post.imageUrl){
//                 clearImage(post.imageUrl);
//             }
//             post.title = title;
//             post.imageUrl = imageUrl;
//             post.content = content;
//             return post.save();
//         })
//         .then(result => {
//             res.status(200).json({message: 'Post updated', post: result})
//         })
//         .catch(err => {
//             if(!err.statusCode){
//                 err.statusCode= 500;
//             }
//             next(err); 
//         })
// }

// async & await version
exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect!')
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file) {
        imageUrl = req.file.path;
    }
    if(!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }
    try {
        const post = await Post.findById(postId).populate('creator');
    
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if(post.creator._id.toString() !== req.userId){
            const error = new Error('Not Authorized!')
            error.statusCode = 403;
            throw error;
        }
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        const result = await post.save();
        io.getIO().emit('posts', {
            action: 'update',
            post: result
        })
        
        res.status(200).json({message: 'Post updated', post: result})
    } catch (err){
        if(!err.statusCode){
            err.statusCode= 500;
        }
        next(err);
    }
}

// exports.deletePost = (req, res, next) => {
//     const postId = req.params.postId;
//     Post.findById(postId)
//         .then(post => {
//             if (!post) {
//                 const error = new Error('Could not find post.');
//                 error.statusCode = 404;
//                 throw error;
//             }
//             if(post.creator.toString() !== req.userId){
//                 const error = new Error('Not Authorized!')
//                 error.statusCode = 403;
//                 throw error;
//             }
//             Check logged in user
//             clearImage(post.imageUrl);
//             return Post.findByIdAndRemove(postId);
//         })
//         .then(result => {
//             return User.findById(req.userId);
//         })
//         .then(user => {
//             user.posts.pull(postId);
//             return user.save();
//         })
//         .then(result => {
//             res.status(200).json({message: 'Deleted post.'})
//         })
//         .catch(err => {
//             if(!err.statusCode){
//                 err.statusCode= 500;
//             }
//             next(err);
//         })
// }

// async & await version
exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;

    try{
        const post = await Post.findById(postId);
        
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error('Not Authorized!')
            error.statusCode = 403;
            throw error;
        }
        // Check logged in user
        clearImage(post.imageUrl);
        await Post.findByIdAndRemove(postId);
            
        const user = await User.findById(req.userId);    
        user.posts.pull(postId);
        user.save();
        io.getIO().emit('posts', {
            action: 'delete',
            post: postId
        })
        res.status(200).json({message: 'Deleted post.'})
    } catch(err) {
        if(!err.statusCode){
            err.statusCode= 500;
        }
        next(err);
    }
    
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}