var user= {};
var crypto = require('crypto');
var $user = require('../models/user');
var $p = require('../utils/params.utils');

user.login = function(req,res){
    switch (req.method){
        case 'GET':
            res.render('login',$p(req,{
                title:'登录'
            }));
            break;
        case 'POST':
            var md5 = crypto.createHash('md5'),
                password = md5.update(req.body.password).digest('hex'),
                name = req.body.username;

            $user.get({name:name,password:password},function(err,users){
                if(err || users.length<=0){
                    res.render('login',$p(req,{
                        name:name,
                        error:'用户名或密码错误'
                    }));
                }else{
                    req.session.user = users[0];
                    res.redirect('/');
                }
            });
            break;
        default :
            res.send('Orz...');
            break;
    }

};

user.logout = function(req,res){
    if(req.session.user)
        delete req.session.user;
    res.redirect('/');
};

user.register = function(req,res){
    switch (req.method){
        case 'GET':
            res.render('register',$p(req,{
                title:'注册账号'
            }));
            break;
        case 'POST':

            var repassword = req.body.repassword,
                password = req.body.password,
                email = req.body.email,
                name = req.body.username;

            if(repassword!=password){
                res.render('register',$p(req,{
                    title:'注册账号',
                    error:'两次输入的密码不一致'
                }));
                return;
            }
            var md5 = crypto.createHash('md5'),
                password = md5.update(password).digest('hex');

            $user.get({name:name},function(err,users){
                if(err || users.length<=0){
                    var User = new $user({
                        name:name,
                        password:password,
                        email:email
                    });

                    User.save(function(err,result){
                        if(err){
                            res.render('register',$p(req,{
                                title:'注册账号',
                                error:'注册失败，请重试！'
                            }));
                        }else{
                            $user.get({id:result.insertId},function(err,users){
                                if(err || users.length<=0){
                                    res.render('/',$p(req,{
                                        success:'注册成功，自动登录失败，请手动登录！'
                                    }));
                                }else{
                                    req.session.user = users[0];
                                    req.flash('success','注册成功，已自动登录！');
                                    /*res.render('/',$p(req,{
                                        success:'注册成功，已自动登录！'
                                    }));*/
                                    res.redirect('/');
                                }
                            });
                        }
                    });

                }else{
                    res.render('register',$p(req,{
                        title:'注册账号',
                        error:'用户名已存在'
                    }));
                }
            });
            break;
        default :
            res.send('Orz...');
            break;
    }
};

user.forget = function(req,res){

};

user.update = function(req,res){

};

module.exports = user;