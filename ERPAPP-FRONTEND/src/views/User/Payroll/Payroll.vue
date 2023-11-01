<script>
    import AppHeader from '@/components/Layout/AppHeader.vue';
    import Navigation from '@/components/User/ProfileHeader.vue';
    import Payroll from '@/components/User/Payroll.vue';
    import Timesheet from '@/components/User/Timesheet.vue';

    export default {
        components: {
            AppHeader,
            Navigation,
            Payroll,
            Timesheet,
        },
    }
</script>

<template>
    <AppHeader />
    <main>
        <Navigation />
        <div class="payroll_container">
            <Payroll />
            <Timesheet />
        </div>
    </main>
</template>