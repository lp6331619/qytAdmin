<template>
    <div class="edit">
        <el-row :gutter="20">
            <h1 class="backTitle"><a @click="back()"><i class="iconfont icon-left"></i>票务</a></h1>
            <el-form
                label-position="right"
                label-width="110px"
                v-loading="loading"
                element-loading-text="正在提交!"
                class="mt20"
                :rules="productRule"
                ref='productData'
                :model='productData'>
                <el-col :span="7">
                    <el-form-item
                        prop="departure"
                        label="出发站">
                        <el-select class="w220" v-model="productData.departure" placeholder="出发站">
                            <el-option
                              v-for="(item,index) in stationBox"
                              :key="index"
                              :label="item.name_cn"
                              :value="item.name_cn">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        prop="arrival"
                        label="到达站">
                        <el-select class="w220" v-model="productData.arrival" placeholder="到达站">
                            <el-option
                              v-for="(item,index) in stationBox"
                              :key="index"
                              :label="item.name_cn"
                              :value="item.name_cn">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        label="车型信息">
                        <el-input v-model="productData.bus_type" placeholder="请输入车型信息"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="clear" :span="7">
                    <el-form-item
                        prop="depart_time"
                        label="出发时间">
                        <el-input v-model="productData.depart_time" placeholder="请输入出发时间"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        prop="arrive_time"
                        label="到达时间">
                           <el-input v-model="productData.arrive_time" placeholder="选择到达时间"></el-input>
                        </el-time-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        prop="days"
                        label="行程天数">
                        <el-select class="w220" v-model="productData.days" placeholder="行程天数">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.value"
                              :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        label="车次">
                        <el-input class="w220" placeholder="请输入车次" v-model="productData.train_num">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        prop="t_shop_id"
                        label="产品来源">
                        <el-select class="w220" v-model="productData.t_shop_id" placeholder="产品来源">
                            <el-option
                              v-for="item in ticket_shops"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        prop="is_license"
                        label="签证照片">
                        <el-radio-group v-model="productData.is_license">
                            <el-radio label="0">不需要</el-radio>
                            <el-radio label="1">需要</el-radio>
                        </el-radio-group>
                    </el-form-item> 
                </el-col>
                <el-col class="clear" :span="7">
                    <el-form-item
                        prop="price"
                        label="结算价格">
                        <el-input class="w220" v-model="productData.price" placeholder="请输入价格">
                            <template slot="append">{{productData.currency}}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item
                        prop="price"
                        label="货币">
                        <el-select class="w220" v-model="productData.currency" placeholder="请选择货币">
                            <el-option
                              v-for="(item,index) in countrys"
                              :key="item.id"
                              :label="item.currency"
                              :value="item.currency">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label-width="10px">
                        <el-checkbox v-model="productData.is_children" true-label="1" false-label="0">儿童价</el-checkbox>
                        <el-checkbox v-model="productData.is_rate" true-label="1" false-label="0">返佣率</el-checkbox>
                       <!--  <el-checkbox v-model="productData.is_rate" true-label="1" false-label="0">返佣率</el-checkbox> -->
                    </el-form-item>
                </el-col>
                <el-col class="clear" :span="7" v-if="productData.is_children==1">
                    <el-form-item
                        prop="children_price"
                        label="儿童价格">
                        <el-input class="w220" placeholder="请输入儿童价格" v-model="productData.children_price">
                            <template slot="append">{{productData.currency}}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" v-if="productData.is_children==1" >
                    <el-form-item
                        class="fl"
                        label-width="50px"
                        prop="children_age_start"
                        label="大于">
                        <el-input type="number" v-model="productData.children_age_start" style="width:100px;" placeholder="如：2">
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        class="fl"
                        label-width="50px"
                        prop="children_age_end"
                        label="小于">
                          <el-input type="number" v-model="productData.children_age_end" style="width:100px;" placeholder="如：10" >
                          </el-input>
                          周岁为儿童
                    </el-form-item>
                </el-col>
                <el-col class="clear" :span="7" v-if="productData.is_rate==1">
                    <el-form-item
                        prop="rate"
                        label="返佣率">
                        <el-input class="w220" placeholder="请输入返佣率" v-model="productData.rate">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col class="clear" :span="24" >
                <el-form-item
                    required
                    class="repelate"
                    label='产品规格'>
                    <!-- <div class="sku-group">
                      <div class="sku-sub-group">
                          <div class="sku-group-cont">
                            <div class="sku-atom-list">
                                <ul>
                                    <li v-for="(item,index) in productData.spec" :key="index">
                                        <div class="itemBox">
                                            <el-input :disabled="item.status==0 || !item.status" size="mini" type="text" class="inline" placeholder="请输入规格" v-model="item.name">
                                                <template slot="append">
                                                    <el-button @click="Determination(item)" size="mini" class="" v-if="item.status && item.status==1">确定</el-button>
                                                    <el-button @click="Cancellation(item)" size="mini" class="" v-if="item.status && item.status==1">取消</el-button></template>
                                            </el-input>
                                            <el-button v-if="item.status==0 || !item.status" @click="edit(item)" size="mini" class="itemBtn" icon="el-icon-edit"></el-button>
                                            <el-button v-if="item.status==0 || !item.status" @click="delet(index)" type="danger" size="mini" class="itemBtn right" icon="el-icon-delete"></el-button>
                                        </div>
                                    </li>
                                    <li><el-button size="mini" icon="el-icon-plus" @click="addSpecification()">添加</el-button></li>
                                </ul>
                            </div>
                          </div>
                      </div>
                    </div> -->
                    <el-button class="addSpec" type="primary" plain size="mini" icon="el-icon-plus" @click="addSpecification()">添加</el-button>
                    <el-table
                      :data="productData.spec"
                      height="300"
                      border
                      style="width:100%">
                      <el-table-column
                          prop="name"
                          label="规格名称"
                          align="left">
                          <template slot-scope="scope">
                            <el-input :disabled="scope.row.status==0 || !scope.row.status" v-model="scope.row.name"  placeholder="规格名称">
                            </el-input>
                          </template>
                      </el-table-column>
                      <el-table-column
                          prop="price"
                          label="成人价格"
                          align="center"
                          width="150">
                          <template slot-scope="scope">
                            <el-input :disabled="scope.row.status==0 || !scope.row.status" type="number" v-model="scope.row.price"  placeholder="成人价格">
                            </el-input>
                          </template>
                      </el-table-column>
                      <el-table-column
                          prop="children_price"
                          label="小孩价格"
                          align="center"
                          width="150">
                          <template slot-scope="scope">
                            <el-input :disabled="scope.row.status==0 || !scope.row.status" type="number" v-model="scope.row.children_price"  placeholder="儿童价格">
                            </el-input>
                          </template>
                      </el-table-column>
                      <el-table-column
                          label="操作"
                          width="140"
                          align="center">
                          <template slot-scope="scope">
                              <el-button-group>
                                  <el-button
                                    size="mini"
                                    type="primary"
                                    v-if="scope.row.status==0 || !scope.row.status"
                                    plain
                                    @click="handleEdit(scope.row)">编辑
                                  </el-button>
                                  <el-button
                                  size="mini"
                                  type="primary"
                                  v-if="scope.row.status && scope.row.status==1"
                                  plain
                                  @click="handleOk(scope.row)">保存
                                  </el-button>
                                  <el-button
                                    size="mini"
                                    type="danger"
                                    plain
                                    @click="handleDel(scope.row)">
                                    删除
                                  </el-button>
                              </el-button-group>
                          </template>
                      </el-table-column>
                    </el-table>
                </el-form-item>
                </el-col>
                <el-col class="clear" :span="7">
                    <el-form-item
                        prop="refund_rule_id"
                        label="退款规则">
                        <el-select class="w220" v-model="productData.refund_rule_id" placeholder="请选择退款规则">
                            <el-option
                              v-for="item in refund_rule"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                      prop="change_rule_id"
                      label="改签规则">
                      <el-select class="w220" v-model="productData.change_rule_id" placeholder="请选择改签规则">
                          <el-option
                            v-for="item in change_rule"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="clear" :span="24" >
                <el-form-item
                    class="clear"
                    required
                    label='淡旺季'>
                    <el-switch
                        v-model="productData.is_holiday"
                        active-color="#13ce66"
                        inactive-color="#d2d2d2"
                        active-value="1"
                        inactive-value="0">
                    </el-switch>
                </el-form-item>
                </el-col>
                <el-col class="clear" :span="24" >
                <el-form-item required>
                    <div class="sku-group" v-if="productData.is_holiday==1">
                        <div class="sku-sub-group" v-for="(item,index) in productData.holiday_rules">
                          <h3 class="sku-group-title">
                            <div class="select-class">
                                <el-date-picker
                                    size="mini"
                                    v-model="item.start_date"
                                    type="date"
                                    value-format="yyyy.mm.dd"
                                    placeholder="选择日期">
                                </el-date-picker>
                                至
                                <el-date-picker
                                    size="mini"
                                    v-model="item.end_date"
                                    type="date"
                                    value-format="yyyy.mm.dd"
                                    placeholder="选择日期">
                                </el-date-picker>
                              <label>上浮比例：</label>
                               <el-input size="mini" class="inline" type="text" v-model="item.rate"></el-input>&nbsp;%
                            </div>
                            <span class="remove-group" @click="delHoliday(index)">×</span>
                          </h3>
                        </div>
                        <div class="sku-sub-group">
                          <h3 class="sku-group-title">
                            <div class="select-class">
                                <el-button size="mini" @click="addRuse()">添加一条规则</el-button>
                            </div>
                          </h3>
                        </div>
                    </div>
                </el-form-item>
                </el-col>
                <el-col class="clear" :span="24" >
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="submit('productData')">
                      提交
                    </el-button>
                  </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </div>
</template>
<script>
    import EditTicketJs from './EditTicket.js';
    export default EditTicketJs;
</script>
<style scoped lang='less'>
</style>
