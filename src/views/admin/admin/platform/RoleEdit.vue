<template>
    <div class="list">
        <el-row :gutter="20">
            <h1 class="backTitle"><router-link to="/admin/adminBox/role"><i class="iconfont icon-left"></i>角色管理</router-link></h1>
            <el-form 
                class="mt20"
                label-position="right" 
                label-width="110px"
                v-loading="loading"
                element-loading-text="正在提交!"
                :rules="adminRules"
                ref='roleEdit'
                :model='roleEdit'>
                <el-form-item label="角色名称" prop="title">
                    <el-col :span="14">
                        <el-input placeholder="请输入角色名称" v-model="roleEdit.title"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="角色描述" prop="content">
                    <el-col :span="14">
                        <el-input placeholder="请输入角色描述" v-model="roleEdit.content"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="角色权限" prop="rules">
                    <el-col :span="14">

                    </el-col>
                </el-form-item>
                <el-form-item >
                    <el-col :span="14">
                        <el-button type="primary" @click="submi('roleEdit')">提交</el-button>
                        <el-button @click="$router.push('/admin/adminBox/role')">返回</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>
<script>
  export default {
        created: function () {
            this.getList()
        },
        data() {
            return {
                roleEdit:{},
                adminRules:{
                    username:[{
                        required: true,
                        message : '不能为空',
                        trigger : 'blur'
                    },{
                        pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                        message : '请使用您的邮箱作为登录账号！',
                        trigger : 'blur'
                    }],
                    realname:[{
                        required: true,
                        message : '不能为空',
                        trigger : 'blur'
                    }],
                    country_ids:[{
                        required: true,
                        message : '不能为空',
                    }],
                    group_id:[{
                        required: true,
                        message : '不能为空',
                    }],
                    password  : [{
                        required: true,
                        message : '不能为空！',
                        trigger : 'blur'
                    }
                    // ,{
                    //     pattern : /^[a-zA-Z0-9_-]{6,16}$/,
                    //     message : '密码至少6位,由大小写字母和数字,-,_组成',
                    //     trigger : 'blur'
                    // }
                    ],
                    password_confirm: [{
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请再次输入密码'));
                            } else if (value !== this.roleEdit.password) {
                                callback(new Error('两次输入密码不一致!'));
                            } else {
                                callback();
                            }
                        },
                        trigger  : 'blur'
                    }]
                },
                countryArry:[],
                loading:false,
                checkedCountry:[],
                Grouping:[],
            }
        },
        methods: {
            getList(){
                if(this.$route.query.id){
                    this.$$api_admin_user_admin({
                        data     : {id:this.$route.query.id},
                        fn       : data => {
                            this.roleEdit = data
                            this.checkedCountry = this.roleEdit.country_ids.split(",")
                        },
                        errFn    : (err) => {
                            this.$message.error(err.msg);
                            this.loading=false;
                        },
                        tokenFlag: true
                    });
                }
                this.$$api_admin_countrys({
                    data     : {},
                    fn       : data => {
                        this.countryArry = data
                    },
                    errFn    : (err) => {
                        this.$message.error(err.msg);
                        this.loading=false;
                    },
                    tokenFlag: true
                });
                this.$$api_admin_auth_groups({
                    data     : {},
                    fn       : data => {
                        this.Grouping = data
                    },
                    errFn    : (err) => {
                        this.$message.error(err.msg);
                        this.loading=false;
                    },
                    tokenFlag: true
                });
            },
            handleCheckedCitiesChange(item){
                this.roleEdit.country_ids = item.join(",")
            },
            submi(ref){
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        this.loading=true;
                        if(this.$route.query.id){
                            this.roleEdit.id = this.$route.query.id
                            this.$$api_admin_user_admin_edit({
                                data     : this.roleEdit,
                                fn       : data => {
                                    this.loading=false;
                                    this.$message.success('修改成功！');
                                    // this.$router.push('/admin/adminBox/platform/')
                                },
                                errFn    : (err) => {
                                    this.$message.error(err.msg);
                                    this.loading=false;
                                },
                            });
                        }else{

                            this.$$api_admin_user_admin_add({
                                data     : this.roleEdit,
                                fn       : data => {
                                    this.loading=false;
                                    this.$message.success('添加成功！');
                                    // this.$router.push('/admin/adminBox/platform/')
                                },
                                errFn    : (err) => {
                                    this.$message.error(err.msg);
                                    this.loading=false;
                                },
                            });
                        }
                    }
                })
            }
        },
     
  }
</script>
<style scoped>
    
</style>
