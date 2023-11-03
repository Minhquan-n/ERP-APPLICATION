<script>
    import { Bar } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

    export default {
        components: {
            Bar,
        },

        props: {
            department: {type: Array, default: []},
        },

        data () {
            return {
                chartOption: {
                    responsive: true,
                },
                departmenttotalsalarydata: {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            backgroundColor: '#f87979',
                            label: 'Tổng lương theo bộ phận'
                        }
                    ]
                },
            }
        },

        methods: {
            setUpChart () {
                const data = this.departmenttotalsalarydata.datasets[0].data;
                const labels = this.departmenttotalsalarydata.labels;
                this.department.forEach(element => {
                    data.push(element.luong);
                    labels.push(element.tenbophan);
                });
            }
        },

        created () {
            this.setUpChart();
        }
    }
</script>

<template>
    <div id="user_in_branch_chart">
        <h4>Tổng lương theo bộ phận</h4>
        <Bar v-if="departmenttotalsalarydata.datasets[0].data.length !== 0" :data="departmenttotalsalarydata" :options="chartOption" />
    </div>
</template>

<style>

</style>