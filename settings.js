var redis = require('redis');

module.exports = {
    cookieSecret: 'faq',
    cookieName : 'qs_faq',
    db_pool:{
        host     : '',
        user     : '',
        password : '',
        database : 'faq',
        charset  : 'utf8',
        connectTimeout : 30*60,
        dateStrings: true,
        debug    : false
    },
    redis:{
        client:redis.createClient(),
        host:'localhost',
        port:'6379'
    },
    upload:{
        image_path:'assets/content/upload/images',
        tuya_path:'assets/content/upload/tuya'
    }
};