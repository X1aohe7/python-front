<script setup>

import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {ElLoading} from "element-plus";
const shopList=ref([]);
const router=useRouter();
let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(9)
let key=ref("")
const pagedShopList = computed(() => {
  // console.log(shopList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=shopList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});


onMounted(()=>{
  getAllShop();
})
function getAvatar(avatar) {
  return avatar ? avatar : "../../assets/img/img.png";
}
async function getAllShop() {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const response = await axios.get("/customer/getAllShop")
  console.log(response)
  shopList.value = response.data;
  total.value=response.data.length
  loading.close()
}

function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}
function gotoBusinessInfo(shop){
  console.log(shop)
  router.push({
    path: '/customer/businessInfo',
    query: { shopId: shop.userId, shopName:shop.shopName }
  });
}

function search(){
  axios.get("/customer/searchBusiness",{params: {key: key.value}}).then(res=>{
    console.log(res)
    shopList.value = res.data;
  })


}
function clean(){
  getAllShop()
}
</script>

<template>
  <div>
    <el-input style="width: 400px;margin: 10px 5px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="key"></el-input>
    <el-button type="primary" style="margin-left: 5px;" @click="search">搜索 <i
        class="el-icon-search"></i></el-button>
    <el-button type="primary" style="margin-left: 5px;" @click="clean">清除 <i class="el-icon-refresh"></i>
    </el-button>
  </div>

  <el-row style="margin-top: 5px">
  <el-col v-for="shop in pagedShopList" :key="shop.userId" :span="8"
          >
    <div  class="text item">
      <el-card :body-style="{ padding: '0px' }" class="card" @click="gotoBusinessInfo(shop)">
        <el-image
            :src="getAvatar(shop.avatar)"
            class="image"
        >
          <template #error>
            <div>
              <img src="../../assets/img/img.png" class="image"/>
            </div>
          </template>
        </el-image>
        <div style="padding: 14px">
          <span>{{shop.shopName}}</span>
<!--          <div class="bottom">-->

<!--            <el-button text class="button">Operating</el-button>-->
<!--          </div>-->
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
  </div>
</template>

<style scoped>

.card{
  width: 100%;
}
.card .image{
  width: 100px;
  height: 100px;
  padding: 5px;
}


.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  margin-right: 5px;
}



.example-pagination-block{
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>