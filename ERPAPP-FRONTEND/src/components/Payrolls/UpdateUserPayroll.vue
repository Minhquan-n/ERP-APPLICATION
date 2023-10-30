<script>
    import Services from '@/services/admin.services';
    import { Form, Field } from 'vee-validate';

    export default {
        components: {
            Form, 
            Field,
        },

        props: {
            userPayroll: {type: Object, default: {}},
        },

        emits: ['updatePayroll'],

        methods: {
            async editPayroll () {
                try {
                    const update = await Services.admin_upadatePaysheet(this.userPayroll);
                    if (update !== 'Success') throw err;
                    this.$emit('updatePayroll', `Cập nhật thành công bảng lương nhân viên ${this.userPayroll.hoten}`);
                } catch (err) {
                    console.log(err);
                    this.$emit('updatePayroll', `Cập nhật thất bại.`);
                }
            }
        }
    }
</script>

<template>
    <Form name="payroll_form" @submit="editPayroll">
        <h2>Bảng lương nhân viên {{ userPayroll.hoten }}</h2>
        <p>MSNV: {{ userPayroll.msnv }}</p>
        <p>Luong cơ bản: {{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(userPayroll.luongcoban) }}</p>
        <p>Luong cơ bản 1 giờ: {{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(userPayroll.luongcoban1h) }}</p>
        <p>Số giờ tăng ca: {{ userPayroll.sogiotangca }}</p>
        <div class="form_field">
            <label for="id_dotluong">Đợt lương</label>
            <Field type="text" name="id_dotluong" id="id_dotluong" v-model="userPayroll.id_dotluong" :readonly="true" />
        </div>
        <div class="form_field">
            <label for="sogiolam">Tổng số giờ làm</label>
            <Field type="number" name="sogiolam" id="sogiolam" v-model="userPayroll.sogiolam" />
        </div>
        <div class="form_field">
            <label for="thuong">Thưởng</label>
            <Field type="text" name="thuong" id="thuong" v-model="userPayroll.thuong" />
        </div>
        <div class="form_field">
            <label for="ghichu">Ghi chú</label>
            <Field type="text" name="ghichu" id="ghichu" v-model="userPayroll.ghichu" />
        </div>
        <button type="submit">Chỉnh sửa</button>
    </Form>
</template>