<script>
    export default {
        data () {
            const navbar = [
                {
                    pageName: 'UserProfilePage',
                    title: 'Hồ sơ nhân viên',
                    path: '/profile',
                },
                {
                    pageName: 'UserPasswordPage',
                    title: 'Mật khẩu',
                    path: '/profile/password',
                },
                {
                    pageName: 'UserPaysheetPage',
                    title: 'Bảng lương',
                    path: '/profile/paysheet',
                },
            ];
            return {
                navbar,
                thisPath: window.location.pathname,
            }
        },
    }
</script>

<template>
    <div id="data_navigation">
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <div class="collapse navbar-collapse d-flex justify-content-between" id="navbarSupportedContent">
                        <ul class="nav nav-tabs">
                            <li v-for="item in navbar" class="nav-item ">
                                <router-link 
                                    class="nav-link" 
                                    :class="[(item.path === thisPath) ? 'active' : '']" 
                                    aria-current="page" 
                                    :to="{name: item.pageName}"
                                >
                                    {{ item.title }}
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
</template>

<style>

</style>