var faq= {};
var $faq = require('../models/faq');
var $category = require('../models/category');
var $p = require('../utils/params.utils');
var _ = require('underscore');
faq.new = function(req,res){
    var method = req.method;
    switch (method){
        case 'GET':
            $category.get({pid:0,root:1},function(err,categorys){
                if(err){
                    res.render('faq/edit',$p(req,{
                        title:'新建FAQ',
                        error:'分类数据拉取失败，请重试'
                    }));
                }else{
                    res.render('faq/edit',$p(req,{
                        title:'新建FAQ',
                        categorys:categorys
                    }));
                }
            });
            break;
        case 'POST':
            /*var title = req.body.title;
            var category = req.body.category;
            var content = req.body.content;*/
            req.body.author = req.session.user.name;
            if(req.body.id!=''){
                //编辑
                var faq = new $faq(req.body);
                faq.update(function(err,result){
                    if(err){
                        res.json({
                            msg:'更新失败！'
                        });
                    }else{
                        res.json({
                            msg:'更新成功！'
                        });
                    }
                });
            }else{
                delete req.body.id;//删除id属性
                //新增
                var faq = new $faq(req.body);
                faq.save(function(err,result){
                    if(err){
                        res.json({
                            msg:'失败！'
                        });
                    }else{
                        res.json({
                            msg:'保存成功！',
                            id:result.insertId
                        });
                    }
                });
            }
            break;
        default :
            break;
    }
};


faq.list = function(req,res){
    var method = req.method;
    switch (method){
        case 'GET':
            $faq.get({},function(err,faqs){
                if(err){
                    res.render('faq/list',$p(req,{
                        title:'FAQ列表',
                        error:'FAQ列表获取失败！请重试'
                    }));
                }else{
                    res.render('faq/list',$p(req,{
                        title:'FAQ列表',
                        faqs:faqs
                    }));
                }
            });
            break;
        default :
            break;
    }
};

faq.preview = function(req,res){
    var id = req.params.id;
    $faq.get({id:id},function(err,faq){
        if(err){
            res.render('faq/preview',$p(req,{
                title:'FAQ预览',
                error:'FAQ生成预览失败！请重试'
            }));
        }else{
            res.render('faq/preview',$p(req,{
                title:'FAQ预览',
                faq:faq[0]
            }));
        }
    })
};

faq.delete = function(req,res){
    var id = req.params.id;
    $faq.delete({id:id},function(err){
        if(err){
            req.flash('error','抱歉，删除失败！');
            res.redirect('/list/faq');
        }else{
            req.flash('success','已删除！')
            res.redirect('/list/faq');
        }
    });
};

faq.edit = function(req,res){
    var id = req.params.id;
    $faq.get({id:id},function(err,faq){
        if(err){
            res.render('faq/edit',$p(req,{
                title:'编辑FAQ',
                error:'拉取FAQ现有数据失败！请重试'
            }));
        }else{
            $category.get({pid:0,root:1},function(err,categorys){
                if(err){
                    res.render('faq/edit',$p(req,{
                        title:'编辑FAQ',
                        error:'分类数据拉取失败，请重试',
                        faq:faq[0]
                    }));
                }else{
                    res.render('faq/edit',$p(req,{
                        title:'编辑FAQ',
                        categorys:categorys,
                        faq:faq[0]
                    }));

                }
            });

        }
    });
};


faq.api = {};
faq.api.getListByCategoryId = function(req,res){
    var categoryId = req.params.categoryId;
    var cols = ['id','title','time'];
    $faq.getCols({'category':categoryId},cols,function(err,faqs){
        if(err){
            res.jsonp({
                code:-1,
                msg:'query error'
            });
        }else{
            res.jsonp({
                code:0,
                faqs:faqs
            });
        }
    });
};
faq.api.getDetailById= function(req,res){
    var id = req.params.id;
    $faq.get({'id':id},function(err,faqs){
        if(err || faqs.length<=0){
            res.jsonp({
                code:-1,
                msg:'query error'
            });
        }else{
            res.jsonp({
                code:0,
                faq:faqs[0]
            });
        }
    });
};

faq.api.detail = function(req,res){
    var id = req.params.id;
    $faq.get({id:id},function(err,faq){
        if(err){
            res.render('faq/api/articles',$p(req,{
                title:'FAQ预览',
                error:'FAQ生成预览失败！请重试'
            }));
        }else{
            res.render('faq/api/articles',$p(req,{
                title:'FAQ预览',
                faq:faq[0]
            }));
        }
    });
};

faq.api.list = function(req,res){
    var categoryId = req.params.id;
    var cols = ['id','title','time'];
    $faq.getCols({'category':categoryId},cols,function(err,faqs){
        if(err){
            res.render('faq/api/list',{
                error:'query error'
            });
        }else{
            res.render('faq/api/list',{
                faqs:faqs
            });
        }
    });
};

module.exports = faq;