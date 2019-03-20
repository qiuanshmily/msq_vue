<template>
  <div>
    <!-- 这是数据源配置详情页面 -->
    <!--   <li>Test 后端接口</li>
    <li v-for="item in newsList"> <a :href="item.url" class="new-item">{{ item.title }}</a> </li> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据源配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px">

      <el-row style="margin-top: 10px">
        <h4 style="display:inline-block;">已连接的数据源<span> {{ total }} </span>个</h4>
        <!--  <li  v-for="item in Seller">
        <a :href="item.url" class="new-item">{{ item.title }}</a>
      </li> -->
        <el-row>
          <el-input placeholder="请输入查询名称" v-model="querys.dataSourceName" style="width:200px;"></el-input>
          <el-button icon="el-icon-search" @click="queryEssayinfo" circle></el-button>
        </el-row>
        <el-row style="margin-top: 10px">
        <el-button type="primary" @click="resetForm()">新增数据源</el-button>
        <!-- v-if="hasPerm('essayinfto:edit')" -->
        </el-row>
      </el-row>

      <!-- 这里为table表内容 -->
      <el-table :data="tableData" stripe v-loading="loading" style="width: 100%;margin-top: 15px">
        <el-table-column prop="dataSourceName" label="数据源名称">
        </el-table-column>
        <el-table-column prop="dataSourceType" label="数据库类型">
        </el-table-column>
        <el-table-column prop="dataSourceAddress" label="主机名或ip地址">
        </el-table-column>
        <el-table-column label="端口" prop="dataSourcePort" width="160">
        </el-table-column>
        <el-table-column prop="library" label="数据库名">
        </el-table-column>
        <el-table-column label="用户名" prop="userName" width="160">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="160">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteObj(scope.row.dataSourceId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="数据源配置" :visible.sync="dialogFormVisible">
      <el-form :model="essayinfo" ref="ruleForm" >
        <el-form-item label="数据源名称" :label-width="formLabelWidth" prop="dataSourceName" style="width:90%;">
          <el-input v-model="dataSourceName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据可类型" :label-width="formLabelWidth" prop="dataSourceType">
          <el-select v-model="dataSourceType" placeholder="Oracle" style="width:88%;">
            <el-option label="Oracle" value="Oracle"></el-option>
            <el-option label="MySql" value="MySql"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机名或IP地址" :label-width="formLabelWidth" prop="dataSourceAddress" style="width:90%;">
          <el-input v-model="dataSourceAddress"></el-input>
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth" prop="dataSourcePort" style="width:45%;">
          <el-input v-model="dataSourcePort"></el-input>
        </el-form-item>
        <el-form-item label="数据库名" :label-width="formLabelWidth" prop="library" style="width:45%;">
          <el-input v-model="library"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName" style="width:45%;">
          <el-input v-model="userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="userPwd" style="width:45%;">
          <el-input v-model="userPwd"></el-input>
        </el-form-item>
<!--        <template>
          <el-checkbox v-model="checked" style="margin-left:17%;">保存密码</el-checkbox>
        </template>-->
        <div style="display:flex;justify-content:center;align-items: center;margin-top:5%;">
          <el-button type="primary" :plain="true" @click="ConnectS">连接测试</el-button>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEssayinfo()" v-loading.fullscreen.lock="submitLoading">确 定</el-button>
        <!-- @click="submitEmployee()" -->
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import base from './base.vue'
import { isEmpty } from '../util/utils'
import { getDataBaseConfigList, saveUpdateDataBase,  deleteDataBase } from '../api/api'

export default {
  extends: base,
  /* axios请求数据 20190115 Start */
  /* init () {
    this.$axios.get('api/seller').then(res => {
      debugger;
      alert(1)
      this.Seller = res.data
    }).catch(err => {
      console.log(err)
    })
  }, */
  /* axios请求数据 20190115 End */
  data () {
    return {
      // Seller: [],
      checked: false,
      dialogFormVisible: false,
      tableData: [],
      total: 0,
      loading: false,
      submitLoading: false,
      dataSourceId:0,
      dataSourceName:'',
      dataSourceType:'',
      dataSourceAddress:'',
      dataSourcePort:'',
      userName:'',
      userPwd:'',
      createId:0,
      updateId:0,
      createTime:'',
      updateTime:'',
      library:'',
      querys: {},
      /*rules: {
        dataSourceName: [{ required: true, message: '数据源名称' }],
        dataSourceType: [{ required: true, message: '数据库类型' }],
        dataSourceAddress: [{ required: true, message: '主机名或IP地址' }],
        dataSourcePort: [{ required: true, message: '端口' }],
        userName: [{ required: true, message: '用户名' }],
        userPwd: [{ required: true, message: '密码' }]
      },*/
      essayinfo: {},
      formLabelWidth: '150px'
    }
  },
  mounted () {
    this.queryEssayinfo();
  },
  methods: {
    handleClose (done) {
      this.$confirm('确定关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    //保存
    submitEssayinfo () {
     var dataSourceName = this.dataSourceName;
     var dataSourceType = this.dataSourceType;
     var dataSourceAddress = this.dataSourceAddress;
    var dataSourcePort = this.dataSourcePort;
    var library = this.library;
    var userName = this.userName;
    var userPwd = this.userPwd;
    if(isEmpty(dataSourceName) || isEmpty(dataSourceType) || isEmpty(dataSourceAddress) ||
      isEmpty(dataSourcePort) || isEmpty(userName) ||isEmpty(userPwd) || isEmpty(library)){
        this.$message.error('变量编辑内容不能为空');
        return false;
      }else{
        this.confirmInfo(1);
      }
    },
    confirmInfo (type) {
      var that = this;
      if (this.dataSourceId > 0) {
        if(this.dataSourceType == "MySql"){
          var obj = {
            "dataSourceId":this.dataSourceId,
            "dataSourceName": this.dataSourceName,
            "dataSourceType": this.dataSourceType,
            "dataSourceAddress": this.dataSourceAddress,
            "dataSourcePort": this.dataSourcePort,
            "userName": this.userName,
            "userPwd": this.userPwd,
            "createId":this.createId,
            "updateId":this.updateId,
            "driverClassName":'com.mysql.jdbc.Driver',
            "library":this.library,
            "url":'jdbc:mysql://'+this.dataSourceAddress,
            "deleteFlag":0
          }
        }else{
          var obj = {
            "dataSourceId":this.dataSourceId,
            "dataSourceName": this.dataSourceName,
            "dataSourceType": this.dataSourceType,
            "dataSourceAddress": this.dataSourceAddress,
            "dataSourcePort": this.dataSourcePort,
            "userName": this.userName,
            "userPwd": this.userPwd,
            "createId":this.createId,
            "updateId":this.updateId,
            "driverClassName":'com.orcale.jdbc.Driver',
            "library":this.library,
            "url":'jdbc:orcale://'+this.dataSourceAddress,
            "deleteFlag":0
          }
        }
      } else {
        if(this.dataSourceType == 'MySql') {
          var obj = {
            "dataSourceName": this.dataSourceName,
            "dataSourceType": this.dataSourceType,
            "dataSourceAddress": this.dataSourceAddress,
            "dataSourcePort": this.dataSourcePort,
            "userName": this.userName,
            "userPwd": this.userPwd,
            "createId":this.createId,
            "updateId":this.updateId,
            "driverClassName":'com.mysql.jdbc.Driver',
            "library":this.library,
            "url":'jdbc:mysql://'+this.dataSourceAddress,
            "deleteFlag":0
          }
        }else{
          var obj ={
            "dataSourceName": this.dataSourceName,
            "dataSourceType": this.dataSourceType,
            "dataSourceAddress": this.dataSourceAddress,
            "dataSourcePort": this.dataSourcePort,
            "userName": this.userName,
            "userPwd": this.userPwd,
            "createId":this.createId,
            "updateId":this.updateId,
            "driverClassName":'com.orcale.jdbc.Driver',
            "library":this.library,
            "url":'jdbc:orcale://'+this.dataSourceAddress,
            "deleteFlag":0
          }
        }
      }
      var json = JSON.stringify(obj);
      this.submitLoading = true;
      saveUpdateDataBase(json).then((res) => {
        this.submitLoading = false;
        if (res.status == 200) {
          this.resetForm();
          this.dialogFormVisible = false;
          this.queryEssayinfo();
          this.$message({ message: '保存成功', type: 'success' });
        } else {
          this.$message.error(res.msg);
        }
      })
    },


    queryEssayinfo (type) {
      this.loading = true;
      var dataCondition = [];
      if (!isEmpty(this.querys.dataSourceName)) {
        dataCondition.push({
          "condition": " data_source_name like ",
          "value": "%" + this.querys.dataSourceName + "%",
          "singleValue": true
        })
      }
      if (!isEmpty(this.querys.dataSourceType)) {
        dataCondition.push({
          "condition": " data_source_type like ",
          "value": "%" + this.querys.dataSourceType + "%",
          "singleValue": true
        })
      }
      dataCondition.push({
        "condition": "delete_flag = ",
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
          orderByClause: " data_source_id desc "
        }
      }
      var json = JSON.stringify(obj);
      var that = this;
      getDataBaseConfigList(json).then((res) => {
        that.loading = false;
        if (res.status == 200) {  //请求成功
          that.tableData = res.data.list; //table表单插入服务器数据
          that.total = res.data.total;  //4 table条数
          that.pageNum = res.data.pageNum;  //1 页面数
          // console.log(res.data.pageNum);
        } else {
          that.$message.error(res.msg);
        }
      })
    },
    toEdit (obj) {
      this.dialogFormVisible = true;
      this.dataSourceId = obj.dataSourceId;
      this.dataSourceName = obj.dataSourceName;
      this.dataSourceType = obj.dataSourceType;
      this.dataSourceAddress = obj.dataSourceAddress;
      this.dataSourcePort = obj.dataSourcePort;
      this.library = obj.library
      this.userName = obj.userName;
      this.userPwd = obj.userPwd;
    },
    deleteObj (id) {
      var that = this;
      var temp = { dataSourceId: id, deleteFlag: '1' }
      var json = JSON.stringify(temp);
      deleteDataBase(json).then((res) => {
        if (res.status == 200) {
          that.queryEssayinfo();
        } else {
          that.$message.error(res.msg);
        }
      })
    },
    ConnectS () {
      this.$message({
        message: '连接成功',
        type: 'success'
      });
    },
    resetForm(){
      this.dialogFormVisible = true;
      this.dataSourceId ='';
      this.dataSourceName='';
      this.dataSourceType='';
      this.dataSourceAddress='';
      this.dataSourcePort='';
      this.library ='',
      this.userName='';
      this.userPwd='';
    }
    /* 
    连接失败时调用这个函数
    ConnectF () {
      this.$message.error('连接失败，请重写');
    }, */
  }
}
</script>

<style>
</style>
