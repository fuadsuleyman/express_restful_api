const authController = require('../controllers/auth');
const feedController = require('../controllers/feed');
const sinon = require('sinon');
const expect = require('chai').expect;
const User = require('../models/user');
const mongoose = require('mongoose');

describe('Feed Controller', function(){
    before(function(done){
        mongoose.connect(
            'mongodb+srv://fuads:wLoyopyig03cXY9a@cluster0.oepjk.mongodb.net/test-feedDB?retryWrites=true&w=majority',
            {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
            )
            .then(result => {
                const user = new User({
                    email: 'test5@test.com',
                    password: 'tester',
                    name:'Test',
                    posts: [],
                    _id: '5c0f66bd979af55031b3472a'
                })
                return user.save()
              })
              .then(() => {
                  done(); 
              })
    })

    // this test pass only when from createPost controller I remove socket part of code
    it('should add a creator post to the posts of the creator', function(done){
        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post Contrnt'
            },
            file: {
                path: 'abc'
            },
            userId: '5c0f66bd979af55031b3472a'
        };
        // in this test we not use below res, but is must be therefore I create it empty
        const res = { status: function(){
            return this;
        },
        json: function(){} };

        feedController.createPost(req, res, () => {}).then((savedUser) => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        })  
        })

    after(function(done){
    // below code delete all users
        User.deleteMany({}).then(() => {
           return mongoose.disconnect()
        })
        .then(() => {
            done();
        });
        })
})