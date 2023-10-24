<script>


    export default {
        data () {
            const navbar = [
                {
                    pageName: 'AdminHRPage',
                    title: 'Nhân viên',
                    path: '/usr',
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