<script setup>
import {
  Document,
  Menu as IconMenu,
  Avatar,
  ShoppingCart,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const router=useRouter();
const path=router.currentRoute.value.path
</script>

<template>
  <el-row class="tac">

    <el-col  class="col">

      <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          :default-active="path"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
          router
      >
        <div style="padding:  20px ;display: flex;justify-content: center;align-items: center">
          <img style="width: 20px;height: 20px;margin-right: 5px" src="../../assets/vue.svg">
          <text style="color: white">电子商超系统</text>
        </div>
        <el-menu-item  index="/customer/businessList">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>店铺列表</span>
          </template>
        </el-menu-item>

        <el-menu-item  index="/customer/cart">
          <el-icon><ShoppingCart /></el-icon>
          <span>购物车</span>
        </el-menu-item>

        <el-menu-item  index="/customer/customerOrders">
          <el-icon><document /></el-icon>
          <span>订单</span>
        </el-menu-item>

        <el-sub-menu index="1">
          <template #title>
            <el-icon><Avatar /></el-icon>
            <span slot="title">账户管理</span>
          </template>
          <!--我创建的-->
          <el-menu-item index="/customer/customerInfo">
            <i class="el-icon-view"></i>
            <span slot="title">个人信息</span>
          </el-menu-item>
          <!--我参与的-->
          <el-menu-item index="/customer/editPassword">
            <i class="el-icon-edit"></i>
            <span slot="title">修改密码</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item  index="/customer/AiTalk">
          <el-icon><document /></el-icon>
          <span>Ai咨询</span>
        </el-menu-item>

      </el-menu>

    </el-col>
  </el-row>
</template>

<style scoped>
.tac{
  min-height: 100vh;
  margin-right: 10px;
}
.tac .col{
  min-height: 100vh;
  width: 200px;
}
.tac .col .el-menu-vertical-demo{
  min-height: 100vh;
  width: 100%;
}
</style>

