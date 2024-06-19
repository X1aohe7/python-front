<script setup>

import {View} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {computed, onMounted, ref, toRaw} from "vue";
import axios from "axios";
import {ElLoading, ElMessage} from "element-plus";
const router=useRouter()
let user;
const CartDetailList=ref([]);
let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(4)
// let loading=ref(true)
let businessId=ref()
// let totalPrice=ref(0)
const pagedCartDetailList = computed(() => {
  // console.log(shopList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=CartDetailList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});

// 计算总价的计算属性
const totalPrice = computed(() => {
  return CartDetailList.value.reduce((sum, item) => {
    return sum + item.itemPrice * item.quantity;
  }, 0);
});

onMounted(()=>{
  user = JSON.parse(sessionStorage.getItem("user"));
  businessId.value=router.currentRoute.value.query.businessId
  getCartDetailList()
})

function getAvatar(avatar) {
  // console.log(avatar ? avatar : "1")

  return avatar ? avatar : '../../src/assets/img/img_1.png';
}

async function getCartDetailList() {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const customerId = user.userId;
  const response = await axios.get("/customer/getCartListByBusinessId",
      {params: {
          customerId:customerId,
          businessId:businessId.value
      }})
  console.log(response)
  CartDetailList.value = response.data.cartItems
  total.value = response.data.cartItems.length
  // loading.value = false
  loading.close()
}

async function pay() {
  const customerId = user.userId;
  try {
    const response = await  axios.post('/customer/pay', {
      customerId: customerId,
      businessId: businessId.value
    });
    if (response.data.success) {
      // getCartDetailList(); // 重新获取购物车详情
      router.push('/customer/customerOrders')
      // alert('支付成功，订单已创建');
      ElMessage.success('支付成功，订单已创建')
    } else {
      ElMessage.error('支付失败，请稍后再试');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    alert('支付失败，请稍后再试');
  }
}

function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}
</script>

<template>
  <el-table :data="pagedCartDetailList" border stripe v-loading="loading">

    <!--    <el-table-column prop="orderId" label="订单号" width="80">-->
    <!--    </el-table-column>-->
    <el-table-column prop="itemId" label="商品id" >
    </el-table-column>
    <el-table-column label="商品图片">
      <template #default="scope">
        <el-image :src="getAvatar(scope.row.avatar)" fit="cover" style="width: 100px; height: 100px;">
          <template #error>
            <div>
              <img src="../../assets/img/img_1.png" />
            </div>
          </template>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column prop="itemName" label="商品名称" >
    </el-table-column>
    <el-table-column prop="quantity" label="数量" >
    </el-table-column>
    <el-table-column prop="itemPrice" label="单价" >
    </el-table-column>
<!--    <el-table-column label="操作">-->
<!--      <template #default="scope">-->
<!--        <el-button type="success" @click="handleClick(scope.row)"><el-icon style="margin-right: 3px" ><View /></el-icon>  查看</el-button>-->
<!--      </template>-->
<!--    </el-table-column>-->
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
      总价:{{totalPrice}}&#165;
    </div>
    <div class="button" >
<!--      <el-button type="danger" @click="cancel">取消订单</el-button>-->
      <el-button type="primary" @click="pay">支付</el-button>
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
  margin-right: 10px;

}
.flex-container .button{
  margin-top: 50px;
}
</style>