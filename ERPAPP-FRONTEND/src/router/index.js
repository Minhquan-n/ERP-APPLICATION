import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: '/home',
        name: 'AdminHomePage',
        component: () => import('@/views/Admin/HomePage.vue'),
    },
    {
        path: '/',
        name: 'LoginPage',
        component: () => import('@/views/LoginPage.vue'),
    },
    {
        path: '/catalogues',
        name: 'AdminDataCatalogPage',
        component: () => import('@/views/Admin/DataCatalogPage.vue'),
    },
    {
        path: '/usr',
        name: 'AdminHRPage',
        component: () => import('@/views/Admin/HRManagementPage.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;