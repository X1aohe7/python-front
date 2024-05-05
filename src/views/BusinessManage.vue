<script setup>


import BusinessTab from "../components/business/BusinessTab.vue";
import BusinessHeader from "../components/business/BusinessHeader.vue";
</script>

<template>
  <div class="wrapper">
    <BusinessTab  />
    <div class="main">
      <BusinessHeader/>
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
  height: 100vh;
}
</style>