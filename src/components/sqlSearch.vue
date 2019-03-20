<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>SQL查询管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px">

      <el-row style="margin-top: 10px">
        <h4 style="display:inline-block;">已创建的查询条数<span> {{ total }} </span>个</h4>
        <el-row>
          <el-input placeholder="请输入查询名称" v-model="querys.searchName" style="width:200px;"></el-input>
          <el-button icon="el-icon-search" @click="getSqlinfo" circle></el-button>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-button type="primary" @click="dialogTableVisible=true">新增SQL</el-button>
        </el-row>
      </el-row>

      <el-row style="margin-top: 10px">
      </el-row>
      <el-table :data="tableData" stripe v-loading="loading" style="width: 100%;margin-top: 15px">
        <!-- v-loading="outLoading" -->
        <el-table-column prop="searchName" label="查询名称">
        </el-table-column>
        <el-table-column prop="dataSourceName" label="使用的数据源">
        </el-table-column>
        <el-table-column prop="searchSql" label="SQL语句">
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | formatDate}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteObj(scope.row.searchId)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination :page-size="10" :current-page.sync="pageNum" layout="total, prev, pager, next" @current-change="getSqlinfo('page')" :total="total">
      </el-pagination>

      <!-- 弹出框 -->
      <el-dialog :title="'SQL编辑窗口'" :visible.sync="dialogTableVisible">
        <!-- <el-form :model="info" ref="ruleForm" :rules="rules"> -->
        <el-row :gutter="28" style="margin-top:-20px;">
          <el-col :span="15">
            <h3>查询名称：</h3>
            <el-input v-model="inputContent" placeholder="请输入内容"></el-input>
            <h3>使用数据源：</h3>
            <!-- issue:select、option添加el-前缀才能显示为elment-ui组件效果，但是添加之后下拉框数据因v-bind:vlaue绑定问题无法实现！-->
            <select v-model.lazy="selectedDataSource" placeholder="BPM(java)数据库" style="width:100%; height: auto;">
              <option v-for="sc in dataSoruseList" v-bind:value="sc.dataSourceId">{{sc.dataSourceName}}</option>
            </select>
            <h3>SQL语言：</h3>
            <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 17}" placeholder="请输入SQL语句进行查询，变量拼写请严格参考右侧" v-model="textareaSQL">
            </el-input>
          </el-col>
          <!-- 右侧平铺变量 -->
          <el-scrollbar :span="9" style="height:500px;overflow: auto;">
            <!-- overflow-x: hidden; -->
            <h2>可用变量：</h2>
            <el-col v-for="item in fieldconfigList">
              <h3 style=""> {{item.fieldConfigName}}: [{{item.tableName}}.{{item.fieldConfigCode}}]</h3>
            </el-col>
          </el-scrollbar>
        </el-row>

        <!-- </el-form> -->
        <el-row style="margin-top: 10px">
          <el-button type="danger" @click="submitTest()" v-loading.fullscreen.lock="submitLoading">测试SQL语法</el-button>
          <el-button type="primary" @click="submitInfo()" v-loading.fullscreen.lock="submitLoading" style="margin-left:38%;">确 定</el-button>
        </el-row>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getFieldList, getDataBaseConfigList, searchSqlList, searchSqlUpdate, searchSqldelete } from '../api/api'
