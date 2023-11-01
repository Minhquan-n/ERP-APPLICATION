<script>
    import {Form, Field, ErrorMessage} from 'vee-validate';
    import * as yup from 'yup';
    import Services from '@/services/admin.services';

    export default {
        components: {
            Form,
            Field,
            ErrorMessage,
        },

        emits: ['adduser'],

        data () {

            const formSchema = yup.object().shape({
                sdt: yup.string()
                    .required('Nhập số điện thoại.')
                    .matches(/^0[1-9]\d{8}$/g, 'Số điện thoại sai định dạng.'),
                email: yup.string()
                    .required('Nhập email.')
                    .matches(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Email không đúng định dạng.'),
                hoten: yup.string()
                    .required('Nhập họ tên.'),
                ngaykyhopdong: yup.date()
                    .required('Chọn ngày ký hợp đồng.'),
                sohdld: yup.string()
                    .required('Nhập số hợp đồng lao động.'),
                loaihopdong: yup.string()
                    .required('Chọn loại hợp đồng.'),
                luongcoban: yup.string()
                    .required('Nhập lương cơ bản.'),
                loaihinhcongviec: yup.number()
                    .moreThan(0, 'Chọn loại hình công việc.'),
                chinhanh: yup.number()
                    .min(1, 'Chọn chi nhánh làm việc.'),
                bophan: yup.number()
                    .min(1, 'Chọn bộ phận làm việc.'),
                chucvu: yup.number()
                    .min(1, 'Chọn chức vụ.'),
            });

            return {
                formSchema,
                worktype: 0,
                contracttype: '',
                branch: [],
                branchselect: 0,
                department: [],
                departmentselect: 0,
                position: [],
                positionselect: 0,
            }
        },

        methods: {
            async setUpForm () {
                try {
                    this.branch = await Services.getBranchList();
                    if (this.branch.length === 0) throw err;
                    this.department = await Services.getDepartmentList();
                    if (this.department.length === 0) throw err;
                    this.position = await Services.getPositionList();
                    if (this.position.length === 0) throw err;
                } catch (err) {
                    console.log(err);
                }
            },

            async addUser (data, {resetForm}) {
                try {
                    const add = await Services.createUser(data);
                    if (Object.keys(add).length === 0) throw err;
                    this.$emit('adduser', 'Tạo tài khoản thành công.');
                    resetForm();
                } catch (err) {
                    console.log(err);
                    this.$emit('adduser', 'Tạo tài khoản thất bại.');
                }
            }
        },

        async created () {
            await this.setUpForm();
        }
    }
</script>

<template>
    <Form name="adduserform" @submit="addUser" ref="addform" :validation-schema="formSchema">
        <div class="form_field">
            <label for="sdt">Số điện thoại</label>
            <Field type="text" name="sdt" id="sdt" />
            <ErrorMessage name="sdt" />
        </div>
        <div class="form_field">
            <label for="email">Email</label>
            <Field type="email" name="email" id="email" />
            <ErrorMessage name="email" />
        </div>
        <div class="form_field">
            <label for="hoten">Họ tên</label>
            <Field type="text" name="hoten" id="hoten" />
            <ErrorMessage name="hoten" />
        </div>
        <div class="form_field">
            <label for="sohdld">Số HDLD</label>
            <Field type="text" name="sohdld" id="sohdld" />
            <ErrorMessage name="sohdld" />
        </div>
        <div class="form_field">
            <label for="ngaykyhopdong">Ngày ký HDLD</label>
            <Field type="date" name="ngaykyhopdong" id="ngaykyhopdong" />
            <ErrorMessage name="ngaykyhopdong" />
        </div>
        <div class="form_field">
            <label for="loaihopdong">Loại HDLD</label>
            <Field type="text" name="loaihopdong" v-model="contracttype" :style="{display: 'none'}" />
            <select name="loaihopdong" id="loaihopdong" v-model="contracttype">
                <option value="">Chọn loại hợp đồng</option>
                <option value="Không xác định thời hạn">Không xác định thời hạn</option>
                <option value="Xác định thời hạn">Xác định thời hạn</option>
            </select>
            <ErrorMessage name="loaihopdong" />
        </div>
        <div class="form_field">
            <label for="luongcoban">Lương cơ bản</label>
            <Field type="text" name="luongcoban" id="luongcoban" />
            <ErrorMessage name="luongcoban" />
        </div>
        <div class="form_field">
            <label for="loaihinhcongviec">Loại hình công việc</label>
            <Field type="text" name="loaihinhcongviec" v-model="worktype" :style="{display: 'none'}" />
            <select name="loaihinhcongviec" id="loaihinhcongviec" v-model="worktype">
                <option value="0">Không xác định</option>
                <option value="1">Toàn thời gian</option>
                <option value="2">Bán thời gian</option>
            </select>
            <ErrorMessage name="loaihinhcongviec" />
        </div>
        <div class="form_field">
            <label for="chinhanh">Chi nhánh</label>
            <Field type="number" name="chinhanh" v-model="branchselect" :style="{display: 'none'}" />
            <select name="chinhanh" id="chinhanh" v-model="branchselect">
                <option value="0">Không xác định</option>
                <option v-for="item in branch" :value="item.id_chinhanh">{{ item.tenchinhanh }}</option>
            </select>
            <ErrorMessage name="chinhanh" />
        </div>
        <div class="form_field">
            <label for="bophan">Bộ phận</label>
            <Field type="number" name="bophan" v-model="departmentselect" :style="{display: 'none'}" />
            <select name="bophan" id="bophan" v-model="departmentselect">
                <option value="0">Không xác định</option>
                <option v-for="item in department" :value="item.id_bophan">{{ item.tenbophan }}</option>
            </select>
            <ErrorMessage name="bophan" />
        </div>
        <div class="form_field">
            <label for="chucvu">Chức vụ</label>
            <Field type="number" name="chucvu" v-model="positionselect" :style="{display: 'none'}" />
            <select name="chucvu" id="chucvu" v-model="positionselect">
                <option value="0">Không xác định</option>
                <option v-for="item in position" :value="item.id_chucvu">{{ item.tenchucvu }}</option>
            </select>
            <ErrorMessage name="chucvu" />
        </div>
        <button type="reset">Hủy</button>
        <button type="submit">Tạo</button>
    </Form>
</template>

<style>

</style>