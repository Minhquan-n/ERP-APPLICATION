import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: '/home',
        name: 'HomePage',
        component: () => import('@/views/Admin/HomePage.vue'),
    },
    {
        path: '/',
        name: 'LoginPage',
        component: () => import('@/views/LoginPage.vue'),
    },
    {
        path: '/catalogues',
        name: 'DataCatalogPage',
        component: () => import('@/views/Admin/DataCatalogPage.vue'),
    },
    {
        path: '/usr',
        name: 'HRPage',
        component: () => import('@/views/Admin/HRManagementPage.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;