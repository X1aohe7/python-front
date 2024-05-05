<script setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import qs from "qs";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const router=useRouter()

let user;
const lineItemList=ref([]);
const localOrderId=ref()
const localShopName=ref("")
const order=ref({})
const businessStatus=ref()

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
    message: '操作失败!',
    type: 'error',
  })
}

onMounted(()=>{
  user = JSON.parse(sessionStorage.getItem("user"));
  localOrderId.value=router.currentRoute.value.query.orderId
  getLineItemList()
})

async function getLineItemList() {
  const requestData={
    orderId:localOrderId.value
  }

  const response = await axios.get("/business/getOrderDetail", {params:{orderId:localOrderId.value}})
  // console.log(response)
  order.value=response.data
  // console.log(order.value)
  localShopName.value=order.value.shop.shopName
  lineItemList.value=response.data.lineItemList
  total.value=response.data.lineItemList.length
  businessStatus.value=order.value.businessStatus
}



function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}

async function refund() {
  const requestData={
    orderId:order.value.id
  }

  await axios.post("/business/refund", qs.stringify(requestData), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res=>{
    console.log(res)
    ok();
    router.push("/manage/businessOrders")
  }).catch(err=>{
    error()
    console.log(err)
  })

}

async function confirm() {

  const requestData={
    orderId:order.value.id
  }


  await axios.post("/business/confirm", qs.stringify(requestData), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res=>{
    console.log(res)
    ok();
    router.push("/manage/businessOrders")
  }).catch(err=>{
    error()
    console.log(err)
  })
}
</script>

<template>
  <el-card>{{localShopName}}</el-card>
  <el-table :data="pagedLineItemList" border stripe >

    <el-table-column prop="item.id" label="商品id" width="80">
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
    <div class="button" v-if="businessStatus==0">
      <el-button type="danger" @click="refund">退款</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </div>
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