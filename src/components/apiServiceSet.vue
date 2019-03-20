<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>接口服务管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px">

      <el-row style="margin-top: 10px">
        <h4 style="display:inline-block;">接口服务管理<span> {{ total }} </span>个</h4>
        <el-row>
          <el-input placeholder="请输入查询名称" v-model="querys.serviceName" style="width:200px;"></el-input>
          <el-button icon="el-icon-search" @click="getApiInfo()" circle></el-button>
        </el-row>
        <el-row style="margin-top: 10px">
    <!--      <el-button type="primary" @click="resetForm()">新增接口</el-button>-->
          <el-button type="primary" @click="addInterface()">新增接口</el-button>
        </el-row>
      </el-row>
      <el-table :data="tableData" border style="width: 100%;margin-top: 15px">
        <!-- v-loading="outLoading" -->
        <el-table-column prop="serviceName" label="接口服务名称">
        </el-table-column>
        <el-table-column prop="serviceUseFirst" label="接口用途">
        </el-table-column>
        <el-table-column prop="serviceUseSecond" label="接口内容">
        </el-table-column>
        <el-table-column prop="serviceUri" label="接口服务地址">
        </el-table-column>
        <el-table-column prop="searchId" label="使用SQL查询">
        </el-table-column>
        <el-table-column prop="callNumber" label="被调用次数">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteContent(scope.row.serviceId)" size="small">删除</el-button>
            <el-button type="text" @click="dialogCopeVisible=true" size="small">复制接口</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination :page-size="10" :current-page.sync="outPageNum" layout="total, prev, pager, next" @current-change="queryUsersMessage('page')" :total="outTotal">
      </el-pagination>

      <!-- 生成接口服务弹出框 -->
      <el-dialog :title="'生成接口服务'" :visible.sync="dialogTableVisible">
        <el-row style="margin-top:-20px;">
          <el-col :span="14">
            <h3 class="inLineBlock">接口服务名</h3>
            <el-input class="EditInput" v-model="inputContent" placeholder="请输入内容"></el-input>
            <h3 class="inLineBlock">接口用途</h3>
            <el-select v-model="selectWay" class="EditInput" placeholder="列表组件">
              <el-option label="列表组件" value="列表组件"></el-option>
              <el-option label="详情组件" value="详情组件"></el-option>
            </el-select>
            <h3 class="inLineBlock">使用SQL查询：</h3>
            <select v-model.lazy="sqlServiceList" class="EditInput" placeholder="sql服务">
              <option v-for="sc in sqlServiceSourceList" v-bind:value="sc.searchId">{{sc.searchName}}</option>
            </select>
          </el-col>
          <el-col :span="10">
            <el-select v-model="selectField" placeholder="字段来源" class="EditInput" style="  margin-left: -20px;margin-top:23%;">
              <el-option label="字段来源" value="字段来源"></el-option>
              <el-option label="数据来源" value="数据来源"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-form>
          <div style="display:flex;justify-content:center;align-items: center;margin-top:5%;">
            <el-button type="primary" :plain="true" @click="ConnectS()" v-loading.fullscreen.lock="submitLoading">生成服务</el-button>
          </div>
        </el-form>
      </el-dialog>

      <!-- 服务接口弹出框 -->
      <el-dialog :title="'服务接口'" :visible.sync="dialogCopeVisible">
        <el-form>
          <div style="display:flex;justify-content:center;align-items: center;margin-top:5%;">
            <h2>该服务接口是</h2>
          </div>
          <div style="display:flex;justify-content:center;align-items: center;">
            <h3>mEFNET/bpm/v1/meta/column/inform</h3>
          </div>
          <div style="display:flex;justify-content:center;align-items: center;margin-top:5%;">
            <el-button type="primary" :plain="true" @click="">一键复制</el-button>
          </div>
        </el-form>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import {  apiServiceList,searchSqlList,apiServiceUpdataOrInsert ,apiServiceDelete} from '../api/api'
