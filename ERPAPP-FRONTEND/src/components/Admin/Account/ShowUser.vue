<script>
    export default {
        props: {
            user: {type: Object, default: {}},
        },
    }
</script>
 
<template>
    <div id="user_info">
        <div id="basic_info">
            <div id="avt">
                <img :src="(user.avt.avt_secure_url)">
            </div>
            <div id="basic_info_right">
                <p class="info_row_title">1. Thông tin nhân viên</p>
                <div class="info_row_content">
                    <div class="info_field large_row">
                        <p class="field_title">Họ tên:</p><p class="field_val">{{ user.ttcn.hoten }}</p>
                    </div>
                    <div class="info_field large_row">
                        <p class="field_title">MSNV:</p><p class="field_val">{{ user.taikhoan.msnv }}</p>
                    </div>
                    <div class="info_field large_row">
                        <p class="field_title">Email:</p><p class="field_val">{{ user.taikhoan.email }}</p>
                    </div>
                    <div class="info_field large_row">
                        <p class="field_title">Số điện thoại:</p><p class="field_val">{{ user.taikhoan.sdt }}</p>
                    </div>
                    <div class="info_field large_row">
                        <p class="field_title">Địa chỉ:</p><p class="field_val">{{ user.ttcn.dclh_sonha + ', ' + user.ttcn.tenphuongxa + ', ' + user.ttcn.tenquanhuyen + ', ' + user.ttcn.tentinhthanh + '.' }}</p>
                    </div>
                </div>
            </div>        
        </div>
        <div id="personal_info" class="info_area">
            <div class="info_row">
                <p class="info_row_title">2. Thông tin cá nhân</p>
                <div class="info_row_content">
                    <div class="info_field medium_row">
                        <p class="field_title">CCCD:</p><p class="field_val">{{ user.ttcn.cccd }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Ngày cấp:</p><p class="field_val">{{ user.ttcn.ngaycap_cccd }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Nơi cấp:</p><p class="field_val">{{ user.ttcn.noicap_cccd }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Dân tộc:</p><p class="field_val">{{ user.ttcn.tendantoc }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Ngày sinh:</p><p class="field_val">{{ user.ttcn.ngaysinh }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Giới tính:</p><p class="field_val">{{ user.ttcn.gioitinh }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Trình độ:</p><p class="field_val">{{ user.ttcn.trinhdo }}</p>
                    </div>
                </div>
            </div>
            <div class="info_row">
                <p class="info_row_title">3. Thông tin tài khoản</p>
                <div class="info_row_content">
                    <div class="info_field medium_row">
                        <p class="field_title">Số tài khoản:</p><p class="field_val">{{ user.ttcn.stk }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Tên tài khoản:</p><p class="field_val">{{ user.ttcn.tentk }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Ngân hàng:</p><p class="field_val">{{ user.ttcn.tenNH }}</p>
                    </div>
                </div>
            </div>
            <div class="info_row">
                <p class="info_row_title">4. Thông tin người thân</p>
                <div class="info_row_content">                
                    <div class="info_field large_row">
                        <p class="field_title">Họ tên người thân:</p><p class="field_val">{{ user.ttcn.hoten_nguoithan }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Mối quan hệ:</p><p class="field_val">{{ user.ttcn.mqh_nguoithan }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Số điện thoại:</p><p class="field_val">{{ user.ttcn.sdt_nguoithan }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="work_info" class="info_area">
            <div class="info_row">
                <p class="info_row_title">5. Thông tin công việc</p>
                <div class="info_row_content">                
                    <div class="info_field large_row">
                        <p class="field_title">Ngày bắt đầu công việc:</p><p class="field_val">{{ user.ttcv.ngaybatdau }}</p>
                    </div>
                    <div class="info_field large_row">
                        <p class="field_title">Loại hình công việc:</p><p class="field_val">{{ user.ttcv.tenloaihinhcongviec }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Chi nhánh:</p><p class="field_val">{{ user.chinhanh.tenchinhanh }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Bộ phận:</p><p class="field_val">{{ user.bophan.tenbophan }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Chức vụ:</p><p class="field_val">{{ user.chucvu.tenchucvu }}</p>
                    </div>
                </div>
            </div>
            <div class="info_row">
                <p class="info_row_title">6. Thông tin hợp đồng lao động</p>
                <div class="info_row_content">                
                    <div class="info_field large_row">
                        <p class="field_title">Số hợp đồng lao động:</p><p class="field_val">{{ user.hdld.sohdld }}</p>
                    </div>
                    <div class="info_field large_row">
                        <p class="field_title">Ngày ký hợp đồng:</p><p class="field_val">{{ user.hdld.ngaykyhopdong }}</p>
                    </div>
                    <div class="info_field large_row">
                        <p class="field_title">Loại hợp đồng:</p><p class="field_val">{{ user.hdld.loaihopdong }}</p>
                    </div>
                </div>
            </div>
            <div class="info_row">
                <p class="info_row_title">7. Thông tin bảo hiểm</p>
                <div class="info_row_content">                
                    <div class="info_field medium_row">
                        <p class="field_title">Số BHXH:</p><p class="field_val">{{ user.ttcv.soBHXH }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Số BHYT:</p><p class="field_val">{{ user.ttcv.soBHYT }}</p>
                    </div>
                    <div class="info_field large_row">
                        <p class="field_title">Nơi đăng ký khám chữa bệnh:</p><p class="field_val">{{ user.ttcv.noidkkcb }}</p>
                    </div>
                </div>
            </div>
            <div class="info_row">
                <p class="info_row_title">8. Thông tin lương</p>
                <div class="info_row_content">                
                    <div class="info_field large_row">
                        <p class="field_title">Lương cơ bản:</p><p class="field_val">{{ user.ttcv.luongcoban + 'VND' }}</p>
                    </div>
                    <div class="info_field large_row">
                        <p class="field_title">Lương cơ bản 1 giờ:</p><p class="field_val">{{ user.ttcv.luongcoban1h + 'VND' }}</p>
                    </div>
                    <div class="info_field small_row" style="grid-template-columns: 55% 45%">
                        <p class="field_title">Mức đóng BHXH:</p><p class="field_val">{{ user.ttcv.khautruBHXH + '%' }}</p>
                    </div>
                    <div class="info_field small_row" style="grid-template-columns: 55% 45%">
                        <p class="field_title">Mức đóng BHYT:</p><p class="field_val">{{ user.ttcv.khautruBHYT + '%' }}</p>
                    </div>
                    <div class="info_field small_row" style="grid-template-columns: 55% 45%">
                        <p class="field_title">Mức đóng BHTN:</p><p class="field_val">{{ user.ttcv.khautruBHTN + '%' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    @import url('@/assets/Admin/Account/accountUserInfo.css');
</style>