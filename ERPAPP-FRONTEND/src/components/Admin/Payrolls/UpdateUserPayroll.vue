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
                    this.$emit('updatePayroll', true);
                } catch (err) {
                    console.log(err);
                    this.$emit('updatePayroll', false);
                }
            }
        }
    }
</script>

<template>
    <div class="modal-body">
        <Form name="payroll_form" @submit="editPayroll">
            <div class="info_row">
                <div class="info_row_content"> 
                    <div class="info_field medium_row" style="grid-template-columns: 20% 80%">
                        <p class="field_title">MSNV:</p><p class="field_val">{{ userPayroll.msnv }}</p>
                    </div>
                    <div class="info_field medium_row">
                        <p class="field_title">Số giờ tăng ca:</p><p class="field_val">{{ userPayroll.sogiotangca }}</p>
                    </div>              
                    <div class="info_field medium_row">
                        <p class="field_title">Lương cơ bản:</p><p class="field_val">{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(userPayroll.luongcoban) }}</p>
                    </div>
                    <div class="info_field medium_row" style="grid-template-columns: 40% 60%">
                        <p class="field_title">Lương cơ bản 1 giờ:</p><p class="field_val">{{ Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(userPayroll.luongcoban1h) }}</p>
                    </div>
                </div>
            </div>
            <div class="form_field">
                <label class="form-label" for="id_dotluong">Đợt lương</label>
                <Field class="form-control" type="text" name="id_dotluong" id="id_dotluong" v-model="userPayroll.id_dotluong" :readonly="true" />
            </div>
            <div class="form_field">
                <label class="form-label" for="sogiolam">Tổng số giờ làm</label>
                <Field class="form-control" type="number" name="sogiolam" id="sogiolam" v-model="userPayroll.sogiolam" />
            </div>
            <div class="form_field">
                <label class="form-label" for="thuong">Thưởng</label>
                <Field class="form-control" type="text" name="thuong" id="thuong" v-model="userPayroll.thuong" />
            </div>
            <div class="form_field">
                <label class="form-label" for="ghichu">Ghi chú</label>
                <Field class="form-control" type="text" name="ghichu" id="ghichu" v-model="userPayroll.ghichu" />
            </div>
            <div class="form_button">
                <button type="button" class="form_btn btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" class="form_btn btn btn-primary">Cập nhật</button>
            </div>
        </Form>
    </div>
</template>

<style>
    @import url('@/assets/Admin/Account/accountUserInfo.css');
</style>