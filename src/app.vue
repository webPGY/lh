<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>

<style lang="less">

html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
}
.app-main{
    width: 100%;
    height: 100%;
}
/* .ivu-page {
    position: relative;
}
.ivu-select-dropdown {
    top: 52px !important;
} */
.pages {
  padding: 20px;
  text-align: right;
    .ivu-select-dropdown {
        top: 52px !important;
    }
}
// 每项搜索条件之间的间隔
.left-space {
  margin-left: 15px;
}
</style>