import { formatDateTimestamp, isEmpty } from '../util/utils'
import base from './base.vue'
import { IMG_URL } from '../api/url'
export default {
  extends: base,
  data () {
    return {
      total: 0,
      searchId: 0,
      sc: {
        dataSourceId: '',
        dataSourceName: ''
      },

      fieldconfigList: [],
      selectedDataSource: '',
      dataSource: '',
      tableData: [],
      dataSoruseList: [],
      textareaSQL: '',
      input23: '',
      inputContent: '',
      pageNum: 0,
      querys: {
      },
      dialogTableVisible: false,
      outTotal: 0,
      outPageNum: 1,
      outLoading: false,
      innerTotal: 0,
      innerPageNum: 1,
      innerLoading: false,
      innerTableData: [],
      loading: false,
      submitLoading: false,
      currentNode: "",
      imgUrl: IMG_URL
    }
  },
  created: function () {
    let vm = this;
    vm.getDataList();
  },
  watch: {
    selectedDataSource: 'getfields'
  },
  mounted () {
    this.getSqlinfo();
  },
  methods: {
    deleteObj (id) {
      debugger;
      var that = this;
      var temp = {
        searchId: id,
        deleteFlag: '1'
      }
      var json = JSON.stringify(temp);
      searchSqldelete(json).then((res) => {
        if (res.status == 200) {
          that.getSqlinfo();
        } else {
          that.$message.error(res.msg);
        }
      })
    },

    /* queryEmployee实现注册信息推入Table getSqlinfo函数为查询功能实现*/
    getSqlinfo (type) {
      this.loading = true;
      var dataCondition = [];
      if (!isEmpty(this.querys.searchName)) {
        dataCondition.push({
          "condition": " search_name like ",
          "value": "%" + this.querys.searchName + "%",
          "singleValue": true
        })
      }
      dataCondition.push({
        "condition": " ses.delete_flag = ",
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
          orderByClause: " create_time desc "
        }
      }
      /* 后端数据传入 */
      var json = JSON.stringify(obj);
      var that = this;
      searchSqlList(json).then((res) => {
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

    getDataList (type) {
      var dataCondition = [];
      dataCondition.push({
        "condition": " delete_flag = ",
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
      getDataBaseConfigList(json).then((res) => {
        if (res.status == 200) {  //请求成功
          that.dataSoruseList = res.data.list; //table表单插入服务器数据
        } else {
          that.$message.error(res.msg);
        }
      })
    },

    toEdit (obj) {
      // var obj = JSON.parse(JSON.stringify(obj));
      this.dialogTableVisible = true;
      this.searchId = obj.searchId;
      this.inputContent = obj.searchName;
      this.selectedDataSource = obj.dataSourceId;
      this.textareaSQL = obj.searchSql;
      /* console.log(obj.searchName);
       console.log(obj.dataSourceId);
       this.dialogTableVisible = true;*/

    },
    submitInfo () {
      // debugger;
      var that = this;
      var searchName = this.inputContent;
      var searchSql = this.textareaSQL;
      var dataSourceId = this.selectedDataSource;
      // var dataSourceName = this.sc.dataSourceName;
      if (isEmpty(searchName) || isEmpty(searchSql) || isEmpty(dataSourceId)) {
        this.$message.error('SQL编辑内容不可为空');
        return false;
      } else {
        that.confirmInfo(1);
      }
      /*   
      console.log('searchName='+searchName);
           console.log('searchSql='+searchSql);
           console.log('dataSourceId='+dataSourceId);
          */
    },
    confirmInfo (type) {
      var that = this;
      if (this.searchId > 0) {
        var obj = {
          "searchName": this.inputContent,
          "searchSql": this.textareaSQL,
          "dataSourceId": this.selectedDataSource,
          "searchId": this.searchId,
          "deleteFlag": 0
        }
      } else {
        var obj = {
          "searchName": this.inputContent,
          "searchSql": this.textareaSQL,
          "dataSourceId": this.selectedDataSource,
          "deleteFlag": 0
        }
      }
      var json = JSON.stringify(obj);
      this.submitLoading = true;
      searchSqlUpdate(json).then((res) => {
        this.submitLoading = false;
        if (res.status == 200) {
          this.resetForm();
          this.dialogTableVisible = false;
          this.getSqlinfo();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    resetForm () {
      this.dialogTableVisible=true;
      this.selectedDataSource = '';
      this.inputContent = '';
      this.textareaSQL = '';
    },

    getfields (type) {
      var dataCondition = [];
      dataCondition.push({
        "condition": " delete_flag = ",
        "value": "0",
        "singleValue": true
      }),
        dataCondition.push({
          "condition": " data_source_id = ",
          "value": this.selectedDataSource,
          "singleValue": true
        })
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
      getFieldList(json).then((res) => {
        if (res.status == 200) {  //请求成功
          that.fieldconfigList = res.data.list; //table表单插入服务器数据
        } else {
          that.$message.error(res.msg);
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
