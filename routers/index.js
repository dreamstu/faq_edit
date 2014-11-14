module.exports = function(app){
    console.log('[Initializes the router]');

    app.use(function(req,res,next){
        res.header('Access-Control-Allow-Origin','http://www.qipeipu.com');
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
        next();
    });

    require('../controllers')(app);
};