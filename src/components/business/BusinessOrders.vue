<script setup>
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {View} from "@element-plus/icons-vue";

const router=useRouter()
let user;
const orderList=ref([]);
let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(9)

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
  const businessId=user.userId;
  const response = await axios.get("/business/getOrderList", {params: {businessId}})
  console.log(response)
  orderList.value=response.data
  total.value=response.data.length
}
function mapStatus(status){
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
    path:"/business/orderDetail",
    query:{orderId:row.orderId}
  })
}

</script>

<template>

  <el-table :data="pagedOrderList" border stripe >

    <el-table-column prop="orderId" label="订单号" width="80">
    </el-table-column>
    <el-table-column prop="customerId" label="用户id" width="80">
    </el-table-column>
    <el-table-column prop="customerName" label="用户名称" >
    </el-table-column>
    <el-table-column prop="totalPrice" label="总价">
    </el-table-column>
    <el-table-column prop="businessStatus" label="订单状态">
      <template v-slot="scope">
        {{ mapStatus(scope.row.businessStatus) }}
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