<style lang="less">
    @import '../../../styles/common.less';
    @import 'controlcenter.less';
</style>

<template>
    <div class="content">
        <Card class="card-panel">
            <h3 class="table-head">
                <span style="padding-right: 20px;">机器人</span>
                <Button type="success" size="small" style="margin-right: 5px;" @click="operateAllTip(1)">一键开启</Button>
                <Button type="error" size="small"@click="operateAllTip(0)">一键停止</Button>
                <p style="float: right;"><Badge :count="tableDataRobot.length" class-name="badge-style"></Badge></p>
            </h3>
            <Table border :columns="tableColumnsRobot" :data="tableDataRobot"></Table>
        </Card>
        <Card class="card-panel">
            <h3 class="table-head">
                <span style="padding-right: 20px;">机器人策略</span>
                <p style="float: right;"><Badge :count="strategyDatas.length" class-name="badge-style"></Badge></p>
            </h3>
            <div class="strategy-list">
                <p class="str-item-blank" v-if="strategyDatas.length === 0">暂无数据</p>
                <p class="str-item" v-for="item in strategyDatas">
                    <span>{{item.name}}</span>
                    <Button icon="plus" type="success" size="small" class="add-btn" @click="toCreate(item.id)">创建机器人</Button>
                </p>
            </div>
        </Card>
        <Card class="card-panel">
            <h3 class="table-head">
                <Button icon="plus" type="success" size="small" @click="showEditModal(null, 0)">添加API账户</Button>
                <p style="float: right;" v-if="rate"><Badge :count="`汇率：1USD = ${rate}CNY`" class-name="badge-style"></Badge></p>
            </h3>
            <p class="str-item-blank" v-if="accountsList.length === 0" style="border: 1px solid #dddee1;">暂无API账户</p>
            <div class="table-content">
                <table class="balance-table" cellpadding="0" cellspacing="0" border="0" v-if="accountBalance.length > 0">
                    <thead>
                        <tr>
                            <th style="text-align: center" width="100">币种类型</th>
                            <th style="text-align: center" colspan="3" v-for="account in accountBalance">
                                <p class="account-label">{{account.label}}</p>
                                <div>
                                    <Button type="success" size="small" :loading="loadStatus" @click="getAccountBalance">Load</Button>
                                    <Button type="warning" size="small" @click="showEditModal(account, 1)">修改</Button>
                                    <Button type="error" size="small" @click="delAccountTip(account)">删除</Button>
                                </div>
                            </th>
                            <th style="text-align: center" colspan="3">汇总</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="tr-bg">
                            <td></td>
                            <template v-for="account in accountBalance">
                                <td>资产</td>
                                <td>可用</td>
                                <td>冻结</td>
                            </template>
                            <td>总资产</td>
                            <td>总可用</td>
                            <td>总冻结</td>
                        </tr>
                        <tr v-for="coin in accountCoins">
                            <td style="text-align: center">{{coin.toUpperCase()}}</td>
                            <template v-for="account in accountBalance">
                                <td>{{(account.balance.freeMap[coin] || 0) + (account.balance.freezMap[coin] || 0)}}</td>
                                <td>{{account.balance.freeMap[coin] || 0}}</td>
                                <td class="td-warn">{{account.balance.freezMap[coin] || 0}}</td>
                            </template>
                            <td>{{totalBalance.freeMap[coin] + totalBalance.freezMap[coin]}}</td>
                            <td>{{totalBalance.freeMap[coin]}}</td>
                            <td class="td-warn">{{totalBalance.freezMap[coin]}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>
        <Modal v-model="modalStatus" :title="modalTitle" width="800" @on-cancel="handleReset">
            <Form ref="formItem" :model="formItem" :label-width="100" :rules="ruleValidate">
                <FormItem label="交易平台" prop="platformId">
                    <Select v-model="formItem.platformId" style="width: 200px;" placeholder="请选择交易平台">
                        <Option v-for="item in platformList" :value="item.id" :key="item.id">{{ item.cnName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="Access Key" prop="accesskey">
                    <Input v-model="formItem.accesskey" placeholder="请输入Access Key" style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="Secret Key" prop="secretkey">
                    <Input v-model="formItem.secretkey" placeholder="请输入Secret Key" style="width: 300px;"></Input>
                </FormItem>
                <!--<FormItem label="Private Key(火币专用)" prop="privateKey">
                    <Input v-model="formItem.privateKey" placeholder="请输入Private Key" style="width: 300px;"></Input>
                </FormItem>-->
                <FormItem label="userId(itbit专用)" prop="userIdStr">
                    <Input v-model="formItem.userIdStr" placeholder="请输入userIdStr" style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="钱包(itbit专用)" prop="walletId">
                    <Input v-model="formItem.walletId" placeholder="请输入wallet id" style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="货币前缀" prop="prevTag">
                    <Input v-model="formItem.prevTag" placeholder="请输入货币前缀" style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="标签" prop="label">
                    <Input v-model="formItem.label" placeholder="请输入标签" style="width: 300px;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="handleReset">取消</Button>
                <Button type="primary" size="large" @click="handleSubmit">保存</Button>
            </div>
        </Modal>
        <Modal v-model="modalStatusView" :title="modalTitleView" width="1200" @on-cancel="handleResetView" :mask-closable="false">
            <div class="top-info">
                <div class="list-item">
                    <span class="item-l">策略：</span>
                    <div class="list-p">
                        <p>{{getStrategyName(currRobot.storeId)}}
                            <Button icon="edit" type="primary" size="small" @click="editStrategyConfig(currRobot)" style="margin-left: 10px;">更新参数</Button>
                        </p>
                    </div>
                </div>
                <div class="list-item">
                    <span class="item-l">创建于：</span>
                    <div class="list-p">
                        <p>{{dealDate(currRobot.createTime)}}</p>
                    </div>
                </div>
                <div class="list-item">
                    <span class="item-l">最后更新于：</span>
                    <div class="list-p">
                        <p class="red-col">{{dealDate(currRobot.lastTime)}}</p>
                    </div>
                </div>
                <div class="list-item">
                    <span class="item-l">状态：</span>
                    <div class="list-p">
                        <span style="color: #ed3f14;" v-if="currRobot.status === 0">已停止</span>
                        <span style="color: #19be6b;" v-else>已启动</span>
                        <Tooltip class="tooltip" content="重置机器人将清空所有委托信息、日志、图表数据及收益。" placement="right">
                            <Button icon="loop" type="warning" size="small" @click="resetRobotTip(currRobot)" style="margin-left: 5px;">重置机器人</Button>
                        </Tooltip>
                    </div>
                </div>
                <div class="list-item">
                    <span class="item-l">账户：</span>
                    <div class="list-p">
                        <span class="account-master">{{getAccountInfo(currRobot.configure.masterAccount)}}</span>
                        <span class="account-out">{{getAccountInfo(currRobot.configure.outerAccount)}}</span>
                    </div>
                </div>
                <div class="list-item">
                    <span class="item-l">市场：</span>
                    <div class="list-p">
                        <p class="market-name">{{currRobot.configure.sellCoin}} / {{currRobot.configure.buyCoin}}</p>
                    </div>
                </div>
            </div>
            <Card class="card-panel">
                <h3 class="table-head" style="padding-bottom: 0;">
                    <span style="padding-right: 20px;">收益曲线</span>
                    <Button type="warning" size="small" @click="chartStatus = !chartStatus">{{chartStatus ? '隐藏' : '显示'}}</Button>
                </h3>
                <div class="logbody" v-show="chartStatus" style="margin-top: 16px;">
                    <high-charts :options="options" :styles="styles" ref="stockchart"></high-charts>
                </div>
            </Card>
            <Card class="card-panel">
                <h3 class="table-head" style="padding-bottom: 0;">
                    <span style="padding-right: 20px;">资金信息</span>
                    <Button type="warning" size="small" @click="coinsStatus = !coinsStatus">{{coinsStatus ? '隐藏' : '显示'}}</Button>
                </h3>
                <div class="logbody" v-show="coinsStatus" style="margin-top: 16px;">
                    <Table border :columns="tableColumnsCoin" :data="tableDataCoin"></Table>
                </div>
            </Card>
            <Card class="card-panel">
                <h3 class="table-head" style="padding-bottom: 0;">
                    <span style="padding-right: 20px;">日志信息</span>
                    <Button type="warning" size="small" @click="logsStatus = !logsStatus">{{logsStatus ? '隐藏' : '显示'}}</Button>
                    <div class="operate-btn">
                        <Checkbox v-model="autoRefresh">自动刷新日志(3秒)</Checkbox>
                        <Checkbox v-model="incomeOnly">只显示收益</Checkbox>
                        <Button type="error" size="small" style="margin-left: 30px;" @click="clearLogTip">清空日志</Button>
                    </div>
                </h3>
                <div class="logbody" v-show="logsStatus" style="margin-top: 16px;">
                    <Table :columns="tableColumnsLog" :data="tableDataLog" class="logs"></Table>
                    <div style="position: relative;">
                        <Page class="pages" :current="pageNum" :total="total" show-elevator @on-change="changePageNum"></Page>
                    </div>
                </div>
            </Card>
            <div slot="footer">
                <Button type="text" size="large" @click="handleResetView">关闭</Button>
            </div>
        </Modal>
        <!--策略组件-->
        <plan1000 :modal-status="currentStrategyId === 1000" :row="currentStrategy" @closeModal="setCloseModal"></plan1000>
    </div>
</template>

<script>
    import api from '@/api/quant'
    import axios from '@/axios/config'
    import moment from 'moment'
    import HighCharts from './highcharts/HighchartsComponent'

    import plan1000 from './strategies/plan1000'

    export default {
        name: 'controlcenter',
        components: {
            HighCharts,
            plan1000
        },
        data () {
            return {
                req_url: axios.defaults.baseURL,
                tableColumnsRobot: [
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '策略',
                        key: 'storeId',
                        render: (h, params) => {
                            return h('span', this.getStrategyName(params.row.storeId));
                        }
                    },
                    {
                        title: '盈利',
                        key: 'storeIncome'
                    },
                    {
                        title: '创建日期',
                        key: 'createTime',
                        render: (h, params) => {
                            return h('span', this.dealDate(params.row.createTime));
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            if (params.row.status === 0) {
                                return h('span', {
                                    style: {
                                        color: '#ed3f14'
                                    }
                                }, '已停止');
                            } else {
                                return h('span', {
                                    style: {
                                        color: '#19be6b'
                                    }
                                }, '已开启');
                            }
                        }
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    paddingBottom: '5px'
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'eye'
                                    },
                                    style: {
                                        marginTop: '5px',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.viewRobot(params.row);
                                        }
                                    }
                                }, '查看'),
                                params.row.status === 0 ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'trash-a',
                                        loading: this.deleteId === params.row.id
                                    },
                                    style: {
                                        marginTop: '5px',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteTip(params.row);
                                        }
                                    }
                                }, '删除') : '',
                                params.row.status === 0 ? h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small',
                                        icon: 'ios-play',
                                        loading: this.startAndStopId === params.row.id
                                    },
                                    style: {
                                        marginTop: '5px',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.operateTip(params.row, 1);
                                        }
                                    }
                                }, '启动') : '',
                                params.row.status === 1 ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        icon: 'stop',
                                        loading: this.startAndStopId === params.row.id
                                    },
                                    style: {
                                        marginTop: '5px',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.operateTip(params.row, 0);
                                        }
                                    }
                                }, '停止') : ''
                            ]);
                        }
                    }
                ],
                tableDataRobot: [], // 机器人列表
                tableColumnsLog: [
                    {
                        title: '日期',
                        key: 'addTime',
                        width: 150,
                        render: (h, params) => {
                            return h('span', this.dealDate(params.row.addTime));
                        }
                    },
                    {
                        title: '平台',
                        key: 'platform',
                        width: 100
                    },
                    {
                        type: 'html',
                        title: '类型',
                        key: 'type',
                        width: 100
                    },
                    {
                        title: '价格',
                        key: 'price',
                        width: 100
                    },
                    {
                        title: '数量',
                        key: 'amount',
                        width: 100
                    },
                    {
                        title: '信息',
                        key: 'info'
                    }
                ],
                tableDataLog: [], // 日志
                tableColumnsCoin: [
                    {
                        title: '币种名称',
                        key: 'coinName',
                        width: 100
                    },
                    {
                        title: '内盘可用金额',
                        key: 'masterFree',
                        className: 'coin-master'
                    },
                    {
                        title: '内盘冻结金额',
                        key: 'masterFreeze',
                        className: 'coin-master'
                    },
                    {
                        title: '内盘总金额',
                        key: 'masterTotal',
                        className: 'coin-master'
                    },
                    {
                        title: '外盘可用金额',
                        key: 'outerFree',
                        className: 'coin-out'
                    },
                    {
                        title: '外盘冻结金额',
                        key: 'outerFreeze',
                        className: 'coin-out'
                    },
                    {
                        title: '外盘总金额',
                        key: 'outerTotal',
                        className: 'coin-out'
                    },
                    {
                        title: '内外盘总金额',
                        key: 'totalAmount'
                    }
                ],
                tableDataCoin: [], // 资金信息
                strategyDatas: [], // 策略列表
                currentStrategyId: 0, // 当前创建策略id
                currentStrategy: {}, // 当前策略
                coinsList: [], // 币种列表
                accountsList: [], // 用户列表
                modalStatus: false,
                modalStatusView: false,
                modalTitle: '添加',
                modalTitleView: '查看机器人',
                formItem: {
                    id: '',
                    platformId: '',
                    accesskey: '',
                    secretkey: '',
                    // privateKey: '',
                    userIdStr: '',
                    walletId: '',
                    prevTag: '',
                    label: ''
                },
                ruleValidate: {
                    platformId: [
                        {required: true, type: 'number', message: '请选择交易平台', trigger: 'change'}
                    ],
                    accesskey: [
                        {required: true, message: '请输入Access Key', trigger: 'blur'}
                    ],
                    secretkey: [
                        {required: true, message: '请输入Secret Key', trigger: 'blur'}
                    ],
                    // privateKey: [
                    //     {required: false, message: '请输入Private Key', trigger: 'blur'}
                    // ],
                    userIdStr: [
                        {required: false, message: '请输入userIdStr', trigger: 'blur'}
                    ],
                    walletId: [
                        {required: false, message: '请输入wallet id', trigger: 'blur'}
                    ],
                    prevTag: [
                        {required: false, message: '请输入货币前缀', trigger: 'blur'}
                    ],
                    label: [
                        {required: true, message: '请输入标签', trigger: 'blur'}
                    ]
                },
                accountBalance: [],
                totalBalance: {},
                accountCoins: [],
                rate: '', // 汇率
                platformList: [],
                loadStatus: false,
                currRobot: {
                    configure: {}
                },
                logsStatus: true,
                coinsStatus: true,
                chartStatus: true,
                autoRefresh: true,
                incomeOnly: false,
                editType: 0, // 编辑类型 0添加 1编辑
                startAndStopId: 0, // 启停机器人id
                deleteId: 0, // 删除机器人id
                // 定时器
                logsTimeout: null,
                coinsTimeout: null,
                // 日志分页
                pageNum: 1,
                pageSize: 20,
                total: 0, // 总页数
                sizeOpts: [10, 20, 50, 100],
                // stockCharts
                options: {
                    rangeSelector: {
                        // 时间范围按钮数组
                        buttons: [
                            {
                                type: 'minute',
                                count: 1,
                                text: '1m'
                            },
                            {
                                type: 'minute',
                                count: 15,
                                text: '15m'
                            },
                            {
                                type: 'minute',
                                count: 30,
                                text: '30m'
                            },
                            {
                                type: 'hour',
                                count: 1,
                                text: '1h'
                            },
                            {
                                type: 'day',
                                count: 1,
                                text: '1d'
                            }
                        ],
                        selected: 0
                    },
                    title: {
                        // text: '收益图表'
                    },
                    plotOptions: {
                        series: {
                            showInLegend: true
                        }
                    },
                    tooltip: {
                        split: false,
                        shared: true
                    },
                    series: [
                        // {
                        //     type: 'line',
                        //     id: '000001',
                        //     name: 'xx股票',
                        //     data: data
                        // }
                    ]
                },
                styles: {
                    width: 1100,
                    height: 400
                }
            };
        },
        watch: {
            incomeOnly () {
                this.getLogs();
            }
        },
        computed: {
        },
        methods: {
            getChartData () {
                let params = {
                    strategyId: this.currRobot.id
                }
                api.getRewardData(params).then((res) => {
                    if (res.data.isSuc) {
                        let result = [];
                        try {
                            result = JSON.parse(res.data.datas.minutes);
                        } catch (err) {
                            console.log(err)
                        }

                        // console.log(result)
                        let buyData = {
                            id: '000001',
                            name: this.currRobot.configure.buyCoin,
                            data: result.map(item => {
                                return [item[0], item[1]];
                            })
                        }
                        let sellData = {
                            id: '000002',
                            name: this.currRobot.configure.sellCoin,
                            data: result.map(item => {
                                return [item[0], item[2]];
                            })
                        }
                        this.options.series = [buyData, sellData];

                        this.$refs.stockchart.initChart();
                    }
                });
            },
            handleSubmit () {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        this.submitRequest();
                    }
                });
            },
            handleReset () {
                this.formItem.id = '';
                this.$refs.formItem.resetFields();

                this.modalStatus = false;
            },
            submitRequest () {
                let params = {
                }

                let obj = Object.assign(params, this.formItem);

                api.saveAccountInfo(obj).then((res) => {
                    if (res.data.isSuc) {
                        this.$Message.success(this.editType === 0 ? '添加成功' : '编辑成功');
                        this.handleReset();
                        // 提交成功重新获取
                        this.getListData();
                    }
                });
            },
            handleResetView () {
                this.currRobot = {
                    configure: {}
                };
                this.tableDataCoin = [];
                this.tableDataLog = [];
                this.pageNum = 1;
                this.total = 0;

                // 清空定时器
                clearInterval(this.logsTimeout);
                clearInterval(this.coinsTimeout);

                this.modalStatusView = false;
            },
            viewRobot (row) {
                this.modalTitleView = `机器人 - ${row.name}`;
                this.currRobot = row;

                // 获取收益
                this.getChartData();

                // 获取日志
                this.getLogs();
                this.logsTimeout = setInterval(() => {
                    if (this.autoRefresh) {
                        this.getLogs();
                    }
                }, 3000);

                // 获取资金信息
                if (this.currRobot.status === 1) {
                    this.getCoins();
                    this.coinsTimeout = setInterval(() => {
                        this.getCoins();
                    }, 1000);
                }

                this.modalStatusView = true;
            },
            getListData () {
                api.getQuantList().then((res) => {
                    if (res.data.isSuc) {
                        let result = res.data.datas;

                        this.strategyDatas = JSON.parse(result.strategyStoreList);
                        this.tableDataRobot = result.strategyList;
                        this.coinsList = result.coins;
                        this.accountsList = result.accountList;
                        this.rate = result.rate;

                        // 查询账户资金
                        this.getAccountBalance();
                    }
                });
            },
            getAccountBalance () {
                this.loadStatus = true;
                axios.all(this.paramsArr()).then(axios.spread((...arr) => {
                    // console.log(arr)
                    this.loadStatus = false;
                    this.accountBalance = arr.map(item => {
                        return item.data.datas;
                    })
                    // console.log(this.accountBalance)

                    // 所有币种
                    let coinsArr = [];
                    this.accountBalance.forEach((item, index) => {
                        Object.keys(item.balance.freeMap).forEach(element => {
                            if (!coinsArr.includes(element)) {
                                coinsArr.push(element);
                            }
                        });
                    })
                    this.accountCoins = coinsArr;

                    // 总金额
                    let totalObj = {
                        freeMap: {},
                        freezMap: {}
                    };
                    this.accountCoins.forEach(coin => {
                        if (totalObj.freeMap[coin] === undefined) {
                            totalObj.freeMap[coin] = 0;
                            totalObj.freezMap[coin] = 0;
                        }
                        this.accountBalance.forEach((item, index) => {
                            if (item.balance.freeMap[coin] !== undefined) {
                                totalObj.freeMap[coin] += item.balance.freeMap[coin];
                                totalObj.freezMap[coin] += item.balance.freezMap[coin];
                            }
                        })
                    })
                    this.totalBalance = totalObj;
                }))
            },
            paramsArr () {
                return this.accountsList.map(item => {
                    return api.getAccountCoins({
                        id: item.id
                    });
                });
            },
            deleteTip (item) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除 ' + item.name + ' ？',
                    onOk: () => {
                        this.deleteRequest(item);
                    }
                });
            },
            deleteRequest (item) {
                let alias = '';
                this.strategyDatas.forEach((obj, index) => {
                    if (obj.id === item.storeId) {
                        alias = obj.alias;
                    }
                });

                let params = {
                    id: item.id,
                    alias: alias
                }
                this.deleteId = item.id;
                api.deleteRobot(params).then((res) => {
                    this.deleteId = 0;
                    if (res.data.isSuc) {
                        this.$Message.success('删除成功');
                        // 提交成功重新获取
                        this.getListData();
                    }
                });
            },
            operateTip (item, type) {
                this.$Modal.confirm({
                    title: '提示',
                    content: type === 1 ? `确认启动 ${item.name} ？` : `确认停止 ${item.name} ？`,
                    onOk: () => {
                        this.operateRequest(item);
                    }
                });
            },
            operateRequest (item) {
                let alias = '';
                this.strategyDatas.forEach((obj, index) => {
                    if (obj.id === item.storeId) {
                        alias = obj.alias;
                    }
                });

                let params = {
                    id: item.id,
                    alias: alias
                }
                this.startAndStopId = item.id;
                api.startUpRobot(params).then((res) => {
                    this.startAndStopId = 0;
                    if (res.data.isSuc) {
                        this.$Message.success('操作成功！');
                        // 提交成功重新获取
                        this.getListData();
                    }
                });
            },
            operateAllTip (type) {
                this.$Modal.confirm({
                    title: '提示',
                    content: type === 1 ? '确认启动所有机器人？' : '确认停止所有机器人？',
                    onOk: () => {
                        this.operateAllRequest(type);
                    }
                });
            },
            operateAllRequest (type) {
                if (type === 1) {
                    api.startUpAllRobot().then((res) => {
                        if (res.data.isSuc) {
                            this.$Message.success('启动成功！');
                            // 提交成功重新获取
                            this.getListData();
                        }
                    });
                } else {
                    api.stopAllRobot().then((res) => {
                        if (res.data.isSuc) {
                            this.$Message.success('停止成功！');
                            // 提交成功重新获取
                            this.getListData();
                        }
                    });
                }

            },
            showEditModal (currRow, type) {
                this.editType = type;
                if (type == 0) {
                    this.modalTitle = '添加-API账户';

                    // 添加
                    this.setFormItem();
                } else if (type == 1) {
                    this.modalTitle = '编辑-API账户';

                    // 赋值表单
                    this.setFormItem(currRow);
                }

                this.getPlatforms();

                this.modalStatus = true;
            },
            setFormItem (row) {
                if (row) {
                    this.formItem.id = row.id;
                    this.formItem.platformId = row.platformId;
                    this.formItem.accesskey = row.accesskey;
                    this.formItem.secretkey = row.secretkey;
                    this.formItem.userIdStr = row.userIdStr;
                    this.formItem.walletId = row.walletId;
                    this.formItem.prevTag = row.prevTag;
                    this.formItem.label = row.label;
                }
            },
            getStrategyName (id) {
                let res = '-';
                this.strategyDatas.forEach((item, index) => {
                    if (item.id === id) {
                        res = item.name;
                    }
                });
                return res;
            },
            toCreate (id) {
                this.currentStrategyId = id;
            },
            setCloseModal () {
                this.currentStrategyId = 0;
                // 清空prop
                this.currentStrategy = {};
            },
            editStrategyConfig (row) {
                this.currentStrategyId = row.storeId;

                this.currentStrategy = row;
            },
            delAccountTip (item) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除 ' + item.label + ' ？',
                    onOk: () => {
                        this.delAccount(item.id);
                    }
                });
            },
            delAccount (id) {
                let params = {
                    id: id
                }
                api.deleteAccount(params).then((res) => {
                    if (res.data.isSuc) {
                        // 重新拉取数据
                        this.getListData();
                    }
                });
            },
            resetRobotTip (item) {
                this.$Modal.confirm({
                    title: 'Warning',
                    content: 'Reset this robot will clear all of the records, logs, charts, and profits, are you sure to do it ?',
                    okText: 'Ok',
                    cancelText: 'Cancel',
                    onOk: () => {
                        this.resetRobot(item);
                    }
                });
            },
            resetRobot (item) {
                let alias = '';
                this.strategyDatas.forEach((obj, index) => {
                    if (obj.id === item.storeId) {
                        alias = obj.alias;
                    }
                });

                let params = {
                    id: item.id,
                    alias: alias
                }
                api.resetRobotById(params).then((res) => {
                    if (res.data.isSuc) {
                        this.$Message.success('重置成功！');
                    }
                });
            },
            // 获取平台列表
            getPlatforms () {
                api.getPlatformList().then((res) => {
                    if (res.data.isSuc) {
                        this.platformList = JSON.parse(res.data.datas.platforms);
                    }
                });
            },
            getAccountInfo (id) {
                let str = '';
                this.accountsList.forEach(item => {
                    if (item.id === id) {
                        str = item.platform + ' - ' + item.label;
                    }
                });
                return str;
            },
            dealDate (value) {
                return moment(value).format('YYYY-MM-DD HH:mm:ss');
            },
            getLogs () {
                let params = {
                    id: this.currRobot.id,
                    page: this.pageNum,
                    type: this.incomeOnly ? 'income' : ''
                }
                api.getLogInfos(params).then((res) => {
                    if (res.data.isSuc) {
                        this.tableDataLog = res.data.datas.dataList;
                        this.total = res.data.datas.total;
                    }
                });
            },
            getCoins () {
                let alias = '';
                this.strategyDatas.forEach((obj, index) => {
                    if (obj.id === this.currRobot.storeId) {
                        alias = obj.alias;
                    }
                });

                let params = {
                    id: this.currRobot.id,
                    alias: alias
                }
                api.getCoinsStatus(params).then((res) => {
                    if (res.data.isSuc) {
                        let result = res.data.datas;

                        // 处理数据
                        let buyCoinObj = {};
                        buyCoinObj.coinName = result.buyCoin;
                        buyCoinObj.masterFree = result.masterBuyCoin;
                        buyCoinObj.masterFreeze = result.masterBuyCoinFreeze;
                        buyCoinObj.masterTotal = buyCoinObj.masterFree + buyCoinObj.masterFreeze;
                        buyCoinObj.outerFree = result.outerBuyCoin;
                        buyCoinObj.outerFreeze = result.outerBuyCoinFreeze;
                        buyCoinObj.outerTotal = buyCoinObj.outerFree + buyCoinObj.outerFreeze;
                        buyCoinObj.totalAmount = buyCoinObj.masterTotal + buyCoinObj.outerTotal;

                        let sellCoinObj = {};
                        sellCoinObj.coinName = result.sellCoin;
                        sellCoinObj.masterFree = result.masterSellCoin;
                        sellCoinObj.masterFreeze = result.masterSellCoinFreeze;
                        sellCoinObj.masterTotal = sellCoinObj.masterFree + sellCoinObj.masterFreeze;
                        sellCoinObj.outerFree = result.outerSellCoin;
                        sellCoinObj.outerFreeze = result.outerSellCoinFreeze;
                        sellCoinObj.outerTotal = sellCoinObj.outerFree + sellCoinObj.outerFreeze;
                        sellCoinObj.totalAmount = sellCoinObj.masterTotal + sellCoinObj.outerTotal;

                        this.tableDataCoin = [buyCoinObj, sellCoinObj];
                    }
                });
            },
            clearLogTip () {
                this.$Modal.confirm({
                    title: '提示',
                    content: '你确定要清除所有日志吗？',
                    onOk: () => {
                        this.clearLogHandle();
                    }
                });
            },
            clearLogHandle () {
                let params = {
                    id: this.currRobot.id
                }
                api.clearLogs(params).then((res) => {
                    if (res.data.isSuc) {
                        this.getLogs();
                    }
                });
            },
            // 分页相关
            changePageNum (pageNum) {
                this.pageNum = pageNum;
                this.getLogs();
            }
        },
        created () {
            this.getListData();
        },
        mounted () {
        }
    };
</script>
