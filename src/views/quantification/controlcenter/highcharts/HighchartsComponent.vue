<template>
    <div class="highcharts-container"></div>
</template>

<script>
    import Highcharts from 'highcharts/highstock';
    import highchartsZhCN from '@/libs/highcharts-zh_CN'

    // 汉化
    highchartsZhCN(Highcharts);

    export default {
        props: ['options', 'styles'],
        name: 'highcharts',
        data () {
            return {
                chart: null
            };
        },
        mounted () {
            this.initChart();
        },
        methods: {
            initChart () {
                // console.log(this.$el);
                this.$el.style.width = (this.styles.width || 800) + 'px';
                this.$el.style.height = (this.styles.height || 400) + 'px';
                this.chart = new Highcharts.stockChart(this.$el, this.options);
            }
        }
    };
</script>

<style lang="less">
    .highcharts-container {
        width: 800px;
        height: 400px;
    }
</style>
