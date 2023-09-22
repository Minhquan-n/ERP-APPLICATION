const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');

const app = express();

const ApiError = require('./app/api-error');
const AdminRouter = require('./app/routes/Admin/Admin_Accounts/admin_accounts_route');
const UserRouter = require('./app/routes/User/User_Accounts/user_accounts_route');
const UserDatalogueRouter = require('./app/routes/Admin/Admin_Catalogues/admin_catalogues_route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());

app.use('/api/erpapp', AdminRouter);
app.use('/api/erpapp', UserRouter);
app.use('/api/erpapp', UserDatalogueRouter);

// Bat loi truy cap duong dan khong ton tai
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Interal Server Error",
    });
});

module.exports = app;