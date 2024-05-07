<script setup>

import CustomerTab from "../components/customer/CustomerTab.vue";
import CustomerHeader from "../components/customer/CustomerHeader.vue";
</script>

<template>
  <div class="wrapper">
    <CustomerTab  />
    <div class="main">
      <CustomerHeader/>
      <router-view/>
    </div>
  </div>






</template>

<style scoped>
.wrapper{
  display: flex;
  height: 100vh;
}

.wrapper .main{
  width: 100%;
  max-height: 100vh;
}
</style>