import {  isEmpty } from '../util/utils'
import base from './base.vue'
import { IMG_URL } from '../api/url'
export default {
  extends: base,
  data () {
    return {
      sc:{
        searchId:'',
        searchName:''
      },
      total:0,
      serviceId:0,
      selectWay: '',
      selectSearch: '',
      selectField: '',
      tableData: [],
      input23: '',
      inputContent: '',
      serviceId:0,
      serviceName:'',
      serviceUri:'',
      serviceUseFirst:'',
      serviceUseSecond:'',
      sqlServiceList:'',
      sqlServiceSourceList:[],
      querys: {
      },
      dialogTableVisible: false,
      dialogCopeVisible: false,
      submitLoading:false,
      outTotal: 0,
      outPageNum: 1,
      outLoading: false,
      Loading:false,
      innerTotal: 0,
      innerPageNum: 1,
      innerLoading: false,
      innerTableData: [],
      apiInfo:{},
      currentNode: "",
      imgUrl: IMG_URL
    }
  },created: function () {
    let vm = this;
    vm.getSqlList();
  },

  mounted () {
    this.getApiInfo();
  },
  methods: {
    getSqlList (type) {
      var dataCondition = [];
      dataCondition.push({
        "condition": " ses.delete_flag = ",
        "value": "0",
        "singleValue": true
      });
      if (isEmpty(type)) {
        this.pageNum = 1;
      }
      var obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: 100
        },
        param: {
          oredCriteria: [
            {
              criteria: dataCondition
            }
          ],
          orderByClause: " create_time desc "
        }
      }
      var json = JSON.stringify(obj);
      var that = this;
      searchSqlList(json).then((res) => {
        if (res.status == 200) {  //请求成功
          that.sqlServiceSourceList = res.data.list; //table表单插入服务器数据
        } else {
          that.$message.error(res.msg);
        }
      })
    },

    getApiInfo(type){
      this.loading = true;
      var dataCondition = [];
      if (!isEmpty(this.querys.serviceName)) {
        dataCondition.push({
          "condition": " service_name like ",
          "value": "%" + this.querys.serviceName + "%",
          "singleValue": true
        })
      }
      dataCondition.push({
        "condition": " delete_flag = ",
        "value": "0",
        "singleValue": true
      })
      if (isEmpty(type)) {
        this.pageNum = 1;
      }

      var obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: 10
        },
        param: {
          oredCriteria: [
            {
              criteria: dataCondition
            }
          ],
          orderByClause: " service_id  "
        }
      }
      /* 后端数据传入 */
      var json = JSON.stringify(obj);
      var that = this;
      apiServiceList(json).then((res) => {
        that.loading = false;
        if (res.status == 200) {  //请求成功
          that.tableData = res.data.list; //table表单插入服务器数据
          that.total = res.data.total;  //4 table条数
          that.pageNum = res.data.pageNum;  //1 页面数
        } else {
          that.$message.error(res.msg);
        }
      })
    },
    deleteContent(id){
      var that = this;
      var temp = { serviceId: id, deleteFlag: '1' };
      var json = JSON.stringify(temp);
      apiServiceDelete(json).then((res) => {
        if (res.status == 200) {
          that.getApiInfo();
        } else {
          that.$message.error(res.msg);
        }
      })
    },

    ConnectS () {
      debugger;
      var serviceName = this.inputContent;
      var serviceUseFirst = this.selectWay;
      var serviceUseSecond = this.selectField;
      var searchId = this.sqlServiceList;
      if (isEmpty(serviceName) || isEmpty(serviceUseFirst) || isEmpty(serviceUseSecond)|| isEmpty(searchId)) {
        this.$message.error('内容不可为空');
        return false;
      } else {
        this.confirmInfo(1);
      }
    },
    confirmInfo(type){
      var that = this;
      if (this.serviceId > 0) {
        var obj = {
          "serviceName": this.inputContent,
          "serviceUseFirst": this.selectWay,
          "serviceUseSecond": this.selectField,
          "searchId": this.sqlServiceList,
          "serviceId":this.serviceId,
          "serviceUri":this.serviceUri,
          "deleteFlag": 0
        }
      } else {
        var obj = {
          "serviceName": this.inputContent,
          "serviceUseFirst": this.selectWay,
          "serviceUseSecond": this.selectField,
          "searchId": this.sqlServiceList,
          "serviceUri":this.serviceUri,
          "deleteFlag": 0
        }
      }
      var json = JSON.stringify(obj);
      this.submitLoading = true;
      apiServiceUpdataOrInsert(json).then((res) => {
        this.submitLoading = false;
        if(res.status == 200){
          this.resetForm();
          this.dialogTableVisible = false;
          this.getApiInfo();
          this.$message({ message: '保存成功', type: 'success' });
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    resetForm(){
      this.dialogTableVisible=true;
      this.inputContent = '';
      this.selectWay = '';
      this.selectField = '';
      this.sqlServiceList = '';
    },

    addInterface(){
      that.$router.push("/components/dataSourceSet");


    },
    toEdit(obj){
     this.dialogTableVisible=true;
     this.inputContent = obj.serviceName;
     this.selectWay = obj.serviceUseFirst;
     this.selectField = obj.serviceUseSecond;
     this.sqlServiceList = obj.searchId;
     this.serviceId = obj.serviceId;
     this.serviceUri = obj.serviceUri;
    }
    /* 
    连接失败时调用这个函数
    ConnectF () {
      this.$message.error('复制失败，请联系管理员');
    }, */
    /* 当有接口服务使用该数据库数据时调用这个函数
    DeleteSqlA () {
      this.$confirm('删除后不可恢复, 确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
    */
  }
}
</script>

<style scoped>
.inLineBlock {
  width: 25%;
  text-align: right;
  display: inline-block;
}
.EditInput {
  margin-left: 10px;
  width: 65%;
  display: inline-block;
}
</style>
