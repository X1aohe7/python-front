<script setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {View} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";

const router=useRouter()
let user;
const orderList=ref([]);
let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(9)
let loading=ref(true)
const pagedOrderList = computed(() => {
  // console.log(shopList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=orderList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});

onMounted(()=>{
  user = JSON.parse(sessionStorage.getItem("user"));
  getAllOrder()
})

async function getAllOrder() {
  const customerId=user.userId;
  const response = await axios.get("/customer/getOrderList", {params: {customerId}})
  console.log(response)
  orderList.value=response.data
  total.value=response.data.length
  loading.value=false
}

function mapStatus(status){
  if(status==0){
    return "未支付"
  }else if (status==1){
      return "已支付"
  }else if (status==2){
    return "已退款"
  }else if(status==3){
    return "已取消"
  }
}
function businessStatus(status){
  // if(status==0){
  //   return "未支付"
  // }else if (status==1){
  //   return "已支付"
  // }else if (status==2){
  //   return "已退款"
  // }else if(status==3){
  //   return "已取消"
  // }
  if(status==0){
    return "未确认"
  }else if (status==1){
    return "已确认"
  }else if (status==2){
    return "已退款"
  }
}

function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}

function handleClick(row){
  // console.log(row)
  router.push({
    path:"/customer/orderDetail",
    query:{orderId:row.orderId,shopName:row.shopName}
  })
}
</script>

<template>
  <el-table :data="pagedOrderList" border stripe v-loading="loading">

    <el-table-column prop="orderId" label="订单号" width="80">
    </el-table-column>
    <el-table-column prop="shopName" label="商户名称" >
    </el-table-column>
    <el-table-column prop="totalPrice" label="总价" >
    </el-table-column>
    <el-table-column prop="customerStatus" label="订单状态">
      <template v-slot="scope">
        {{ mapStatus(scope.row.customerStatus) }}
      </template>
    </el-table-column>
    <el-table-column prop="businessStatus" label="商家状态">
      <template v-slot="scope">
        {{ businessStatus(scope.row.businessStatus) }}
      </template>
    </el-table-column>
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