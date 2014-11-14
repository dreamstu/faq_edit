var home = require('../routers/home');
module.exports = function(app) {
    console.log('[Initializes the home controller]');
    app.get('/', home.index);
};