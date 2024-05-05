<!--新增或删除商品-->
<script setup>
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {Delete, InfoFilled, View} from "@element-plus/icons-vue";
import qs from "qs";
import {ElMessage} from "element-plus";

const router=useRouter();
let itemList=ref([]);
let dialogFormVisible=ref(false);
// let form=ref({});
let localShopId=ref(-1);
let localShopName=ref("");
let user;
let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(10)

const pagedItemList = computed(() => {
  // console.log(itemList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=itemList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});


onMounted( async () => {
  localShopId.value = router.currentRoute.value.query.shopId
  localShopName.value = router.currentRoute.value.query.shopName
  user = JSON.parse(sessionStorage.getItem("user"));
  await getItemList();
  await getShopItemList();
  // console.log(pagedShopList.value);
})

const ok = () => {
  ElMessage({
    message: '删除成功!',
    type: 'success',
  })
}

const err = () => {
  ElMessage({
    message: '删除失败!',
    type: 'error',
  })
}

async function getItemList() {

  const businessId = user.id;

  const response = await axios.get("/business/getItemList", {params: {businessId}});
  console.log(response)
  itemList.value=response.data
  total.value=response.data.length;
}

async function getShopItemList() {

  const response = await axios.get("/shop/getShopItemList", {params: {shopId:localShopId.value}});
  console.log(response.data)
  let shopItemList=response.data;
  // 遍历已上架商品列表
  shopItemList.forEach(shopItem => {
    // 找到对应的商品列表中的商品
    const correspondingItem = itemList.value.find(item => item.id === shopItem.item.id);

    // 如果找到了对应的商品
    if (correspondingItem) {
      // 将已上架商品的 status 赋值给商品列表中的商品
      correspondingItem.status = shopItem.status;
    }
  });
}


async function addShopItem(shopId,itemId) {

  let requsetData={
    shopId:shopId,
    itemId:itemId
  }

  const response = await axios.post("/shop/addShopItem", qs.stringify(requsetData), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  console.log(response)


}

async function deleteShopItem(shopId,itemId) {
  let requsetData={
    shopId:shopId,
    itemId:itemId
  }
  // console.log(requestData)
  const response = await axios.post("/shop/deleteShopItem", qs.stringify(requsetData), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  console.log(response)

}

function changeStatus(row){
  let shopId=localShopId.value;
  let itemId=row.id
  let status=row.status
  if (status==true){
    addShopItem(shopId,itemId)
  }else{
    deleteShopItem(shopId,itemId);
  }
  console.log(shopId,itemId,status);

}

function handleCurrentChange(newPage){
  // console.log(newPage)
  currentPage.value=newPage
}
</script>

<template>
  <el-card style="background-color:#c0c0c0; display: flex;justify-content: center">{{ localShopName }}</el-card>
<!--  <div style="margin: 10px 0; display: flex">-->

<!--    <el-button type="primary" @click="handleAdd" >新增 <i class="el-icon-circle-plus-outline"></i></el-button>-->
<!--  </div>-->
  <div>
    <el-table :data="pagedItemList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" ></el-table-column>
      <el-table-column prop="itemName" label="商品名称" ></el-table-column>
      <el-table-column prop="description" label="描述" ></el-table-column>

      <!--是否启用-->
      <el-table-column prop="status" label="是否上架" width="150">
        <template v-slot:default="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ccc"
                     @change="changeStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <!--操作-->
<!--      <el-table-column label="操作">-->
<!--        <template v-slot:default="scope">-->
<!--          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑/预览</el-button>-->
<!--          <el-button size="mini" type="success" icon="el-icon-view" @click="getUserOfDoc(scope.row.docId)">查看成员</el-button>-->
<!--          &lt;!&ndash;删除提示框&ndash;&gt;-->
<!--          <el-popconfirm-->
<!--              confirm-button-text='确定'-->
<!--              cancel-button-text='取消'-->
<!--              icon="el-icon-info"-->
<!--              icon-color="red"-->
<!--              title="您确定删除吗？"-->
<!--              @confirm="deleteDoc(scope.row)"-->
<!--          >-->
<!--            <el-button size="mini" type="danger" icon="el-icon-delete" slot="reference" style="margin-left: 1vw;font-size: smaller;">-->
<!--              删除-->
<!--            </el-button>-->
<!--          </el-popconfirm>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <!--分页-->
    <div class="example-pagination-block">

      <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>

</template>

<style scoped>
.example-pagination-block{
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>