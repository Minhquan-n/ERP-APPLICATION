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
                        path: '/',
                        routername: 'HomePage',
                        icon: 'house',
                        text: 'Trang chủ',
                        position: [1, 2, 3],
                    },
                    {
                        path: '/catalogues',
                        routername: 'DataCatalogPage',
                        icon: 'list',
                        text: 'Quản lý danh mục',
                        position: [1]
                    },
                    {
                        path: '/usr',
                        routername: 'HRPage',
                        icon: 'user',
                        text: 'Quản lý nhân sự',
                        position: [1, 2]
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
    <header :style="{height: height + 'px'}">
        <div id="header_logo"><img src="@/assets/horizontallogo.png"></div>
        <div id="header_navigation">
            <ul class="nav">
                <li class="nav-item w-100" v-for="item in nav_items">
                    <router-link class="w-100" :class="[path ===  item.path ? 'nav_item_active' : 'nav_item']" :to="{name: item.routername }">
                        <b class="nav_item_icon"><font-awesome-icon :icon=item.icon /></b>
                        <p class="nav_item_text">{{ item.text }}</p>
                    </router-link>
                </li>
            </ul>
            <div id="header_user">
                <ul class="nav">
                    <li class="nav-item w-100 nav_item">
                        <div class="nav_item_icon"><img id="uploadedimage" class="avt" :src="avt" /></div>
                        <p class="nav_item_text">{{ username }}</p>
                    </li>
                    <li class="nav-item w-100 nav_item" @click="logout">
                        <b class="nav_item_icon"><font-awesome-icon icon="fa-solid fa-right-from-bracket" /></b>
                        <p class="nav_item_text">Logout</p>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<style>
    @import '@/assets/header.css';
</style>