const authController = require('../controllers/auth');
const sinon = require('sinon');
const expect = require('chai').expect;
const User = require('../models/user');
const mongoose = require('mongoose');

describe('Auth Controller', function(){
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
    it('it should throw an error with code 500 if accessing the database fails', function(done){
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };

        authController.login(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            
            // for async
            done();
        })
        // expect(authController.login)
  
        User.findOne.restore();
    })

    it('should send a rsponse with a valid user status for an existing user', function(done){
        
    
                const req = {userId: '5c0f66bd979af55031b3472a'}
                const res = {
                    statusCode: 500,
                    userStatus: null,
                    status: function(code) {
                        this.statusCode = code;
                        return this;
                    },
                    json: function(data) {
                        this.userStatus = data.status 
                    }
                };
                authController.getStatus(req, res, () => {}).then(()=>{
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.userStatus).to.be.equal('I am new!');
                    done()
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