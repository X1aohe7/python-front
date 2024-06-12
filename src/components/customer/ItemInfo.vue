<script setup>
import {useRouter} from "vue-router";

const router=useRouter()
function getAvatar(avatar) {
  console.log(avatar)
  if (avatar!=null) return  avatar
  else return  "../../assets/img/img_1.png"
  // return avatar ? avatar : "../../assets/img/img_1.png";
}
</script>

<template>
  <div class="out">
    <div class="area">
      <div class="back-button">
        <el-button @click="router.back">返回</el-button>
      </div>
      <div class="below">
        <div class="img">
          <el-image :fit="'scale-down'" :src="getAvatar($route.query.avatar)" >
            <template #error>

                <img src="../../assets/img/img_1.png" style="  width: 100%;height: 100%;"/>

            </template>
          </el-image>
        </div>

        <div class="item">
          <h2>{{ $route.query.itemName }}</h2>
          <div class="description">{{ $route.query.description }}</div>
          <div class="price">&#165;{{ $route.query.price }}</div>
          <!--      <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />-->
          <!--      <div class="button">-->
          <!--        <el-button>购买</el-button>-->
          <!--      </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.out {
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c0c0c0;
}

.out .area {
  width: 80%;
  height: 80%;
  background-color: white;
  display: flex;
  flex-direction: column;
  position: relative; /* Add relative positioning */
}

.out .area .back-button {
  position: absolute;
  top: 10px;
  left: 10px;
}

.out .area .below .img{
  width: 40%;
  height: 60%;
  //margin-right: 30px;
}

.out .area .below {
  width: 80%;
  height: 80%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center; /* Centering below */
}


.out .area .below .item {
  margin-left: 50px;
}

.out .area .below .item .price {
  background-color: #c0c0c0;
  margin-top: 20px;
  padding: 5px;
  margin-bottom: 20px;
}

.out .area .item .button {
  margin-top: 10px;
}

</style>

