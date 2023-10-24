<script>
    import Services from '@/services/admin.services';
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import BranchForm from '@/components/DataCatalogues/Branch/BranchForm.vue';

    export default {
        components: {
            AppHeader,
            BranchForm,
        },

        data () {
            const branch = {
                tenchinhanh: '',
                tinhthanh: '000',
                quanhuyen: '000',
                phuongxa: 0,
                sonha: '',
            }

            return {
                branch,
                error: false,
                serverMessage: '',
            }
        },

        methods: {
            async addBranch (data) {
                const newBranch = await Services.addBranch(data);
                if (newBranch !== 'Success') {
                    this.error = true;
                    this.serverMessage = 'Thêm chi nhánh mới thất bại.';
                }
                this.serverMessage = 'Thêm chi nhánh mới thành công.'
            },
        }
    }
</script>

<template>
    <AppHeader />
    <main>
        <router-link :to="{name: 'AdminDataCatalogBranchPage'}" >Back</router-link>
        <h2>Thêm chi nhánh</h2>
        <div id="addBranchForm">
            <p>{{ serverMessage }}</p>
            <BranchForm :branch="branch" @Branch="addBranch" />
        </div>
    </main>
</template>