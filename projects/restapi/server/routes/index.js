var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var products = require('./products.js');
var users = require('./users.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/v1/products', products.getAll);
router.get('/api/v1/product/:id', products.getOne);
router.post('/api/v1/product/', products.create);
router.put('/api/v1/product/:id', products.update);
router.delete('/api/v1/product/:id', products.delete);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/admin/users', users.getAll);
router.get('/api/v1/admin/user/:id', users.getOne);
router.post('/api/v1/admin/user/', users.create);
router.put('/api/v1/admin/user/:id', users.update);
router.delete('/api/v1/admin/user/:id', users.delete);

module.exports = router;
