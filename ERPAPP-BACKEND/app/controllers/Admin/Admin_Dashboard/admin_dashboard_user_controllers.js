const ApiErr = require('../../../api-error');
const Admin_User_Dashboard = require('../../../services/Admin/Admin_Dashboard/admin_dashboard_user_services');

// Lay tong so nhan vien, tong nam, tong nu, tong tung chi nhanh
exports.Overview = async (req, res, next) => {
    try {
        const overview = await Admin_User_Dashboard.overview();
        res.send(overview); 
    } catch (err) {
        return next(new ApiErr(500, 'An error occurred while load overview information.'));
    }
}

// Lay trung binh gio tang ca trong thang cu
exports.GetAverageOT = async (req, res, next) => {
    if (!req.body.thang || !req.body.nam) return next(new ApiErr(400, 'Provide month and year.'));
    try {
        const month = req.body.thang;
        const year = req.body.nam;
        const avgOT = await Admin_User_Dashboard.workingTime(month, year);    
        res.send(avgOT);
    } catch (err) {
        return next(new ApiErr(500, 'An error occurred while caculate over time average.'));
    }
}