<script setup>
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {Delete, InfoFilled, View} from "@element-plus/icons-vue";
import qs from "qs";
import {ElMessage} from "element-plus";

let user;
const router=useRouter();
let itemList=ref([]);
let dialogFormVisible=ref(false);
let form=ref({});

let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(5);
let loading=ref(true)

const pagedItemList = computed(() => {
  // console.log(itemList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=itemList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});


onMounted( () => {
  user=JSON.parse(sessionStorage.getItem("user"))
  // console.log(user)
  // console.log(router.currentRoute.value.query.shopId)
  getItemList();
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

async function getItemList() {
  loading.value=true
  let userId=user.userId
  console.log(userId)
  const response = await axios.get("/business/getItems", {params: {userId}});
  loading.value=false
  console.log(response)
  itemList.value=response.data
  total.value=response.data.length;

}

function add(){
  dialogFormVisible.value = true
  form.value={}
}

async function save() {

  form.value.userId = user.userId
  console.log(form.value)
  const response = await axios.post("/business/createItem", qs.stringify(form.value), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  console.log(response)
  dialogFormVisible.value = false
  getItemList()
}



function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}

async function changeStatus(row) {
  let userId = user.userId;
  let itemId = row.itemId
  let status = row.status

  const formData = {
    userId: userId,
    itemId: itemId,
    status: status
  }
  const response = await axios.post('/business/changeStatus', formData,{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  console.log(response.data); // 这里可以根据需要处理响应

}

async function deleteItem(id) {
  let userId = user.userId;
  let itemId = id


  const formData = {
    userId: userId,
    itemId: itemId,
  }
  const response = await axios.post('/business/deleteItem', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  console.log(response.data); // 这里可以根据需要处理响应
  getItemList()
}
</script>

<template>
  <div style="margin: 10px 0">
    <el-button type="primary" @click="add">新增 <i class="el-icon-circle-plus-outline"></i></el-button>


  </div>
  <el-table :data="pagedItemList" border stripe v-loading="loading">

    <el-table-column prop="itemId" label="ID" >
    </el-table-column>
    <el-table-column prop="itemName" label="商品名称" >
    </el-table-column>
    <el-table-column prop="description" label="商品描述" >
    </el-table-column>
    <el-table-column prop="price" label="价格">
    </el-table-column>
    <el-table-column prop="status" label="是否上架">
      <template #default="{ row }">
        <el-switch v-model="row.status"
                   :active-value="1"
                   :inactive-value="0"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   @change="changeStatus(row)"
        ></el-switch>
      </template>
    </el-table-column>


    <el-table-column label="操作" >
      <template #default="{ row }">
<!--        <el-button type="success"><el-icon style="margin-right: 3px"><View /></el-icon> 查看</el-button>-->
        <el-popconfirm
            width="220"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="确认删除吗?"
            @confirm="deleteItem(row.itemId)"
        >
          <template #reference>
            <el-button type="danger" ><el-icon style="margin-right: 3px"><Delete /></el-icon> 删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>


  <el-dialog title="商品信息" v-model="dialogFormVisible" width="30%">
    <el-form label-width="70px"  :model="form">
      <el-form-item label="商品名称" >
        <el-input v-model="form.itemName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述" >
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="价格" >
        <el-input v-model="form.price" autocomplete="off"></el-input>
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
.example-pagination-block{
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>