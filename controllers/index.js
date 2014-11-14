var index = require('../routers/index');


function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录，请先登录!');
        res.redirect('/login');
    }else{
        next();
    }
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('success', '你已登录！');
        res.redirect('/');//返回之前的页面
    }else{
        next();
    }
}

module.exports = function(app){
    console.log('[Initializes the index controller]');

    //未登录拦截
    app.get('/new/*',checkLogin);
    app.get('/list/*',checkLogin);
    app.get('/faq/*',checkLogin);
    //app.get('/api/*',checkLogin); //放行API请求

    //所有请求都需要进入检查用户状态
    require('./home')(app);
    require('./user')(app);
    require('./category').init(app);
    require('./faq').init(app);
    require('./ueditor')(app);

    var category = require('./category');
    var faq = require('./faq');
    //新建
    app.route('/new/:type').all(function(req,res){
        var type = req.params.type;
        switch (type){
            case 'faq':
                console.log('新建一篇faq');
                faq.new(req,res);
                break;
            case 'category':
                console.log('新建一个分组');
                category.new(req,res);
                break;
            default :
                break;
        }
    });

    //列表
    app.route('/list/:type').all(function(req,res){
        var type = req.params.type;
        switch (type){
            case 'faq':
                console.log('faq列表');
                faq.list(req,res);
                break;
            case 'category':
                console.log('新建一个分组');
                category.new(req,res);
                break;
            default :
                break;
        }
    });

    //预览
    app.route('/faq/preview/:id').all(function(req,res){
        faq.preview(req,res);
    });

    //删除
    app.route('/faq/delete/:id').all(function(req,res){
        faq.delete(req,res);
    });

    //预览
    app.route('/faq/edit/:id').all(function(req,res){
        faq.edit(req,res);
    });
};


