import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: () => import('@/views/HomePage.vue'),
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/views/LoginPage.vue'),
    },
    {
        path: '/catalogues',
        name: 'DataCatalogPage',
        component: () => import('@/views/DataCatalogPage.vue'),
    },
    {
        path: '/usr',
        name: 'HRPage',
        component: () => import('@/views/HRManagementPage.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;