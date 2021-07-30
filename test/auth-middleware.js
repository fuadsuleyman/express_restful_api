const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function(){
    it('should throw an error if no authorization header is present', function(){
        const req = {
            get: function(headerName) {
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
            'Not authenticated.'
        );
    });
    
    it('should throw an error if the authorization header is only one string', function(){
        const req = {
            get: function(headerName) {
                return 'xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });
    
    // we use sinon for then restore after overriding jwt(or other) behavier
    it('it should yeald a userId after decoding the token', function(){
        const req = {
            get: function(headerName){
                return 'Bearer xyzcsdcsdcsdcscsdcsgvgbsgbsbsb165145bdv5d1vd15d51vd51v'
            }
        };
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'abc' });
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    })
    
    it('should throw an error if the token cnnot be verified', function(){
        const req = {
            get: function(headerName){
                return 'Bearer xyz'
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    })
    
})

