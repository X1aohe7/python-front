<!--//没用-->
<script setup>

</script>

<template>
  <div class="wrapper" >
    <div class="area">
      <el-card>xxx旗舰店</el-card>
      <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"  @selection-change="handleSelectionChange">>

        <el-table-column prop="id" label="订单号" width="250">
        </el-table-column>
        <el-table-column prop="username" label="商品图片" width="250">
        </el-table-column>
        <el-table-column prop="nickname" label="商品名称" width="250">
        </el-table-column>
        <el-table-column prop="email" label="数量" width="250">
        </el-table-column>
        <el-table-column prop="phone" label="总价" width="250">
        </el-table-column>
      </el-table>
      <div class="flex-container">
        <div class="price">
          总价:xxx&#165;
        </div>
        <div class="button">
          <el-button type="danger">取消订单</el-button>
          <el-button type="primary">支付</el-button>
        </div>
      </div>


    </div>
  </div>
</template>

<style scoped>
.wrapper{
  height: 90%;
  display:flex;
  justify-content: center;
  align-items: center;

  background-color: #c0c0c0;
}
.wrapper .area{

  //width: 80%;
  height: 80%;
  background-color: white;
  //display: flex;
  padding: 10px;
}
.wrapper .area .flex-container{
  float: right;
  margin-top: 30px;
  margin-right: 10px;
}
.wrapper .area .flex-container .price{
  float: right;
  color: red;
  font-weight: bold;
  letter-spacing: 0.1em;
}
.wrapper .area .flex-container .button{
  margin-top: 50px;
}
</style>