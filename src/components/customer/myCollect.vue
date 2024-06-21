<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import {Delete} from "@element-plus/icons-vue";
import { useRouter } from 'vue-router';

const user = JSON.parse(sessionStorage.getItem("user"));
const userId = user.userId;

const pagedShopItemList = ref([]); // 定义响应式数据

function getAvatar(avatar) {
  return avatar ? avatar : "../../assets/img/img_1.png";
}

async function fetchItems(){
  try{
    const response = await axios.get('/customer/myCollect',{
      params: {userId: userId}
    });
    pagedShopItemList.value = response.data;
  }catch(error){
    console.log('error:',error);
  }
}
onMounted(()=>{
  fetchItems();
})

const toggleCollect = async (shopItem) => {
  // const user = JSON.parse(sessionStorage.getItem("user"));
  // const userId = user.userId;
  // console.log(userId)
  try {
    console.log('1'); // 输出信息到控制台
    const request = await axios.post("/customer/collect", {
      itemId: shopItem.itemId,
      userId: userId
    });
    window.location.reload();
  } catch (error) {
    console.error(error); // 输出捕获到的错误对象到控制台
  }
}
</script>

<template>
  <el-row>
    <el-col v-for="shopItem in pagedShopItemList" :key="shopItem.itemId" :span="8"
    >
      <div  class="text item" >
        <el-card :body-style="{ padding: '10px',display:'flex'}" class="card">
          <el-image
              :src="getAvatar(shopItem.avatar)"
              class="image"
          >
            <template #error>
              <div>
                <img src="../../assets/img/img_1.png" class="image"/>
              </div>
            </template>
          </el-image>
          <div style="padding: 14px">
            <div style="font-size: 20px; font-weight: bolder">{{ shopItem.itemName }}</div>
            <div>{{ shopItem.description }}</div>
            <div>&#165;{{ shopItem.price }}</div>
            <div class="delete">
              <el-button type="danger" :icon="Delete" circle @click="toggleCollect(shopItem)"></el-button>
            </div>
          </div>
        </el-card>

      </div>
    </el-col>
  </el-row>
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
.delete{
  margin-left: 250px;
}


</style>