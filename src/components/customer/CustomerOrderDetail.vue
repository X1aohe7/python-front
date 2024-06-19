<script setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {View} from "@element-plus/icons-vue";
import qs from "qs";
import {useRouter} from "vue-router";
import {ElLoading, ElMessage} from "element-plus";

const router=useRouter()

let user;
const lineItemList=ref([]);
const localOrderId=ref()
const localShopName=ref("")
const order=ref({})
const customerStatus=ref()
const loading = ElLoading.service({
  lock: true,
  text: 'Loading',
  background: 'rgba(0, 0, 0, 0.7)',
})
let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(9)

const pagedLineItemList = computed(() => {
  // console.log(shopList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=lineItemList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});

const ok = () => {
  ElMessage({
    message: '操作成功!',
    type: 'success',
  })
}

const error = () => {
  ElMessage({
    message: '操纵失败!',
    type: 'error',
  })
}

onMounted(()=>{
  user = JSON.parse(sessionStorage.getItem("user"));
  localOrderId.value=router.currentRoute.value.query.orderId
  localShopName.value=router.currentRoute.value.query.shopName
  // console.log(localOrderId.value)
  getLineItemList()
  // loading.close()
})

function getLineItemList() {
  const requestData={
    orderId:localOrderId.value
  }

  axios.get("/customer/getOrderDetail", {params:{orderId:localOrderId.value}})
  .then((response)=>{
    console.log(response)
    order.value=response.data.order
    lineItemList.value=response.data.orderDetail
    total.value=response.data.orderDetail.length
    customerStatus.value=order.value.customerStatus
    loading.close()


  })

}



function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}

async function cancel() {
  const requestData={
    orderId:order.value.orderId
  }

  await axios.post("/customer/cancel", qs.stringify(requestData), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res=>{
    console.log(res)
    ok();
    router.push("/customer/customerOrders")
  }).catch(err=>{
    error()
    console.log(err)
  })

}

async function pay() {

  const requestData={
    orderId:order.value.orderId
  }


  await axios.post("/customer/pay", qs.stringify(requestData), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res=>{
    console.log(res)
    ok();
    router.push("/customer/customerOrders")
  }).catch(err=>{
    error()
    console.log(err)
  })
}
</script>

<template>
  <el-card>{{localShopName}}</el-card>
  <el-table :data="pagedLineItemList" border stripe >

    <el-table-column prop="itemId" label="商品id" width="120">
    </el-table-column>
    <el-table-column prop="itemName" label="商品名" >
    </el-table-column>
    <el-table-column prop="price" label="价格" >
    </el-table-column>
    <el-table-column prop="quantity" label="数量" >
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
  <div class="flex-container">
    <div class="price">
      总价:{{order.totalPrice}}&#165;
    </div>
<!--    <div class="button" v-if="customerStatus==0">-->
<!--      <el-button type="danger" @click="cancel">取消订单</el-button>-->
<!--      <el-button type="primary" @click="pay">支付</el-button>-->
<!--    </div>-->
  </div>
</template>

<style scoped>
.example-pagination-block{
  display: flex;
  justify-content: center;
}

 .flex-container{
  float: right;
  margin-top: 30px;
  margin-right: 10px;
}
.flex-container .price{
  float: right;
  color: red;
  font-weight: bold;
  letter-spacing: 0.1em;
}
 .flex-container .button{
  margin-top: 50px;
}
</style>