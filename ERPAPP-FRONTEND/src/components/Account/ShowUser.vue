<script>
    export default {
        props: {
            user: {type: Object, default: {}},
        },
    }
</script>

<template>
    <div id="basic_info">
        <div id="avt">
            <img :src="(user.avt.avt_secure_url)" style="height: 100px; width: 100px; border-radius: 50%; object-fit: fill;">
        </div>
        <div id="basic_info_right">
            <p class="info_row_title">1. Thông tin nhân viên</p>
            <div class="info_field">
                <b>Họ tên:</b><p>{{ user.ttcn.hoten }}</p>
            </div>
            <div class="info_field">
                <b>MSNV:</b><p>{{ user.taikhoan.msnv }}</p>
            </div>
            <div class="info_field">
                <b>Email:</b><p>{{ user.taikhoan.email }}</p>
            </div>
            <div class="info_field">
                <b>Số điện thoại:</b><p>{{ user.taikhoan.sdt }}</p>
            </div>
            <div class="info_field">
                <b>Địa chỉ:</b><p>{{ user.ttcn.dclh_sonha + ', ' + user.ttcn.tenphuongxa + ', ' + user.ttcn.tenquanhuyen + ', ' + user.ttcn.tentinhthanh + '.' }}</p>
            </div>
        </div>        
    </div>
    <div id="personal_info" class="info_area">
        <h3>Thông tin cá nhân</h3>
        <div class="info_row">
            <p class="info_row_title">2. Thông tin cá nhân</p>
            <div class="info_row_content">
                <div class="info_field">
                    <b>CCCD:</b><p>{{ user.ttcn.cccd }}</p>
                </div>
                <div class="info_field">
                    <b>Ngày cấp:</b><p>{{ user.ttcn.ngaycap_cccd }}</p>
                </div>
                <div class="info_field">
                    <b>Nơi cấp:</b><p>{{ user.ttcn.noicap_cccd }}</p>
                </div>
                <div class="info_field">
                    <b>Dân tộc:</b><p>{{ user.ttcn.tendantoc }}</p>
                </div>
                <div class="info_field">
                    <b>Ngày sinh:</b><p>{{ user.ttcn.ngaysinh }}</p>
                </div>
                <div class="info_field">
                    <b>Giới tính:</b><p>{{ user.ttcn.gioitinh }}</p>
                </div>
                <div class="info_field">
                    <b>Trình độ:</b><p>{{ user.ttcn.trinhdo }}</p>
                </div>
            </div>
        </div>
        <div class="info_row">
            <p class="info_row_title">3. Thông tin tài khoản</p>
            <div class="info_row_content">
                <div class="info_field">
                    <b>Số tài khoản:</b><p>{{ user.ttcn.stk }}</p>
                </div>
                <div class="info_field">
                    <b>Tên tài khoản:</b><p>{{ user.ttcn.tentk }}</p>
                </div>
                <div class="info_field">
                    <b>Ngân hàng:</b><p>{{ user.ttcn.tenNH }}</p>
                </div>
            </div>
        </div>
        <div class="info_row">
            <p class="info_row_title">4. Thông tin người thân</p>
            <div class="info_row_content">                
                <div class="info_field">
                    <b>Họ tên người thân:</b><p>{{ user.ttcn.hoten_nguoithan }}</p>
                </div>
                <div class="info_field">
                    <b>Mối quan hệ:</b><p>{{ user.ttcn.mqh_nguoithan }}</p>
                </div>
                <div class="info_field">
                    <b>Số điện thoại:</b><p>{{ user.ttcn.sdt_nguoithan }}</p>
                </div>
            </div>
        </div>
    </div>
    <div id="work_info" class="info_area">
        <h3>Thông tin công việc</h3>
        <div class="info_row">
            <p class="info_row_title">5. Thông tin công việc</p>
            <div class="info_row_content">                
                <div class="info_field">
                    <b>Ngày bắt đầu công việc:</b><p>{{ user.ttcv.ngaybatdau }}</p>
                </div>
                <div class="info_field">
                    <b>Loại hình công việc:</b><p>{{ user.ttcv.tenloaihinhcongviec }}</p>
                </div>
                <div class="info_field">
                    <b>Chi nhánh:</b><p>{{ user.chinhanh.tenchinhanh }}</p>
                </div>
                <div class="info_field">
                    <b>Bộ phận:</b><p>{{ user.bophan.tenbophan }}</p>
                </div>
                <div class="info_field">
                    <b>Chức vụ:</b><p>{{ user.chucvu.tenchucvu }}</p>
                </div>
            </div>
        </div>
        <div class="info_row">
            <p class="info_row_title">6. Thông tin hợp đồng lao động</p>
            <div class="info_row_content">                
                <div class="info_field">
                    <b>Số hợp đồng lao động:</b><p>{{ user.hdld.sohdld }}</p>
                </div>
                <div class="info_field">
                    <b>Ngày ký hợp đồng:</b><p>{{ user.hdld.ngaykyhopdong }}</p>
                </div>
                <div class="info_field">
                    <b>Loại hợp đồng:</b><p>{{ user.hdld.loaihopdong }}</p>
                </div>
            </div>
        </div>
        <div class="info_row">
            <p class="info_row_title">7. Thông tin bảo hiểm</p>
            <div class="info_row_content">                
                <div class="info_field">
                    <b>Số BHXH:</b><p>{{ user.ttcv.soBHXH }}</p>
                </div>
                <div class="info_field">
                    <b>Số BHYT:</b><p>{{ user.ttcv.soBHYT }}</p>
                </div>
                <div class="info_field">
                    <b>Nơi đăng ký khám chữa bệnh:</b><p>{{ user.ttcv.noidkkcb }}</p>
                </div>
            </div>
        </div>
        <div class="info_row">
            <p class="info_row_title">8. Thông tin lương</p>
            <div class="info_row_content">                
                <div class="info_field">
                    <b>Luong cơ bản:</b><p>{{ user.ttcv.luongcoban + 'VND' }}</p>
                </div>
                <div class="info_field">
                    <b>Luong cơ bản 1 giờ:</b><p>{{ user.ttcv.luongcoban1h + 'VND' }}</p>
                </div>
                <div class="info_field">
                    <b>Mức đóng BHXH:</b><p>{{ user.ttcv.khautruBHXH + '%' }}</p>
                </div>
                <div class="info_field">
                    <b>Mức đóng BHYT:</b><p>{{ user.ttcv.khautruBHYT + '%' }}</p>
                </div>
                <div class="info_field">
                    <b>Mức đóng BHTN:</b><p>{{ user.ttcv.khautruBHTN + '%' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

</style>