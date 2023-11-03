<script>
    import { Doughnut } from 'vue-chartjs'
    import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js'

    ChartJS.register(Tooltip, Legend, ArcElement)

    export default {
        components: {
            Doughnut,
        },

        props: {
            gender: {type: Array, required: true},
        },

        data () {
            return {
                chartOption: {
                    responsive: true,
                },
                genderdata: {
                    labels: ['Nam', 'Nữ', 'Không xác định'],
                    datasets: [
                        {
                            data: this.gender,
                            backgroundColor: ['#E46651', '#41B883', '#00D8FF'],
                            hoverOffset: 4

                        }
                    ]
                },
            }
        },
    }
</script>

<template>
    <div id="gender_chart">
        <strong>Số lượng nhân viên theo giới tính</strong>
        <Doughnut :data="genderdata" :options="chartOption" />
    </div>
</template>