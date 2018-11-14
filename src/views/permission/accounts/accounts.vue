<style lang="less" scoped>
    @import '../../../styles/common.less';
    @import 'accounts.less';
</style>

<template>
    <div class="content">
        <Row class="et-row">
            <Col>
                <Button type="info" size="small" class="add_account" icon="plus-round" @click="showEditModal(null, 0)">添加用户</Button>
            </Col>
        </Row>
        <Table border :columns="tableColumns" :data="tableData"></Table>
        <div style="position: relative;">
            <Page class="pages" :current="pageNum" :total="total" show-elevator @on-change="changePageNum"></Page>
        </div>
        <Modal v-model="modalStatus" :title="modalTitle" width="500" @on-cancel="handleReset">
            <Form ref="formItem" :model="formItem" :label-width="110" :rules="ruleValidate">
                <FormItem label="用户名" prop="userName">
                    <Input v-model="formItem.userName" placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input type="password" v-model="formItem.password" autocomplete="off" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="confirmPassword">
                    <Input type="password" v-model="formItem.confirmPassword" autocomplete="off" placeholder="请再次输入密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="handleReset">取消</Button>
                <Button type="primary" size="large" @click="handleSubmit">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '@/api/permission'
    import axios from '@/axios/config'


    export default {
        name: 'accounts',
        data () {
            const validatorPwd = (rule, value, callback) => {
                if (value === '') {
                    callback();
                } else {
                    if (!(this.formItem.confirmPassword === this.formItem.password)) {
                        callback(new Error('两次输入密码不一致'));
                    }
                    callback();
                }
            };
            return {
                req_url: axios.defaults.baseURL,
                tableColumns: [
                    {
                        title: '用户Id',
                        key: 'id'
                    },
                    {
                        title: '用户名',
                        key: 'userName'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return h('span', params.row.status == '1' ? '正常' : (params.row.status == '2' ? '已删除' : '已冻结'));
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
                                params.row.status === 1 ? h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginTop: '5px',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showEditModal(params.row, 1);
                                        }
                                    }
                                }, '修改') : '',
                                params.row.status === 1 ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginTop: '5px',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteTip(params.row, 2);
                                        }
                                    }
                                }, '删除') : '',
                                params.row.status === 1 ? h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginTop: '5px',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.freezTip(params.row, 0);
                                        }
                                    }
                                }, '冻结') : '',
                                params.row.status === 2 ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginTop: '5px',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.revertTip(params.row, 1);
                                        }
                                    }
                                }, '还原') : '',
                                params.row.status === 0 ? h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginTop: '5px',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.unfreezTip(params.row, 1);
                                        }
                                    }
                                }, '解冻') : ''
                            ]);
                        }
                    }
                ],
                tableData: [],
                modalStatus: false,
                modalTitle: '添加',
                formItem: {
                    id: '',
                    userName: '',
                    password: ''
                },
                ruleValidate: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {validator: validatorPwd, trigger: 'blur'}
                    ]
                },
                editType: 0, // 编辑类型 0添加 1编辑
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

                api.addEditUsers(obj).then((res) => {
                    if (res.data.isSuc) {
                        this.$Message.success('保存成功');
                        this.handleReset();
                        // 提交成功重新获取
                        this.getListData();
                    }
                });
            },
            getListData () {
                let params = {
                    page: this.pageNum
                }
                api.getUsers(params).then((res) => {
                    if (res.data.isSuc) {
                        this.tableData = res.data.datas.dataList;
                        this.total = res.data.datas.total;
                    }
                });
            },
            deleteTip (item, status) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除用户 ' + item.userName + ' ？',
                    onOk: () => {
                        this.editUserStatus(item.id, status);
                    }
                });
            },
            revertTip (item, status) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认还原用户 ' + item.userName + ' ？',
                    onOk: () => {
                        this.editUserStatus(item.id, status);
                    }
                });
            },
            freezTip (item, status) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认冻结用户 ' + item.userName + ' ？',
                    onOk: () => {
                        this.editUserStatus(item.id, status);
                    }
                });
            },
            unfreezTip (item, status) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认解冻用户 ' + item.userName + ' ？',
                    onOk: () => {
                        this.editUserStatus(item.id, status);
                    }
                });
            },
            editUserStatus (id, status) {
                let params = {
                    id: id,
                    status: status
                }
                api.editAccountStatus(params).then((res) => {
                    if (res.data.isSuc) {
                        this.$Message.success('操作成功！');
                        // 提交成功重新获取
                        this.getListData();
                    }
                });
            },
            showEditModal (currRow, type) {
                this.editType = type;
                if (type == 0) {
                    this.modalTitle = '添加用户';
                } else if (type == 1) {
                    this.modalTitle = '编辑用户';

                    // 赋值表单
                    this.setFormItem(currRow);
                }
                this.modalStatus = true;
            },
            setFormItem (row) {
                if (row) {
                    this.formItem.id = row.id;
                    this.formItem.userName = row.userName;
                }
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
