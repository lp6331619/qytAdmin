export default {
    name: 'list',
    created: function() {
        this.getCountry()
        this.getList()
    },
    data() {
        return {
            loading: false,
            tableData: [],
            pageShow: false,

            selectData: { //搜索条件
                country: this.$route.query.country,
                status: this.$route.query.status ? parseInt(this.$route.query.status) : 1,
                page: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
                keyword: this.$route.query.keyword
            },
            country: [],
            stateArry: [{
                value: 0,
                label: '禁用'
            }, {
                value: 1,
                label: '正常'
            }],
            formData: {}, //修改密码表单
            dialogFormVisible: false, //弹框控制
            formRules: {
                new_pwd: [{
                        required: true,
                        message: '不能为空！',
                        trigger: 'blur'
                    }
                    // ,{
                    //     pattern : /^[a-zA-Z0-9_-]{6,16}$/,
                    //     message : '密码至少6位,由大小写字母和数字,-,_组成',
                    //     trigger : 'blur'
                    // }
                ],
                confirm_pwd: [{
                    required: true,
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请再次输入密码'));
                        } else if (value !== this.formData.new_pwd) {
                            callback(new Error('两次输入密码不一致!'));
                        } else {
                            callback();
                        }
                    },
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        getCountry() { //获取国家
            this.$$api_admin_countrys({
                data: {},
                fn: data => {
                    this.country = data
                },
                errFn: (err) => {
                    this.$message.error(err.msg);
                },
            });
        },
        getList() { //获取列表数据
            this.loading = true;
            this.$$api_admin_user_admins({
                data: this.$route.query,
                fn: data => {
                    this.loading = false;
                    this.tableData = data
                    this.tableData.total = parseInt(this.tableData.total)
                    if (this.tableData.total > 20) {
                        this.pageShow = true
                    }
                },
                errFn: (err) => {
                    this.$message.error(err.msg);
                    this.loading = false;
                },
                tokenFlag: true
            });
        },
        onSelectData() { //搜索
            this.selectData.page = 1;
            this.$router.push({
                path: '/admin/adminBox/platform/',
                query: this.selectData
            })
            this.getList()
        },
        handleCurrentChange(item) { //分页
            this.selectData.page = item
            this.$router.push({
                path: '/admin/adminBox/platform/',
                query: this.selectData
            })
            this.getList()
        },
        formatterStatus(item) {
            return item.status == 1 ? '正常' : '禁用'
        },
        formatterCountry(item) { //国家格式化
            let text = '';
            item.country_ids.split(",").forEach((itemBox) => {
                this.country.forEach((itemCountry) => {
                    if (itemCountry.id == itemBox) {
                        text += itemCountry.name + ','
                    }
                })
            })
            return text
        },
        handleEdit(item) { //编辑
            this.$router.push(`/admin/adminBox/adminEdit?id=${item.id}`)
        },
        handleBeing(item, index) { //禁用
            let text = '';
            let statusBox = 0;
            if (item.status == 1) {
                text = "禁用"
                statusBox = 0
            } else {
                text = "启用"
                statusBox = 1
            }

            this.$confirm(`是否确定${text}该管理员?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$$api_admin_user_admin_change_status({
                    data: { id: item.id, status: statusBox },
                    fn: data => {
                        this.loading = false;
                        this.tableData.admins[index].status = statusBox;
                        this.$message.success(`${text}成功！`);
                    },
                    errFn: (err) => {
                        this.$message.error(err.msg);
                        this.loading = false;
                    },
                    tokenFlag: true
                });
            }).catch(() => {});
        },
        handlePassword(item) { //重置密码
            this.formData = Object.assign({}, this.formData, {
                id: item.id,
                new_pwd: '',
                confirm_pwd: ''
            })
            this.dialogFormVisible = true
        },
        passwordReset(ref) { //重置密码
            this.$refs[ref].validate((valid) => {
                if (valid) {
                    this.$$api_admin_user_admin_change_pwd({
                        data: this[ref],
                        fn: data => {
                            this.loading = false;
                            this.$message.success('修改成功！');
                            this.dialogFormVisible = false;
                        },
                        errFn: (err) => {
                            this.$message.error(err.msg);
                            this.loading = false;
                        },
                        tokenFlag: true
                    });
                }
            })
        },
        handleDelete(index, item) { //删除
            this.$confirm('是否确定删除该管理员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$$api_admin_user_admin_del({
                    data: { id: item.id },
                    fn: data => {
                        this.loading = false;
                        this.tableData.admins.splice(index, 1)
                        this.$message.success('删除成功！');
                    },
                    errFn: (err) => {
                        this.$message.error(err.msg);
                        this.loading = false;
                    },
                    tokenFlag: true
                });
            }).catch(() => {});
        },
    },
}