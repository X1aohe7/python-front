<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
let user=JSON.parse(sessionStorage.getItem('user'))
const router=useRouter();
// const routeName = ref(router.currentRoute.value.name);
const routeName = computed(()=>{return router.currentRoute.value.name})

onMounted(()=>{
  console.log(user)
})

function exit(){
  sessionStorage.removeItem("user")
  router.push("/login")
}
</script>

<template>
  <el-card class="box-card" :body-style="{display:'flex',justifyContent:'space-between'}">
    <span class="text">{{ routeName }}</span>
    <el-dropdown class="el-drop" >
      <span class="el-dropdown-link">
        {{ user.shopName }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-card>
</template>

<style scoped>
.box-card{
//display: flex;
//align-items: center;
//justify-content: space-between;
}
.box-card .text{
  margin-right: auto;
}
.box-card .el-drop {
  margin-left: auto;
}

.box-card .el-drop .el-dropdown-link {
  font-size: 15px;
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  /* Remove or adjust the margin based on your needs */
  margin-left: 10px;
}

:deep(:focus-visible) {

  outline: none;

}
</style>