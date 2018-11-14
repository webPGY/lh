<style lang="less" scoped>
    @import '../../../styles/common.less';
    @import 'transaction.less';
</style>

<template>
    <div class="content">
        <Row class="et-row">
            <Col>
            <span>请选择状态：</span>
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
        name: 'transaction',
        data () {
            return {
                req_url: axios.defaults.baseURL,
                tableColumns: [
                    {
                        title: '买方币种',
                        align: 'center',
                        key: 'buyCoin'
                    },
                    {
                        title: '卖方币种',
                        align: 'center',
                        key: 'sellCoin'
                    },
                    {
                        title: '档位',
                        key: 'dangs',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '内盘委托单号',
                        align: 'center',
                        key: 'masterOrderId'
                    },
                    {
                        title: '内盘下单数量',
                        align: 'center',
                        key: 'masterAmount'
                    },
                    {
                        title: '内盘买方币资产',
                        align: 'center',
                        key: 'masterBuyCoinAmount'
                    },
                    {
                        title: '内盘实际成交量',
                        align: 'center',
                        key: 'masterCompleteAmount'
                    },
                    {
                        title: '内盘下单价格',
                        align: 'center',
                        key: 'masterPrice'
                    },
                    {
                        title: '内盘卖方币资产',
                        align: 'center',
                        key: 'masterSellCoinAmount'
                    },
                    {
                        // 1.撤单 2.全部成交 3.部分成交
                        title: '内盘交易状态',
                        align: 'center',
                        key: 'masterTradeStatus',
                        render: (h, params) => {
                            return h('span', this.getTradeStatus(params.row.masterTradeStatus));
                        }
                    },
                    {
                        // 交易类型（0.买盘，1.卖盘）
                        title: '内盘交易类型',
                        align: 'center',
                        key: 'masterTradeType',
                        width: 80,
                        render: (h, params) => {
                            return h('span', params.row.masterTradeType == '1' ? '买盘' : '卖盘');
                        }
                    },
                    {
                        title: '外盘委托单号',
                        align: 'center',
                        key: 'outerOrderId'
                    },
                    {
                        title: '外盘下单数量',
                        align: 'center',
                        key: 'outerAmount'
                    },
                    {
                        title: '外盘买方币资产',
                        align: 'center',
                        key: 'outerBuyCoinAmount'
                    },
                    {
                        title: '外盘成交数量',
                        align: 'center',
                        key: 'outerCompleteAmount'
                    },
                    {
                        title: '外盘下单价格',
                        align: 'center',
                        key: 'outerPrice'
                    },
                    {
                        title: '外盘卖方币资产',
                        align: 'center',
                        key: 'outerSellCoinAmount'
                    },
                    {
                        // 外盘交易状态（1.撤单 2.全部成交 3.部分成交）
                        title: '外盘交易状态',
                        align: 'center',
                        key: 'outerTradeStatus',
                        render: (h, params) => {
                            return h('span', this.getTradeStatus(params.row.outerTradeStatus));
                        }
                    },
                    {
                        title: '外盘交易类型',
                        align: 'center',
                        key: 'outerTradeType',
                        width: 80,
                        render: (h, params) => {
                            return h('span', params.row.outerTradeType == '1' ? '买盘' : '卖盘');
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            return h('span', this.getRecordStatus(params.row.status));
                        }
                    },
                    {
                        title: '内盘下单时间',
                        align: 'center',
                        key: 'addTime',
                        render: (h, params) => {
                            return h('span', this.dealDate(params.row.addTime));
                        }
                    }
                ],
                tableData: [],
                status: 5,
                // 状态,1-主盘下单成功，2-主盘下单失败，3-主盘撤单成功，4-主盘交易成功; 5-外盘下单成功，6-外盘下单失败，7-外盘撤单成功, 8-对冲完成
                statusList: [
                    {
                        value: 1,
                        label: '主盘下单成功'
                    },
                    {
                        value: 4,
                        label: '主盘交易成功'
                    },
                    {
                        value: 5,
                        label: '外盘下单成功'
                    },
                    {
                        value: 7,
                        label: '外盘撤单成功'
                    },
                    {
                        value: 8,
                        label: '对冲完成'
                    }
                ],
                // 交易状态（1.撤单 2.全部成交 3.部分成交）
                tradeStatus: [
                    {
                        value: 1,
                        label: '撤单'
                    },
                    {
                        value: 2,
                        label: '全部成交'
                    },
                    {
                        value: 3,
                        label: '部分成交'
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
                api.getRecords(params).then((res) => {
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
            getTradeStatus (status) {
                let statusText = '';
                this.tradeStatus.forEach(item => {
                    if (item.value === status) {
                        statusText = item.label;
                    }
                });
                return statusText;
            },
            getRecordStatus (status) {
                let statusText = '';
                this.statusList.forEach(item => {
                    if (item.value === status) {
                        statusText = item.label;
                    }
                });
                return statusText;
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
