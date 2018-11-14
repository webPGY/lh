<style lang="less" scoped>
    @import '../../../styles/common.less';
    @import 'warnings.less';
</style>

<template>
    <div class="content">
        <Row class="et-row">
            <Col>
                <span>预警状态：</span>
                <div class="search-out" style="width: 150px;">
                    <Select v-model="status" clearable placeholder="请选择" @on-change="doSearch">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <Button type="primary" icon="ios-search" @click="doSearch">搜索</Button>
            </Col>
        </Row>
        <Table border :columns="tableColumns" :data="tableData"></Table>
        <div style="position: relative;">
            <Page class="pages" :current="pageNum" :total="total" show-elevator @on-change="changePageNum"></Page>
        </div>
    </div>
</template>

<script>
    import api from '@/api/quant'
    import axios from '@/axios/config'
    import moment from 'moment'

    export default {
        name: 'warnings',
        data () {
            return {
                req_url: axios.defaults.baseURL,
                tableColumns: [
                    {
                        title: '机器人名称',
                        key: 'strategyName',
                        width: 200
                    },
                    {
                        title: '预警内容',
                        key: 'warnContent'
                    },
                    {
                        title: '预警次数',
                        key: 'warnCount',
                        width: 100
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 150,
                        render: (h, params) => {
                            return h('span', params.row.status == '1' ? '未解除' : '已解除');
                        }
                    },
                    {
                        title: '开始预警时间',
                        key: 'createTime',
                        width: 200,
                        render: (h, params) => {
                            return h('span', this.dealDate(params.row.createTime));
                        }
                    },
                    {
                        title: '最后预警时间',
                        key: 'updateTime',
                        width: 200,
                        render: (h, params) => {
                            return h('span', this.dealDate(params.row.updateTime));
                        }
                    }
                ],
                tableData: [],
                status: 1,
                // 状态：1.未解除，2.已解除
                statusList: [
                    {
                        value: 1,
                        label: '未解除'
                    },
                    {
                        value: 2,
                        label: '已解除'
                    }
                ],
                pageNum: 1,
                pageSize: 20,
                total: 0, // 总页数
                sizeOpts: [10, 20, 50, 100]
            };
        },
        watch: {
        },
        computed: {
        },
        methods: {
            getListData () {
                let params = {
                    status: this.status,
                    page: this.pageNum
                }
                api.getWarnList(params).then((res) => {
                    if (res.data.isSuc) {
                        this.tableData = res.data.datas.dataList;
                        this.total = res.data.datas.total;
                    }
                });
            },
            doSearch () {
                // 重置页码
                this.pageNum = 1;
                this.total = 0;

                this.getListData();
            },
            dealDate (value) {
                return moment(value).format('YYYY-MM-DD HH:mm:ss');
            },
            changePageNum (pageNum) {
                this.pageNum = pageNum;
                this.getListData();
            }
        },
        created () {
            this.getListData();
        },
        mounted () {
        }
    };
</script>
