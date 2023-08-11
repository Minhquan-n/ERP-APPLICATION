const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');

const app = express();
const ApiError = require('./app/api-error');
const AdminRouter = require('./app/routes/admin_route');
const StaffRouter = require('./app/routes/staff_route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());

app.use('/api/admin', AdminRouter);
app.use('/api/staff', StaffRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Interal Server Error",
    });
});

module.exports = app;