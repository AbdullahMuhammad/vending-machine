const express = require('express');
const authRoute = require('./authRoute');
const productRoute = require('./productsRoute.js');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/products',
        route: authRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
