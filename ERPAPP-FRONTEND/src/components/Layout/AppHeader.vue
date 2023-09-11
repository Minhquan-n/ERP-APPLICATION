<script>
    import Services from '@/services/erpapp.services';
    import $cookie from 'vue-cookies';
    import { library } from '@fortawesome/fontawesome-svg-core'

    export default {
        data () {
            return {
                height: 0,
                avt: '',
                username: '',
                path: '',
                nav_items: [],
            }
        },
        methods: {
            setUpLayout () {
                const position = $cookie.get('position');
                const navigation_item = [
                    {
                        path: '/home',
                        routername: 'HomePage',
                        icon: 'house',
                        text: 'Trang chủ',
                        position: [1, 2, 3],
                    },
                    {
                        path: '/usr',
                        routername: 'HRPage',
                        icon: 'user',
                        text: 'Quản lý nhân sự',
                        position: [1, 2],
                    },
                    {
                        path: '/catalogues',
                        routername: 'DataCatalogPage',
                        icon: 'list',
                        text: 'Quản lý danh mục',
                        position: [1],
                    },
                ];
                this.height = window.innerHeight;
                this.avt = $cookie.get('avt_url');
                this.username = $cookie.get('hoten');
                this.path = window.location.pathname;
                navigation_item.forEach((item) => {
                    const findPosition = item.position.findIndex((val) => val === Number(position));
                    if (findPosition != -1) this.nav_items.push(item);
                });
            },

            async logout () {
                try {
                    if (confirm('Bạn sẽ đăng xuất khỏi ứng dụng.')) {
                        const logout = await Services.logout();
                        if (logout === 'Logout success')
                            this.$router.push({name: 'LoginPage'});
                        else throw new Error('Đăng xuất thất bại.');
                    }
                } catch (error) {
                    console.log(error);
                    alert('Đăng xuất thất bại.');
                }
            }
        },

        created () {
            this.setUpLayout();
        }
    }
</script>

<template>
    <header>
        <router-link id="header_logo" :to="{name: 'HomePage'}"><img></router-link>
        <div id="header_navigation">
            <ul class="nav">
                <li class="nav-item w-100" v-for="item in nav_items">
                    <router-link class="w-100 nav_item" :class="[path ===  item.path ? 'nav_item_active' : '']" :to="{name: item.routername }">
                        <font-awesome-icon :icon=item.icon class="nav_item_icon"/> {{ item.text }}
                    </router-link>
                </li>
            </ul>
        </div>
        <div id="header_user">
            <ul class="nav">
                <li class="nav-item w-100">
                    <div class="nav_item">
                        <img id="uploadedimage" class="nav_avt" :src="avt" /> {{ username }}
                    </div>
                </li>
                <li class="nav-item w-100" @click="logout">
                    <div class="nav_item">
                        <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="nav_item_icon"/> Logout
                    </div>
                </li>
            </ul>
        </div>
    </header>
</template>

<style>
    @import '@/assets/header.css';
</style>