
<!--没有用！！！-->
<script setup>

</script>

<template>
<div class="out" >
  <div class="area">
    <img src="../../assets/img/img_1.png">
    <div class="item">
      <h2>{{ $route.query.itemName }}</h2>
      <div class="description">{{ $route.query.description }}</div>
      <div class="price">{{ $route.query.price }}</div>
      <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />
      <div class="button">
        <el-button>购买</el-button>
      </div>

    </div>
  </div>
</div>
</template>

<style scoped>
.out{
  height: 90%;
  display:flex;
  justify-content: center;
  align-items: center;

  background-color: #c0c0c0;
}
.out .area{

  width: 80%;
  height: 80%;
  background-color: white;
  display: flex;
  align-items: center;
}
.out .area img{
  width: 40%;
  height: 60%;
  margin-left: 50px;
}
.out .area .item{
  margin-left: 50px;
}
.out .area .item .price{
  background-color: #c0c0c0;
  margin-top: 20px;
  padding: 5px;
  margin-bottom: 20px;
}

.out .area .item .button{
  margin-top: 10px;
}
</style>