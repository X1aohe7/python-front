
<script setup>
import {onMounted, ref} from 'vue';
import { ElMessage } from 'element-plus';
import axios from "axios";

const shopName = ref('');
// let showbutton=true
const avatarUrl = ref('');
const avatar = ref(null);
const user=ref()
onMounted(()=>{
  user.value=JSON.parse(sessionStorage.getItem('user'))
  console.log(user.value)
  shopName.value=user.value.shopName
  avatarUrl.value=user.value.avatar
})

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

    avatar.value = file;
    avatarUrl.value = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      avatar.value = reader.result; // Base64 编码
      // console.log(avatar.value)
      avatarUrl.value = reader.result; // 用于预览
    };
    reader.onerror = () => {
      ElMessage.error('文件读取失败');
    };

  }
};
const submitForm = () => {
  // data:{
  //   userId:user.value.userId,
  //   username:username.value,
  //   avatar:avatar.value
  // }
  const formData = new FormData();
  formData.append('userId',user.value.userId)
  formData.append('shopName', shopName.value);
  // formData.append('password', password.value);
  formData.append('avatar', avatar.value);

  // 模拟提交表单数据
  // console.log('用户名:', username.value);
  // console.log('密码:', password.value);
  // console.log('头像:', avatar.value);

  axios({
    method:"POST",
    url:'/business/updateBusinessInfo',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    console.log(res);
    user.value.avatar = avatar.value;
    sessionStorage.setItem('user', JSON.stringify(user.value));
    ElMessage.success('个人信息已更新！');
  }).catch(error => {
    console.error(error);
    ElMessage.error('更新失败');
  });
};
</script>

<template>
  <el-container>
    <el-header>
      <h1>个人信息修改</h1>
    </el-header>
    <div style="width: 80%; display: flex;justify-content: center">
      <el-card style="width: 50%">
        <el-main style="display:flex;justify-content: center;">
          <el-form @submit.prevent="submitForm" label-width="100px" >
            <el-form-item label="头像上传">
                <el-image
                    :src="avatarUrl"
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
            <el-form-item label="昵称">
              <el-input v-model="shopName" placeholder="输入要修改的昵称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-card>
    </div>


  </el-container>

</template>



<style scoped>

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
