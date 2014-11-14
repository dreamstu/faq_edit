var user = require('../routers/user');
module.exports = function(app){
    console.log('[Initializes the user controller]');
    app.get('/login',user.login);
    app.post('/login',user.login);
    app.get('/register',user.register);
    app.post('/register',user.register);
    app.get('/logout',user.logout);
};