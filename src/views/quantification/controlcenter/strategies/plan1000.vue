<style lang="less">
    @import '../../../../styles/common.less';
</style>

<template>
    <div class="content">
        <Modal :value="modalStatus" :title="modalTitle" width="1000" @on-cancel="handleReset">
            <Form ref="formItem" class="formbody" :model="formItem" :label-width="160" :rules="ruleValidate">
                <FormItem label="机器人名称" prop="name">
                    <Tooltip class="tooltip" content="创建机器人名称，用于区分不同的运行策略。" placement="right">
                        <Input v-model="formItem.name" placeholder="请输入机器人名称" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="卖方币" prop="sellCoin">
                    <Tooltip class="tooltip" content="选择卖方货币类型，请确保选择的交易平台存在对应的交易货币类型。" placement="right">
                        <Select v-model="formItem.sellCoin" filterable style="width:200px" placeholder="请选择卖方货币类型">
                            <Option v-for="item in $parent.coinsList" :value="item.propTag" :key="item.id">{{ item.propTag }}</Option>
                        </Select>
                    </Tooltip>
                </FormItem>
                <FormItem label="买方币" prop="buyCoin">
                    <Tooltip class="tooltip" content="选择买方货币类型，请确保选择的交易平台存在对应的交易货币类型。" placement="right">
                        <Select v-model="formItem.buyCoin" filterable style="width:200px" placeholder="请选择买方货币类型">
                            <Option v-for="item in $parent.coinsList" :value="item.propTag" :key="item.id">{{ item.propTag }}</Option>
                        </Select>
                    </Tooltip>
                </FormItem>
                <FormItem label="主盘交易账户" prop="masterAccount">
                    <Tooltip class="tooltip" content="选择主盘交易账户" placement="right">
                        <Select v-model="formItem.masterAccount" style="width:200px" placeholder="请选择主盘交易账户">
                            <Option v-for="item in $parent.accountsList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                        </Select>
                    </Tooltip>
                </FormItem>
                <FormItem label="外盘交易账户" prop="outerAccount">
                    <Tooltip class="tooltip" content="选择外盘交易账户" placement="right">
                        <Select v-model="formItem.outerAccount" style="width:200px" placeholder="请选择外盘交易账户">
                            <Option v-for="item in $parent.accountsList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                        </Select>
                    </Tooltip>
                </FormItem>
                <FormItem label="盘口方向" prop="type">
                    <Tooltip class="tooltip" content="选择盘口方向" placement="right">
                        <Select v-model="formItem.type" style="width:200px" placeholder="请选择盘口方向">
                            <Option :value="0">买卖盘</Option>
                            <Option :value="1">买盘</Option>
                            <Option :value="2">卖盘</Option>
                        </Select>
                    </Tooltip>
                </FormItem>
                <FormItem label="开始档位" prop="starts">
                    <Tooltip class="tooltip" content="从哪个档位开始搬盘口。" placement="right">
                        <Input v-model="formItem.starts" number placeholder="请输入开始档位" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="档位数量" prop="counts">
                    <Tooltip class="tooltip" content="一共搬多少个档位。" placement="right">
                        <Input v-model="formItem.counts" number placeholder="请输入档位数量" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="最大档位数" prop="maxStall">
                    <Tooltip class="tooltip" content="平台最大挂单数，超过则停止机器人" placement="right">
                        <Input v-model="formItem.maxStall" number placeholder="请输入最大档位数" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="最大数量" prop="maxAmount">
                    <Tooltip class="tooltip" content="每个档位挂单卖方币数量最大值，超过此设置取此设置值。" placement="right">
                        <Input v-model="formItem.maxAmount" number placeholder="请输入最大数量" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="最小数量" prop="minAmount">
                    <Tooltip class="tooltip" content="每个档位挂单卖方币数量最小值，低于此设置取此设置值。" placement="right">
                        <Input v-model="formItem.minAmount" number placeholder="请输入最小数量" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="买盘委托偏移价格(百分比)" prop="buyOffsetPrice">
                    <Tooltip class="tooltip" content="从参考盘搬过来的每个档位偏移原始价格挂单从而获利，卖盘加，买盘减。例如：0 代表0% ,1代表 1% , 0.1代表 0.1%" placement="right">
                        <Input v-model="formItem.buyOffsetPrice" number placeholder="请输入买盘委托偏移价格" style="width: 350px;"></Input> %
                    </Tooltip>
                </FormItem>
                <FormItem label="卖盘委托偏移价格(百分比)" prop="sellOffsetPrice">
                    <Tooltip class="tooltip" content="从参考盘搬过来的每个档位偏移原始价格挂单从而获利，卖盘加，买盘减。例如：0 代表0% ,1代表 1% , 0.1代表 0.1%" placement="right">
                        <Input v-model="formItem.sellOffsetPrice" number placeholder="请输入卖盘委托偏移价格" style="width: 350px;"></Input> %
                    </Tooltip>
                </FormItem>
                <FormItem label="最小浮动价格(百分比)" prop="floatPrice">
                    <Tooltip class="tooltip" content="每次检测每个档位对应价格，如果超过此设置值，撤单重挂。例如：0 代表0% ,1代表 1% , 0.1代表 0.1%" placement="right">
                        <Input v-model="formItem.floatPrice" number placeholder="请输入最小浮动价格" style="width: 350px;"></Input> %
                    </Tooltip>
                </FormItem>
                <FormItem label="小数位数(价格)" prop="scale">
                    <Tooltip class="tooltip" content="小数位数(价格)" placement="right">
                        <Input v-model="formItem.scale" number placeholder="请输入小数位数(价格)" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="小数位数(数量)" prop="amountScale">
                    <Tooltip class="tooltip" content="小数位数(数量)" placement="right">
                        <Input v-model="formItem.amountScale" number placeholder="请输入小数位数(价格)" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="浮动数量" prop="floatAmount">
                    <Tooltip class="tooltip" content="浮动数量（搬盘时的数量浮动）" placement="right">
                        <Input v-model="formItem.floatAmount" number placeholder="请输入浮动数量" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="检测频率(毫秒)" prop="frequency">
                    <Tooltip class="tooltip" content="多长时间检测行情进行对冲交易，单位毫秒，最小300。" placement="right">
                        <Input v-model="formItem.frequency" number placeholder="请输入检测频率(毫秒)" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="预警手机号" prop="warnPhones">
                    <Tooltip class="tooltip" content="预警手机号，多个用逗号分隔" placement="right">
                        <Input v-model="formItem.warnPhones" placeholder="请输入预警手机号" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="预警邮箱" prop="warnEmails">
                    <Tooltip class="tooltip" content="预警邮箱，多个用逗号分隔" placement="right">
                        <Input v-model="formItem.warnEmails" type="email" placeholder="请输入预警邮箱" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="内盘买方币最小数量预警值" prop="masterBuyCoinMinAmount">
                    <Tooltip class="tooltip" content="内盘买方币最小数量预警值" placement="right">
                        <Input v-model="formItem.masterBuyCoinMinAmount" number placeholder="请输入内盘买方币最小数量预警值" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="内盘卖方币最小数量预警值" prop="masterSellCoinMinAmount">
                    <Tooltip class="tooltip" content="内盘卖方币最小数量预警值" placement="right">
                        <Input v-model="formItem.masterSellCoinMinAmount" number placeholder="请输入内盘卖方币最小数量预警值" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="外盘买方币最小数量预警值" prop="outerBuyCoinMinAmount">
                    <Tooltip class="tooltip" content="外盘买方币最小数量预警值" placement="right">
                        <Input v-model="formItem.outerBuyCoinMinAmount" number placeholder="请输入外盘买方币最小数量预警值" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="外盘卖方币最小数量预警值" prop="outerSellCoinMinAmount">
                    <Tooltip class="tooltip" content="外盘卖方币最小数量预警值" placement="right">
                        <Input v-model="formItem.outerSellCoinMinAmount" number placeholder="请输入外盘卖方币最小数量预警值" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="外盘买入成交失败累计数量预警值" prop="outerOrderBuyCoinWarnAmount">
                    <Tooltip class="tooltip" content="外盘买入成交失败，累计数量预警值" placement="right">
                        <Input v-model="formItem.outerOrderBuyCoinWarnAmount" number placeholder="请输入外盘买入成交失败累计数量预警值" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="外盘卖出成交失败累计数量预警值" prop="outerOrderSellCoinWarnAmount">
                    <Tooltip class="tooltip" content="外盘卖出成交失败，累计数量预警值" placement="right">
                        <Input v-model="formItem.outerOrderSellCoinWarnAmount" number placeholder="请输入外盘卖出成交失败累计数量预警值" style="width: 350px;"></Input>
                    </Tooltip>
                </FormItem>
                <FormItem label="部分成交时规则" prop="partialClosingRules">
                    <Tooltip class="tooltip" content="部分成交时规则" placement="right">
                        <Select v-model="formItem.partialClosingRules" style="width:200px" placeholder="请选择部分成交时规则">
                            <Option :value="1">马上撤单</Option>
                        </Select>
                    </Tooltip>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="handleReset">取消</Button>
                <Button type="primary" size="large" @click="handleSubmit" :loading="loading">{{editType === 0 ? '保存' : '更新参数'}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '@/api/quant'
    import axios from '@/axios/config'

    export default {
        name: 'plan1000',
        props: {
            modalStatus: {
                required: true,
                type: Boolean,
                default: false
            },
            row: {
                required: true,
                type: Object,
                default: {}
            }
        },
        data () {
            return {
                req_url: axios.defaults.baseURL,
                formItem: {
                    id: '',
                    name: '',
                    masterAccount: '',
                    outerAccount: '',
                    buyCoin: '',
                    sellCoin: '',
                    frequency: '',
                    type: '',
                    starts: '',
                    counts: '',
                    maxStall: '',
                    maxAmount: '',
                    minAmount: '',
                    buyOffsetPrice: '',
                    sellOffsetPrice: '',
                    floatPrice: '',
                    scale: '',
                    amountScale: '',
                    floatAmount: '',
                    warnPhones: '',
                    warnEmails: '',
                    masterBuyCoinMinAmount: '',
                    masterSellCoinMinAmount: '',
                    outerBuyCoinMinAmount: '',
                    outerSellCoinMinAmount: '',
                    outerOrderBuyCoinWarnAmount: '',
                    outerOrderSellCoinWarnAmount: '',
                    partialClosingRules: 1
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '请输入机器人名称', trigger: 'blur'}
                    ],
                    sellCoin: [
                        {required: true, message: '请选择卖方货币类型', trigger: 'change'}
                    ],
                    buyCoin: [
                        {required: true, message: '请选择买方货币类型', trigger: 'change'}
                    ],
                    masterAccount: [
                        {required: true, type: 'number', message: '请选择主盘交易账户', trigger: 'change'}
                    ],
                    outerAccount: [
                        {required: true, type: 'number', message: '请选择外盘交易账户', trigger: 'change'}
                    ],
                    type: [
                        {required: true, type: 'number', message: '请选择盘口方向', trigger: 'change'}
                    ],
                    starts: [
                        {required: true, type: 'number', message: '请输入开始档位', trigger: 'change'}
                    ],
                    counts: [
                        {required: true, type: 'number', message: '请输入开始档位', trigger: 'change'}
                    ],
                    maxStall: [
                        {required: true, type: 'number', message: '请输入最大档位数', trigger: 'blur'}
                    ],
                    maxAmount: [
                        {required: true, type: 'number', message: '请输入最大数量', trigger: 'blur'}
                    ],
                    minAmount: [
                        {required: true, type: 'number', message: '请输入最小数量', trigger: 'blur'}
                    ],
                    buyOffsetPrice: [
                        {required: true, type: 'number', message: '请输入买盘委托偏移价格', trigger: 'blur'}
                    ],
                    sellOffsetPrice: [
                        {required: true, type: 'number', message: '请输入卖盘委托偏移价格', trigger: 'blur'}
                    ],
                    floatPrice: [
                        {required: true, type: 'number', message: '请输入最小浮动价格', trigger: 'blur'}
                    ],
                    scale: [
                        {required: true, type: 'number', message: '请输入小数位数(价格)', trigger: 'blur'}
                    ],
                    amountScale: [
                        {required: true, type: 'number', message: '请输入小数位数(价格)', trigger: 'blur'}
                    ],
                    frequency: [
                        {required: true, type: 'number', message: '请输入检测频率(毫秒)', trigger: 'blur'}
                    ],
                    floatAmount: [
                        {required: true, type: 'number', message: '请输入浮动数量', trigger: 'blur'}
                    ],
                    warnPhones: [
                        {required: true, message: '请输入预警手机号', trigger: 'blur'}
                    ],
                    warnEmails: [
                        {required: true, type: 'email', message: '请输入预警邮箱', trigger: 'blur'}
                    ],
                    masterBuyCoinMinAmount: [
                        {required: true, type: 'number', message: '请输入内盘买方币最小数量预警值', trigger: 'blur'}
                    ],
                    masterSellCoinMinAmount: [
                        {required: true, type: 'number', message: '请输入内盘卖方币最小数量预警值', trigger: 'blur'}
                    ],
                    outerBuyCoinMinAmount: [
                        {required: true, type: 'number', message: '请输入外盘买方币最小数量预警值', trigger: 'blur'}
                    ],
                    outerSellCoinMinAmount: [
                        {required: true, type: 'number', message: '请输入外盘卖方币最小数量预警值', trigger: 'blur'}
                    ],
                    outerOrderBuyCoinWarnAmount: [
                        {required: true, type: 'number', message: '请输入外盘买入成交失败累计数量预警值', trigger: 'blur'}
                    ],
                    outerOrderSellCoinWarnAmount: [
                        {required: true, type: 'number', message: '请输入外盘卖出成交失败累计数量预警值', trigger: 'blur'}
                    ],
                    partialClosingRules: [
                        {required: true, type: 'number', message: '请选择部分成交时规则', trigger: 'change'}
                    ]
                },
                loading: false,
                editType: 0 // 编辑类型 0添加 1编辑
            };
        },
        watch: {
            modalStatus (val, oldVal) {
                if (val) {
                    this.setFormItem(this.row);
                }
            }
        },
        computed: {
            modalTitle () {
                return Object.keys(this.row).length > 0 ? '编辑机器人配置' : '添加机器人';
            }
        },
        methods: {
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
                this.$emit('closeModal');
            },
            submitRequest () {
                let params = {
                }
                let obj = Object.assign(params, this.formItem);

                this.loading = true;
                api.saveRobotsConfig(obj).then((res) => {
                    this.loading = false;
                    if (res.data.isSuc) {
                        this.$Message.success('操作成功！');
                        this.handleReset();
                        // 提交成功重新获取
                        this.$parent.getListData();
                    }
                });
            },
            setFormItem (row) {
                if (Object.keys(row).length > 0) {
                    this.editType = 1;

                    Object.keys(this.formItem).forEach((key, index) => {
                        if (row.hasOwnProperty(key)) {
                            this.formItem[key] = row[key];
                        } else if (row.configure.hasOwnProperty(key)) {
                            this.formItem[key] = row.configure[key];
                        }
                    })
                } else {
                    this.editType = 0;
                }
            }
        },
        created () {
        },
        mounted () {
        }
    };
</script>
