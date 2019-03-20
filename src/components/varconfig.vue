<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>变量配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px">

      <el-row style="margin-top: 10px">
        <h4 style="display:inline-block;">变量配置<span> {{ total }} </span>个</h4>

        <el-row>
          <el-input placeholder="通过接口服务名称查询" v-model="querys.fieldConfigName" style="width:200px;"></el-input>
          <el-button icon="el-icon-search" @click="getSqlinfo" circle></el-button>
        </el-row>
        
        <el-row style="margin-top: 10px">
          <el-button type="primary" @click="addVariable()">新增变量</el-button>
        </el-row>

      </el-row>
   
      <el-table :data="tableData" v-loading="loading" border style="width: 100%;margin-top: 15px">
        <el-table-column prop="fieldConfigName" label="变量名称">
        </el-table-column>
        <el-table-column prop="fieldConfigCode" label="变量">
        </el-table-column>
        <el-table-column prop="tableName" label="表名">
        </el-table-column>
        <el-table-column prop="dataSourceId" label="数据源ID">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="createId" label="创建人">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row)">编辑</el-button>
            <!-- click="toEdit(scope.row,1)" v-if="hasPerm('employee:edit')" -->
            <el-button type="text" @click="deleteObj(scope.row.fieldConfigId)" size="small">删除</el-button>
            <!-- @click="DeleteSql" -->
          </template>
        </el-table-column>

      </el-table>
      <el-pagination :page-size="10" :current-page.sync="pageNum" layout="total, prev, pager, next" @current-change="getSqlinfo('page')" :total="total">
      </el-pagination>

      <!-- 生成接口服务弹出框 -->
      <el-dialog :title="'变量配置'" :visible.sync="dialogTableVisible">
        <el-row style="margin-top:-20px;">
          <el-col :span="14">
            <h3 class="inLineBlock">变量名称</h3>
            <el-input v-model="inputName" class="EditInput" placeholder="请输入变量名称"></el-input>
            <h3 class="inLineBlock">变量</h3>
            <el-input v-model="inputVar" class="EditInput" placeholder="请输入变量"></el-input>
            <h3 class="inLineBlock">表名</h3>
            <el-input v-model="inputTableName" class="EditInput" placeholder="请输入表名"></el-input>
            <h3 class="inLineBlock">数据源ID</h3>
            <el-input v-model="inputSourceID" class="EditInput" placeholder="请输入数字格式"></el-input>
          </el-col>
          <el-col :span="10">
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="SaveS()" v-loading.fullscreen.lock="submitLoading">保存</el-button>
          <el-button @click="SaveFail()">重置</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getUserMessage, getDataBaseConfigList, getUserList, getMessage, varConfigUpdate, varConfigFile, varConfigdelete } from '../api/api'
import { formatDateTimestamp, isEmpty } from '../util/utils'
import base from './base.vue'
import { IMG_URL } from '../api/url'
export default {
  extends: base,
  data () {
    return {
      pageNum: 0,
      fieldConfigId: 0,
      fieldConfigName: '',
      selectDtable: '',
      selectVariable: '',
      selectField: '',
      tableData: [],
      sc: {
        dataSourceId: '',
        dataSourceName: ''
        // fieldConfigCode:'',
      },
      textareaSQL: '',
      input23: '',
      inputName: '',
      inputVar: '',
      inputSourceID: '',
      inputTableName: '',
      querys: {
      },
      dialogTableVisible: false,
      total: 0,
      outLoading: false,
      innerTotal: 0,
      innerPageNum: 1,
      innerLoading: false,
      innerTableData: [],
      submitLoading: false,
      currentNode: "",
      imgUrl: IMG_URL,
      loading: false
    }
  },
  created: function () {
    let vm = this;
    vm.getDataList();
  },
  mounted () {
    this.getSqlinfo();
  },

  methods: {
    /* 删除功能 */
    deleteObj (id) {
      var that = this;
      var temp = { fieldConfigId: id, deleteFlag: '1' }
      var json = JSON.stringify(temp);
      varConfigdelete(json).then((res) => {
        if (res.status == 200) {
          that.getSqlinfo();
        } else {
          that.$message.error(res.msg);
        }
      })
    },

    /* 信息推入Table、查询功能 */
    getSqlinfo (type) {
      this.loading = true;
      var dataCondition = [];
      // fieldConfigName
      if (!isEmpty(this.querys.fieldConfigName)) {
        dataCondition.push({
          "condition": " field_config_name like ",  //用于搜索查询
          "value": "%" + this.querys.fieldConfigName + "%",//数据库进行模糊查询
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

      var obj = { //obj对象里面的这些格式根据后端的json来变动
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
          orderByClause: " table_name desc "  //orderByClause为后端自定义哪个标识来排序
        }
      }
      var json = JSON.stringify(obj);
      var that = this;
      varConfigFile(json).then((res) => {
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

    toEdit (obj) {
      this.dialogTableVisible = true;
      this.fieldConfigId = obj.fieldConfigId;
      this.inputName = obj.fieldConfigName;
      this.inputVar = obj.fieldConfigCode;
      this.inputTableName = obj.tableName;
      this.inputSourceID = obj.dataSourceId;
    },

    addVariable () {
      this.dialogTableVisible = true,
        this.resetForm()
    },

    resetForm () {
      this.inputName = '',
      this.inputVar = '',
      this.inputTableName = '',
      this.inputSourceID = '',
      this.fieldConfigId=''
    },

    DeleteSql () {
      this.$confirm('该服务已被平台调用X次,删除后应用无法继续使用,确定删除?', '提示提示', {
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
    },
    SaveS () {
      var fieldConfigName = this.inputName;
      var fieldConfigCode = this.inputVar;
      var tableName = this.inputTableName;
      var dataSourceId = this.inputSourceID;
      if (isEmpty(fieldConfigName) || isEmpty(fieldConfigCode) || isEmpty(tableName) || isEmpty(dataSourceId)) {
        this.$message.error('变量编辑内容不能为空');
        return false;
      } else {
        this.confirmInfo(1);
      }
    },
    confirmInfo (type) {
      //alert(1);
      // debugger;
      var that = this;
      if (this.fieldConfigId > 0) {
        var obj = {
          "fieldConfigName": this.inputName,
          "fieldConfigCode": this.inputVar,
          "tableName": this.inputTableName,
          "dataSourceId": this.inputSourceID,
          "fieldConfigId": this.fieldConfigId,
          "deleteFlag": 0
        }
      } else {
        var obj = {
          "fieldConfigName": this.inputName,
          "fieldConfigCode": this.inputVar,
          "tableName": this.inputTableName,
          "dataSourceId": this.inputSourceID,
          "deleteFlag": 0
        }
      }
      var json = JSON.stringify(obj);
      this.submitLoading = true;
      varConfigUpdate(json).then((res) => {
        this.submitLoading = false;
         if (res.status == 200) {
          this.resetForm();
          this.dialogTableVisible = false;
          this.getSqlinfo();
           this.$message({ message: '保存成功', type: 'success' });
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    SaveFail () {
      this.$message({
        message: '重置成功',
        type: 'success'
      });
      this.fieldConfigName = "",
        this.selectDtable = "",
        this.selectVariable = ""
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
      varConfigFile(json).then((res) => {
        if (res.status == 200) {  //请求成功
          that.dataSoruseList = res.data.list; //table表单插入服务器数据
        } else {
          that.$message.error(res.msg);
        }
      })
    },
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
