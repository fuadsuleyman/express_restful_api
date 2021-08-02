const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// exports.signup = (req, res, next) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         const error = new Error('Validation failed');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }
//     const email = req.body.email;
//     const name = req.body.name;
//     const password = req.body.password;
//     bcrypt
//         .hash(password, 12)
//         .then(hashedPw => {
//             const user = new User({
//                 email: email,
//                 password: hashedPw,
//                 name: name
//             })
//             return user.save()
//         })
//         .then(result => {
//             res.status(201).json({message: 'User created!', userId: result._id})
//         })
//         .catch(err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// }

// async & await version
exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    try {
        const hashedPw = await bcrypt.hash(password, 12);
        
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        })
        const result = await user.save()
        res.status(201).json({message: 'User created!', userId: result._id})
    } catch (err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

// exports.login = (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     let loadedUser;
//     User.findOne({email: email})
//         .then(user => {
//             if(!user){
//                 const error = new Error('User with this email could not be found!')
//                 error.statusCode = 401;
//                 throw error;
//             }
//             loadedUser = user;
//             return bcrypt.compare(password, user.password)
//         })
//         .then(isEqual => {
//             if(!isEqual){
//                 const error = new Error('Wrong password!')
//                 error.statusCode = 401;
//                 throw error;
//             }
//             const token = jwt.sign({
//                 email: loadedUser.email,
//                 userId: loadedUser._id.toString()
//             },
//             'somesecretsecretbyme',
//             {expiresIn: '1h'}
//             );
//             res.status(200).json({token: token, userId: loadedUser._id.toString()})
//         })
//         .catch(err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// }

// async & await version
exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    try {
        const user = await User.findOne({email: email});
        if(!user){
            const error = new Error('User with this email could not be found!')
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password)
            
        if(!isEqual){
            const error = new Error('Wrong password!')
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        },
        'somesecretsecretbyme',
        {expiresIn: '1h'}
        );
        res.status(200).json({token: token, userId: loadedUser._id.toString()})
        return;
    } catch (err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
    
}


// exports.getStatus = (req, res, next) => {
//     console.log('req.userId: ' + req.userId);
//     User.findById(req.userId)
//         .then(user => {
//             if(!user){
//                 const err = new Error('User not found!');
//                 err.statusCode = 404;
//                 throw err;
//             }
//             res.status(200).json({
//                 status: user.status
//             })
//         })
//         .catch(err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//             next(err); 
//         })
// }

// async & await version
exports.getStatus = async (req, res, next) => {
    console.log('req.userId: ' + req.userId);    
    try {
        const user = await User.findById(req.userId)
        if(!user){
            const err = new Error('User not found!');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            status: user.status
        })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


// exports.updateStatus = (req, res, next) => {
//     const newStatus = req.body.status;
//     User.findById(req.userId)
//         .then(user => {
//             if(!user){
//                 const err = new Error('User not found!');
//                 err.statusCode = 404;
//                 throw err;
//             }
//             user.status = newStatus;
//             return user.save();
//         })
//         .then(result => {
//             res.status(200).json({message: 'User status updated'})
//         })
//         .catch(err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//             next(err);
//     })
// }


// async & await version
exports.updateStatus = async (req, res, next) => {
    const newStatus = req.body.status;
    try {
        const user = await User.findById(req.userId)
        if(!user){
            const err = new Error('User not found!');
            err.statusCode = 404;
            throw err;
        }
        user.status = newStatus;
        await user.save(); 
        res.status(200).json({message: 'User status updated'})
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}
