const authController = require('../controllers/auth');
const sinon = require('sinon');
const expect = require('chai').expect;
const User = require('../models/user');

describe('Auth Controller - Login', function(){
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
})