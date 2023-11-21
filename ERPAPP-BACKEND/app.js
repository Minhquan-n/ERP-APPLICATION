const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');
const app = express();
const ApiError = require('./app/api-error');
const AdminRouter = require('./app/routes/Admin/Admin_Accounts/admin_accounts_route');
const AdminCatalogueRouter = require('./app/routes/Admin/Admin_Catalogues/admin_catalogues_route');
const AdminPaySheetRouter = require('./app/routes/Admin/Admin_Paysheets/admin_paysheets_route');
const AdminUserDashboard = require('./app/routes/Admin/Admin_Dashboard/admin_dashboard_user_routes');
const UserRouter = require('./app/routes/User/User_Accounts/user_accounts_route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());

// Cac route cua admin
app.use('/api/erpapp', AdminRouter);
app.use('/api/erpapp', AdminCatalogueRouter);
app.use('/api/erpapp', AdminPaySheetRouter);
app.use('/api/erpapp', AdminUserDashboard);

// Cac route cua user
app.use('/api/erpapp', UserRouter);

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