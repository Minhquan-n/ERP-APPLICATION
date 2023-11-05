<script>
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';

    import Services from '@/services/admin.services'

    export default {
        props: {
            branch: {type: Object, default: {}},
        },

        emits: ['Branch'],

        components: {
            Form,
            Field,
            ErrorMessage,
        },

        data () {
            const formSchema = yup.object().shape({
                    tenchinhanh: yup.string()
                                    .required('Nhập tên chi nhánh.')
                                    .max(200,'Tên quá số ký tự cho phép.'),
                    tinhthanh: yup.string()
                                .required('Bạn chưa chọn tỉnh thành.')
                                .matches(/[A-Z]/g, 'Bạn chưa chọn tỉnh thành.'),
                    quanhuyen: yup.string()
                                .required('Chọn quận huyện.')
                                .matches(/[A-Z]/g, 'Bạn chưa chọn quận huyện.'),
                    phuongxa: yup.number()
                                .required('Bạn chưa chọn phường xã.')
                                .moreThan(0, 'Bạn chưa chọn phường xã.'),
                    sonha: yup.string().required('Bạn chưa nhập số nhà.'),
                });

            const form = {
                formProvince: [],
                formDistrict: [],
                formWard: [],              
            }

            return {
                formSchema,
                form,
            }
        },

        methods: {
            async getProvince () {
                this.form.formProvince = await Services.getProvinceList();
            },

            async getDistrict() {
                const data = {tinhthanh: this.branch.tinhthanh}
                this.form.formDistrict = await Services.getDistrictList(data);
            },

            async getWard () {
                const data = {tinhthanh: this.branch.tinhthanh, quanhuyen: this.branch.quanhuyen};
                this.form.formWard = await Services.getWardList(data);
            },

            submitForm () {
                this.$emit('Branch', this.branch);
            }
        },

        async created () {
            await this.getProvince();
            await this.getDistrict();
            await this.getWard();
        }
    }
</script>

<template>
    <Form name="branchForm" @submit="submitForm" :validation-schema="formSchema">
        <div class="form_row">
            <div class="form_field large_field">
                <label class="form-label" for="tenchinhanh">Tên chi nhánh</label>
                <Field class="form-control" type="text" name="tenchinhanh" id="tenchinhanh" v-model="branch.tenchinhanh" />
                <ErrorMessage class="text-danger" name="tenchinhanh" />
            </div>
            <div class="form_field large_field">
                <label class="form-label" for="sonha">Số nhà</label>
                <Field class="form-control" type="text" name="sonha" id="sonha" v-model="branch.sonha" />
                <ErrorMessage class="text-danger" name="sonha" />
            </div>
            <div class="form_field small_field">
                <label class="form-label" for="tinhthanh">Tỉnh thành</label>
                <Field name="tinhthanh" v-model="branch.tinhthanh" :style="{display: 'none'}" />
                <select class="form-select" name="tinhthanh" id="tinhthanh" v-model="branch.tinhthanh" @change="getDistrict">
                    <option v-for="tinh in form.formProvince" :value=tinh.id_tinhthanh :selected="(branch.tinhthanh === tinh.id_tinhthanh) ? 'selected' : ''">{{ tinh.tentinhthanh }}</option>
                </select>
                <ErrorMessage class="text-danger" name="tinhthanh" />
            </div>
            <div class="form_field small_field">
                <label class="form-label" for="tinhthanh">Quận huyện</label>
                <Field name="quanhuyen" v-model="branch.quanhuyen" :style="{display: 'none'}" />
                <select class="form-select" name="quanhuyen" id="quanhuyen" v-model="branch.quanhuyen" @change="getWard">
                    <option v-for="quan in form.formDistrict" :value=quan.id_quanhuyen :selected="(branch.quanhuyen === quan.id_quanhuyen) ? 'selected' : ''">{{ quan.tenquanhuyen }}</option>
                </select>
                <ErrorMessage class="text-danger" name="quanhuyen" />
            </div>
            <div class="form_field small_field">
                <label class="form-label" for="tinhthanh">Phường xã</label>
                <Field name="phuongxa" v-model="branch.phuongxa" :style="{display: 'none'}" />
                <select class="form-select" name="phuongxa" id="phuongxa" v-model="branch.phuongxa">
                    <option v-for="phuong in form.formWard" :value=phuong.id_phuongxa :selected="(branch.phuongxa === phuong.id_phuongxa) ? 'selected' : ''">{{ phuong.tenphuongxa }}</option>
                </select>
                <ErrorMessage class="text-danger" name="phuongxa" />
            </div>
        </div>
        <div class="form_button">
            <button type="submit" class="form_btn btn btn-primary">Cập nhật</button>
        </div>
    </Form>
</template>

<style>
    @import url('@/assets/Admin/Account/accountForm.css');
</style>