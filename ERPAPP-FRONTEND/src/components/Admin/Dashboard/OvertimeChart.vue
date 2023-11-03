<script>
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale)

    export default {
        components: {
            Line,
        },

        props: {
            overtime: {type: Object, default: {}},
        },

        data () {
            return {
                chartOption: {
                    responsive: true,
                },
                overtimedata: {
                    labels: ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
                    datasets: [
                        {
                            data: [],
                            backgroundColor: '#f87979',
                            label: 'Số giờ tăng ca'
                        }
                    ]
                },
            }
        },

        methods: {
            setUpChart () {
                this.overtimedata.datasets[0].data = Object.values(this.overtime);
            }
        },

        created () {
            this.setUpChart();
        }
    }
</script>

<template>
    <div id="overtime_chart">
        <strong>Phân bố giờ tăng ca trong tuần</strong>
        <Line v-if="overtimedata.datasets[0].data.length !== 0" :data="overtimedata" :options="chartOption" />
    </div>
</template>