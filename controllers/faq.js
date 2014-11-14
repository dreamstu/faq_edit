var faq = require('../routers/faq');
module.exports = {
    init:function(app) {
        console.log('[Initializes the faq controller]');
        app.route('/api/faq/list/:categoryId').get(faq.api.getListByCategoryId);
        app.route('/api/faq/detail/:id').get(faq.api.getDetailById);
        app.route('/api/faq/view/list/:id').get(faq.api.list);
        app.route('/api/faq/view/detail/:id').get(faq.api.detail);
    },
    new:faq.new,
    list:faq.list,
    preview:faq.preview,
    delete:faq.delete,
    edit:faq.edit
};