var category = require('../routers/category');
module.exports = {
    init:function(app) {
        console.log('[Initializes the category controller]');
        app.get('/api/category/list',category.list);
        app.route('/json/category/pid/:pid/lv/:level').get(category.findByPidAndLevel);
    },
    new:category.new
};