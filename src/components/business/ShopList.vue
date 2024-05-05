<script setup>

import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {Delete, InfoFilled, View} from "@element-plus/icons-vue";
import qs from "qs";
import {ElMessage} from "element-plus";

const router=useRouter();
let shopList=ref([]);
let dialogFormVisible=ref(false);
let form=ref({});
let user;
let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(10)

const pagedShopList = computed(() => {
  // console.log(shopList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=shopList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});


onMounted( () => {
  user = JSON.parse(sessionStorage.getItem("user"));
  getShopList();
  // console.log(pagedShopList.value);
})

const ok = () => {
  ElMessage({
    message: '删除成功!',
    type: 'success',
  })
}

const error = () => {
  ElMessage({
    message: '删除失败!',
    type: 'error',
  })
}

async function getShopList() {

  const businessId = user.id;

  const response = await axios.get("/business/getShopList", {params: {businessId}});
  // console.log(response)
  shopList.value=response.data
  total.value=response.data.length;
}

function add(){
  dialogFormVisible.value = true
  form.value={}
}

async function save() {

  form.value.businessId = user.id
  // console.log(form.value)
  const response = await axios.post("/business/createShop", qs.stringify(form.value), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  console.log(response)
  dialogFormVisible.value = false
  getShopList()
}

async function deleteShop(shopId) {
  const requestData = {
    params: {
      id: shopId,
    },
  };
  // console.log(requestData)
   await axios.get("/shop/delete",requestData).then(res=>{
     ok();
   }).catch(err=>{
     error()
     console.log(err);
   })

  getShopList()
}

function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}

function gotoItemList(row){
  console.log(row)
  router.push({
    path: '/manage/shopInfo',
    query: { shopId: row.id, shopName:row.shopName }
  });
}

</script>

<template>
  <div style="margin: 10px 0">
    <el-button type="primary" @click="add">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
  </div>
  <el-table :data="pagedShopList" border stripe>

    <el-table-column prop="id" label="ID" >
    </el-table-column>
    <el-table-column prop="shopName" label="门店名" >
    </el-table-column>

    <el-table-column label="操作" >
      <template #default="scope">
        <el-button type="success" @click="gotoItemList(scope.row)"><el-icon style="margin-right: 3px" ><View /></el-icon> 查看</el-button>
      <el-popconfirm
          width="220"
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="确认删除吗?"
          @confirm="deleteShop(scope.row.id)"
      >
        <template #reference>
          <el-button type="danger" ><el-icon style="margin-right: 3px"><Delete /></el-icon> 删除</el-button>
        </template>
      </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
<!--  <div style="padding: 10px 30px">-->
<!--    <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="pageNum"-->
<!--        :page-sizes="[2, 5, 10, 20]"-->
<!--        :page-size="pageSize"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="total">-->
<!--    </el-pagination>-->
<!--  </div>-->

  <el-dialog v-model="dialogFormVisible" title="新增门店">
    <el-form :model="form">
      <el-form-item label="门店名称" :label-width="80">
        <el-input v-model="form.shopName" autocomplete="off" />
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="save">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
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