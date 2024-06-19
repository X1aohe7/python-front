<script setup>

import {View} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
const router=useRouter()
let user;
const CartList=ref([]);
let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(9)
let loading=ref(true)
const pagedCartList = computed(() => {
  // console.log(shopList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=CartList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});

onMounted(()=>{
  user = JSON.parse(sessionStorage.getItem("user"));
  getCartList()
})

async function getCartList() {
  const customerId = user.userId;
  const response = await axios.get("/customer/getCartList", {params: {customerId}})
  console.log(response)
  CartList.value = response.data
  total.value = response.data.length
  loading.value = false
}

function handleClick(row){
  // console.log(row)
  router.push({
    path:"/customer/cartDetail",
    query:{businessId:row.businessId,businessName:row.businessName}
  })
}

function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}
</script>

<template>
  <el-table :data="pagedCartList" border stripe v-loading="loading">

<!--    <el-table-column prop="orderId" label="订单号" width="80">-->
<!--    </el-table-column>-->
    <el-table-column prop="businessId" label="商家id" >
    </el-table-column>
    <el-table-column prop="businessName" label="商家名称" >
    </el-table-column>
    <el-table-column prop="cartItems.length" label="总数" >
    </el-table-column>
<!--    <el-table-column prop="customerStatus" label="订单状态">-->
<!--      <template v-slot="scope">-->
<!--        {{ mapStatus(scope.row.customerStatus) }}-->
<!--      </template>-->
<!--    </el-table-column>-->
<!--    <el-table-column prop="businessStatus" label="商家状态">-->
<!--      <template v-slot="scope">-->
<!--        {{ businessStatus(scope.row.businessStatus) }}-->
<!--      </template>-->
<!--    </el-table-column>-->
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="success" @click="handleClick(scope.row)"><el-icon style="margin-right: 3px" ><View /></el-icon>  查看</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="padding: 10px 30px">
    <div class="example-pagination-block">

      <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>


<style scoped>
.example-pagination-block{
  display: flex;
  justify-content: center;
}
</style>