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
            return {
                branch: {},
                error: false,
                serverMessage: '',
            }
        },

        methods: {
            async getBranch () {
                this.branch = await Services.getBranch(this.$route.query.id);
            },

            async updateBranch (data) {
                const update = await Services.updateBranch(this.$route.query.id, data);
                if (update !== 'Success') {
                    this.error = true;
                    this.serverMessage = 'Chỉnh sửa chi nhánh thất bại.';
                }
                this.serverMessage = 'Chỉnh sửa thành công.';
            }
        },

        created () {
            this.getBranch();
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <router-link :to="{name: 'AdminDataCatalogBranchPage'}" >Back</router-link>
        <h2>Chỉnh sửa chi nhánh</h2>
        <div id="addBranchForm">
            <p>{{ serverMessage }}</p>
            <BranchForm :branch="branch" @Branch="updateBranch" />
        </div>
    </main>
</template>