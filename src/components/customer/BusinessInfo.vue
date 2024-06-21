<script setup>
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import qs from "qs";
import {ElLoading} from "element-plus";
import {Star} from '@element-plus/icons-vue'


let user;
const router=useRouter()

let localShopName=ref("")
let localShopId=ref(-1);

const shopItemList=ref([]);
const lineItemList=ref([]);
let orderId=ref();
let dialogFormVisible=ref(false)
let commentList=ref([])
let currentPage=ref(1);
let commentPage=ref(1);
let total=ref(0);
let commentTotal=ref(0);
let pageSize=ref(9)

const isCollected=ref(false)
let commentSize=ref(5)


const pagedShopItemList = computed(() => {
  // console.log(shopList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=shopItemList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});


const pagedCommentList = computed(() => {
  // console.log(shopList.value)
  const startIndex = (commentPage.value - 1) * commentSize.value;
  const endIndex = startIndex + commentSize.value;
  let list=commentList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});

const loading = ElLoading.service({
  lock: true,
  text: 'Loading',
  background: 'rgba(0, 0, 0, 0.7)',
})

onMounted(()=>{

  user=JSON.parse(sessionStorage.getItem("user"))
  localShopId.value=router.currentRoute.value.query.shopId
  localShopName.value=router.currentRoute.value.query.shopName
  console.log(localShopId.value)
  getShopItemList();

})

function getCart(){
  axios.get("/customer/getCartListByBusinessId", {
    params: {
      customerId: user.userId,
      businessId: localShopId.value
    }
  })
      .then(response => {
        console.log(response);
        let cartItems = response.data.cartItems;

        // 遍历商品列表，将购物车中的数量匹配到商品列表中
        shopItemList.value.forEach(item => {
          let cartItem = cartItems.find(cartItem => cartItem.itemId === item.itemId);
          item.quantity = cartItem ? cartItem.quantity : 0;  // 如果购物车中有该商品，则匹配数量；否则数量为0
        });

        // 如果需要在 UI 中显示更新后的商品列表，可以在此处更新视图
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
      })
      .finally(()=>{
        loading.close()
      });
}

async function getOrder(){
  const requestData={
    customerId:user.userId,
    businessId:localShopId.value
  }

  const response = await axios.post("/customer/getOrder", qs.stringify(requestData), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  console.log(response.data)
  orderId.value=response.data.orderId
  lineItemList.value=response.data.res

  shopItemList.value.forEach((shopItem) => {
    // 检查每个shopItem是否存在于lineItemList中
    const foundItem = lineItemList.value.find((lineItem) => lineItem.itemId === shopItem.itemId);

    if (foundItem) {
      // 找到匹配项，将quantity赋值给shopItem
      shopItem.quantity = foundItem.quantity;
    } else {
      // 没有找到匹配项，将quantity设为0
      shopItem.quantity = 0;
    }
  });
  console.log(shopItemList.value)
  loading.close()
}

function getShopItemList() {
   axios.get("/customer/getItems", {params: {userId: localShopId.value}})
      .then(response=>{
        console.log(response);
        shopItemList.value=response.data
        total.value=response.data.length
        // getOrder()
        getCart()
      })


}

async function handleChange(shopItem) {
  const requestData={
    // orderId:orderId.value,
    customerId:user.userId,
    businessId:localShopId.value,
    itemId:shopItem.itemId,
    quantity:shopItem.quantity,
    price:shopItem.price
  }
  // console.log(val)
  const response = await axios.post("/customer/changeQuantity", qs.stringify(requestData), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  console.log(response)
}

function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}

function handleCommentChange(newPage){
  // console.log(newPage)
  commentPage.value=newPage
}
function getAvatar(avatar) {
  return avatar ? avatar : "../../assets/img/img_1.png";
}

const goToItemInfo = (shopItem) => {
  router.push({
    path: '/customer/ItemInfo',
    query: {
      itemName: shopItem.itemName,
      description: shopItem.description,
      price: shopItem.price,
      avatar: shopItem.avatar
    }
  });
  console.log('6');
  console.log(shopItem);
};
function getComment(){
  axios.get("/customer/getCommentsByBusinessId", {
    params:{
      businessId:localShopId.value
    }
  }).then(response=>{
    console.log(response)
    commentList.value=response.data.comments
    commentTotal.value=response.data.comments.length
    dialogFormVisible.value=true

  })
}


const toggleCollect = async (shopItem) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user.userId;
  // console.log(userId)
  try {
    console.log('1'); // 输出信息到控制台
    const request = await axios.post("/customer/collect", {
      itemId: shopItem.itemId,
      userId: userId
    });
    isCollected.value = request.data.isCollected;
    console.log(isCollected.value)
  } catch (error) {
    console.error(error); // 输出捕获到的错误对象到控制台
  }
}
</script>

<template>
  <div style="display: flex; background-color: #c0c0c0; justify-content: space-between; align-items: center; padding: 10px;">
    <el-card class="box-card">
      <div>{{localShopName}}</div>
    </el-card>
    <el-button style="margin-left: auto;" @click="getComment()">查看评价</el-button>
  </div>
  <el-row>
    <el-col v-for="shopItem in pagedShopItemList" :key="shopItem.itemId" :span="8"
    >
      <div  class="text item" >
        <el-card :body-style="{ padding: '10px',display:'flex'}" class="card">

          <el-image
              :src="getAvatar(shopItem.avatar)"
              class="image"
              @click="goToItemInfo(shopItem)"
          >
            <template #error>
              <div>
                <img src="../../assets/img/img_1.png" class="image"/>
              </div>
            </template>
          </el-image>
          <div style="padding: 14px">
            <div style="font-size: 20px; font-weight: bolder">{{ shopItem.itemName }}</div>
            <div>{{shopItem.description}}</div>
            <div>&#165;{{shopItem.price}}</div>
            <div class="collect">
              <div>
                <el-input-number v-model="shopItem.quantity" :min="0" :max="9" @change="handleChange(shopItem)" />
              </div>
              <div class="star">
                <el-button type="warning" :icon="Star" circle @click="toggleCollect(shopItem)"></el-button>
              </div>

  <!--            <div class="bottom">-->

  <!--              <el-button text class="button">Operating</el-button>-->
  <!--            </div>-->
<!--              <el-icon-->
<!--                  :style="{ color: isCollected ? 'yellow' : 'gray' }"-->
<!--                  @click="toggleCollect(shopItem)"-->
<!--              >-->
<!--                <Star />-->
<!--              </el-icon>-->

            </div>
          </div>

        </el-card>

      </div>
    </el-col>
  </el-row>
  <div class="example-pagination-block">

    <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"

        @current-change="handleCurrentChange"
    />
<!--    <el-button type="success" style="float: right; ">支付</el-button>-->
  </div>
  <el-dialog title="所有评价" v-model="dialogFormVisible" width="60%">
    <el-table :data="pagedCommentList"  style="width: 100%" border stripe>
      <el-table-column prop="customerId" label="顾客Id" width="180" />
      <el-table-column prop="star" label="星级评价" width="180" >
        <template #default="scope">
          <div class="demo-rate-block">
            <el-rate v-model="scope.row.star" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="文字评价" />
      <el-table-column prop="timestamp" label="评价时间" />
    </el-table>
    <div class="example-pagination-block">

      <el-pagination
          v-model:current-page="commentPage"
          :page-size="commentSize"
          layout="total, prev, pager, next"
          :total="commentTotal"

          @current-change="handleCommentChange"
      />
    </div>
  </el-dialog>
</template>

<style scoped>
.text {
  font-size: 14px;

}

.item {
  padding: 10px 0;
}

.box-card {
  width: 480px;
  margin: 5px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}


.card{
  width: 100%;
}
.card .image{
  width: 100px;
  height: 100px;
}


.text {
  font-size: 14px;
}

.item {
  margin-bottom: 5px;
  margin-right: 5px;
}

.example-pagination-block{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.collect{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.star{
  margin-left: 120px;
}
</style>