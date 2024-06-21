<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import {View} from "@element-plus/icons-vue";
import qs from "qs";
import {useRouter} from "vue-router";
import {ElLoading, ElMessage} from "element-plus";

const router=useRouter()

let user;
const lineItemList=ref([]);
const localOrderId=ref()
const businessId=ref()
const localShopName=ref("")
const order=ref({})
const customerStatus=ref()

let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(9)
let dialogFormVisible=ref(false)
let commentVisible=ref(false)
let form=ref({})
let commentForm=ref({})
let formRef=ref()

const rules = reactive({
  star: [{ required: true, message: '请输入星级', trigger: 'blur' }],
  description: [{ required: true, message: '请输入评价', trigger: 'blur' }],


});

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
  businessId.value=router.currentRoute.value.query.businessId
  // console.log(localOrderId.value)
  getLineItemList()
  // loading.close()
})

function getLineItemList() {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
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

function comment(){
  dialogFormVisible.value=true
}
function commented(){
  axios.get("/customer/getCommentByOrderId", {
    params:{
      orderId:localOrderId.value
    }
  }).then(response=>{
    commentForm.value.star=response.data.comment.star
    commentForm.value.description=response.data.comment.description
    commentForm.value.timestamp=response.data.comment.timestamp
    commentVisible.value=true

  })



}

async function saveComment(fr) {
  form.value.customerId = user.userId
  form.value.businessId=businessId.value
  form.value.orderId=localOrderId.value
  console.log(form.value)


  if (!fr) return
  await fr.validate(async (valid) => {
    console.log(valid, 666)
    if (valid) {
      const response = await axios.post("/customer/comment", qs.stringify(form.value), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      console.log(response)
      dialogFormVisible.value = false
      getLineItemList()
      form.value = {}
      ElMessage.success('评价成功');
    } else {
      ElMessage.error('请填写完整的表单信息');
    }
  });
  // dialogFormVisible.value = false
  // form.value = {}
}
function lookComment(){

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
    <div class="button" v-if="order.businessStatus==1">
      <el-button v-if="order.customerStatus==1" type="primary" @click="comment">评价</el-button>
      <el-button v-if="order.customerStatus==4" type="primary" @click="commented">查看评价</el-button>
    </div>
  </div>

  <el-dialog title="评价" v-model="dialogFormVisible" width="30%">
    <el-form label-width="130px"  :model="form" :rules="rules" ref="formRef">


      <el-form-item label="星级评价(1-5)" prop="star">
<!--        <el-input v-model="form.star" autocomplete="off"></el-input>-->
        <div class="demo-rate-block">
<!--          <span class="demonstration">Default</span>-->
          <el-rate v-model="form.star" />
        </div>
      </el-form-item>
      <el-form-item label="文字描述" prop="description">
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>


    </el-form>
    <template #footer>
      <span class="dialog-footer">
<!--        <el-button @click="dialogFormVisible = false">Cancel</el-button>-->
        <el-button type="primary" @click="saveComment(formRef)">
          评价
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog title="查看评价" v-model="commentVisible" width="30%">
    <el-form label-width="130px"  :model="commentForm" :rules="rules" >


      <el-form-item label="星级评价(1-5)" prop="star">
        <!--        <el-input v-model="form.star" autocomplete="off"></el-input>-->
        <div class="demo-rate-block">
          <!--          <span class="demonstration">Default</span>-->
          <el-rate v-model="commentForm.star" disabled />
        </div>
      </el-form-item>
      <el-form-item label="文字描述" prop="description">
        <el-input disabled v-model="commentForm.description" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="timestamp">
        <el-input disabled v-model="commentForm.timestamp" autocomplete="off"></el-input>
      </el-form-item>


    </el-form>

  </el-dialog>
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