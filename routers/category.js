var category= {};
var $category = require('../models/category');
var $p = require('../utils/params.utils');
var _ = require('underscore');
category.new = function(req,res){
    var method = req.method;
    switch (method){
        case 'GET':
            $category.get({pid:0,root:1},function(err,categorys){
                if(err){
                    res.render('category/new',$p(req,{
                        title:'新建分组',
                        error:'现有分组拉取失败，请重试！'
                    }));
                }else{
                    res.render('category/new',$p(req,{
                        title:'新建分组',
                        categorys:categorys
                    }));
                }
            });
            break;
        case 'POST':
            var name = req.body.name,
                pid = req.body.pid,
                root = req.body.root;


            $category.get({name:name},function(err,category){
                if(err || category.length>0){
                    req.flash('error','分组名已存在！');
                    res.redirect('/new/category');
                }else{
                    var category = new $category({
                        name:name,
                        pid:pid,
                        root:root
                    });

                    category.save(function(err,result){
                        if(err){
                            req.flash('error','新建分组错误！');
                            res.redirect('/new/category');
                        }else{
                            console.log('success');
                            req.flash('success','新建分组成功！');
                            res.redirect('/new/category');
                        }
                    })
                }
            });
            break;
        default :
            break;
    }
};

category.findByPidAndLevel = function(req,res){
    var pid = req.params.pid;
    var lv = req.params.level;
    $category.get({pid:pid,root:lv},function(err,categorys){
        if(err){
            res.json({
                msg:'query error',
                code:-1
            });
        }else{
            res.json({
                code:0,
                categorys:categorys
            });
        }
    });
};

category.list = function(req,res){
    $category.get({},function(err,categorys){
        if(err){
            res.jsonp({
                msg:'query error',
                code:-1
            });
        }else{
            var first = [];
            var second = [];
            var three = [];
            for(var i=0;i<categorys.length;i++){
                var category = categorys[i];
                if(category.pid == 0 && category.root==1){
                    category.childs = [];
                    first.push(category);
                }else if(category.root==2){
                    category.childs = [];
                    second.push(category);
                }else if(category.root==3){
                    three.push(category);
                }
            }

            for(var i=0;i<three.length;i++){
                var _three = three[i];
                var arr = _.where(second,{id:_three.pid});
                if(arr.length>0)
                    arr[0].childs.push(_three);
            }

            for(var i=0;i<second.length;i++){
                var _second = second[i];
                var arr = _.where(first,{id:_second.pid});
                if(arr.length>0)
                    arr[0].childs.push(_second);
            }

            res.jsonp({
                code:0,
                categorys:first
            });
        }
    });
};

module.exports = category;