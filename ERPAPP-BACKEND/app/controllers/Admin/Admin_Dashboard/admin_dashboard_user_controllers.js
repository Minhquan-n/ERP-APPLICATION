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
    try {
        const avgOT = await Admin_User_Dashboard.avgOT();    
        res.send(avgOT);
    } catch (err) {
        return next(new ApiErr(500, 'An error occurred while caculate over time average.'));
    }
}

// Lay so ngay nghi trung binh trong thang cu
exports.GetAverageOff = async (req, res, next) => {
    res.send('ok');
}