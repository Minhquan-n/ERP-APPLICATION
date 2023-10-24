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
        path: '/catalogues/branch',
        name: 'AdminDataCatalogBranchPage',
        component: () => import('@/views/Admin/DataCatalogues/Branch/BranchListPage.vue'),
    },
    {
        path: '/catalogues/addbranch',
        name: 'AdminDataCatalogAddBranchPage',
        component: () => import('@/views/Admin/DataCatalogues/Branch/BranchAdd.vue'),
    },
    {
        path: '/catalogues/editbranch',
        name: 'AdminDataCatalogEditBranchPage',
        component: () => import('@/views/Admin/DataCatalogues/Branch/BranchEdit.vue'),
    },
    {
        path: '/catalogues/department',
        name: 'AdminDataCataloguesDepartmentPage',
        component: () => import('@/views/Admin/DataCatalogues/Department/DepartmentListPage.vue'),
    },
    {
        path: '/catalogues/position',
        name: 'AdminDataCataloguesPositionPage',
        component: () => import('@/views/Admin/DataCatalogues/Position/PositionListPage.vue'),
    },
    {
        path: '/usr',
        name: 'AdminHRPage',
        component: () => import('@/views/Admin/HRManagementPage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'PageNotFound',
        component: () => import('@/views/PageNotFound/PageNotFound.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;