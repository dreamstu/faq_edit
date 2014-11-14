var home= {};
var $p = require('../utils/params.utils');
home.index = function(req,res){
    res.render('index',$p(req,{
        content:'系统初始化成功！'
    }));
};

module.exports = home;