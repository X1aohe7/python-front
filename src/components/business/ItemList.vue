<script setup>
import {useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import {Delete, InfoFilled, View} from "@element-plus/icons-vue";
import qs from "qs";
import {ElMessage} from "element-plus";

let user;
const router=useRouter();
let itemList=ref([]);
let dialogFormVisible=ref(false);
let form=ref({});
let formRef=ref()
let currentPage=ref(1);
let total=ref(0);
let pageSize=ref(4);
let loading=ref(true)

const pagedItemList = computed(() => {
  // console.log(itemList.value)
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  let list=itemList.value.slice(startIndex, endIndex);
  // console.log(list)
  return list
});

const validateNumber = (rule, value, callback) => {
  if (value === '' || isNaN(value) || Number(value) < 0) {
    callback(new Error('请输入一个大于或等于0的数字'));
  } else {
    callback();
  }
};

const rules = reactive({
  itemName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入门店地址', trigger: 'blur' }],
  avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入起送价', trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ],

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

async function save(fr) {

  form.value.userId = user.userId
  console.log(form.value)



  if (!fr) return
  await fr.validate( async (valid) => {
    console.log(valid,666)
    if (valid) {
      const response = await axios.post("/business/createItem", qs.stringify(form.value), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      console.log(response)
      dialogFormVisible.value = false
      getItemList()
      form.value={}
      ElMessage.success('保存成功');
    } else {
      ElMessage.error('请填写完整的表单信息');
    }
  });
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
  loading.value=true
  axios.post('/business/deleteItem', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res=>{
    console.log(res.data); // 这里可以根据需要处理响应
    getItemList()
  })

}
const updateAvatar = (event) => {
  const file = event.target.files[0];
  if (file) {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      ElMessage.error('上传的文件必须是图片!');
      return;
    }
    if (!isLt2M) {
      ElMessage.error('上传的图片大小不能超过 2MB!');
      return;
    }

    // avatar.value = file;
    // avatarUrl.value = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // avatar.value = reader.result; // Base64 编码
      // console.log(avatar.value)
      form.value.avatar = reader.result; // 用于预览
    };
    reader.onerror = () => {
      ElMessage.error('文件读取失败');
    };

  }
  event.target.value = '';
};

function getAvatar(avatar) {
  // console.log(avatar ? avatar : "1")

    return avatar ? avatar : '../../src/assets/img/img_1.png';
}

</script>

<template>
  <div style="margin: 10px 0">
    <el-button type="primary" @click="add">新增 <i class="el-icon-circle-plus-outline"></i></el-button>


  </div>
  <el-table :data="pagedItemList" border stripe v-loading="loading">

    <el-table-column prop="itemId" label="ID" >
    </el-table-column>
    <el-table-column label="商品图片">
      <template #default="scope">
        <el-image :src="getAvatar(scope.row.avatar)" fit="cover" style="width: 100px; height: 100px;">
          <template #error>
            <div>
              <img src="../../assets/img/img_1.png" />
            </div>
          </template>
        </el-image>
      </template>
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
    <el-form label-width="80px"  :model="form" :rules="rules" ref="formRef">
      <el-form-item label="头像上传" prop="avatar">
        <el-image
            :src="form.avatar"
            class="image_1"
            style="border-radius: 3px 3px 0 0"
        >
          <template #error>
            <div class="error">

              暂无头像

            </div>
          </template>
        </el-image>
        <el-button style="margin-left: 20px" @click="$refs.upload.click()">上传头像
          <input
              ref="upload"
              style="display: none"
              name="file"
              type="file"
              @change="updateAvatar"
          /></el-button>
      </el-form-item>
      <el-form-item label="商品名称" prop="itemName">
        <el-input v-model="form.itemName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="form.price" autocomplete="off"></el-input>
      </el-form-item>



    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="save(formRef)">
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
.image_1 {
  width: 275px;
  height: 260px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.error {
  margin: 100px auto;
  width: 50%;
  padding: 10px;
  text-align: center;
}
</style>