<template>
  <div>
    <el-row>
      <el-col :span="12">
        <ve-line :data="chartData"></ve-line>
      </el-col>
      <el-col :span="12">
        <ve-pie :data="chartData2"></ve-pie>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <ve-histogram :data="chartData3"></ve-histogram>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
      data(){
        this.chartSettings = {
          metrics: ['聊天记录'],
          dataOrder: {
            label: '聊天记录',
            order: 'desc'
          }
        }
        return{
          chartData: {
            columns: ['日期', '注册用户'],
            rows: [
              { '日期': '1/15', '注册用户': 1393},
              { '日期': '1/16', '注册用户': 1500},
              { '日期': '1/17', '注册用户': 1230},
              { '日期': '1/18', '注册用户': 1689},
              { '日期': '1/19', '注册用户': 2500},
              { '日期': '1/20', '注册用户': 500},
              { '日期': '1/21', '注册用户': 200},
              { '日期': '1/22', '注册用户': 800}
            ]
          },
          chartData2: {
            columns: ['性别', '用户数量'],
            rows: [
              { '性别': '男', '用户数量': 1393 },
              { '性别': '女', '用户数量': 1000 }
            ]
          },
          chartData3: {
            columns: ['日期', '调用成功','调用失败'],
            rows: [
              { '日期': '1/18', '调用成功': 1393 ,'调用失败':1000},
              { '日期': '1/19', '调用成功': 3530,'调用失败':324},
              { '日期': '1/20', '调用成功': 2923,'调用失败':654},
              { '日期': '1/21', '调用成功': 1723 ,'调用失败':889},
              { '日期': '1/22', '调用成功': 3792,'调用失败':1500}
            ]
          }
        }
      }
    }
</script>

<style>

</style>
