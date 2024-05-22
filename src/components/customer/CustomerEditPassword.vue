<script setup>
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import axios from "axios";

let oldPassword=ref('')
let newPassword=ref('')
let checkPassword=ref('')
let user=ref()

onMounted(()=>{
  user.value=JSON.parse(sessionStorage.getItem('user'))
})
let rules= {//表单规则
      oldPassword: [
    {required: true, message: '请输入原密码', trigger: 'blur'},
    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
  ],
      newPassword: [
    {required: true, message: '请输入新密码', trigger: 'blur'},
    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
  ],
      checkPassword: [
    {required: true, message: '请再次输入新密码', trigger: 'blur'},
    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
  ],

}

const validateForm = async (formRef) => {
  try {
    await formRef.validate();
    // 提交表单数据的逻辑
    if (newPassword.value!=checkPassword.value){
      ElMessage.error("两次密码不一致")
      return
    }
    axios({
      method:"POST",
      url:"/customer/updatePassword",
      data:{
        userId:user.value.userId,
        oldPassword:oldPassword.value,
        newPassword:newPassword.value
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res=>{
      ElMessage.success('修改成功')
      console.log(res)
    }).catch(err=>{
      ElMessage.error('旧密码错误')

      // console.log("旧密码错误")
    })
  } catch (error) {
    ElMessage.error("密码不符合要求")
    // console.log('表单验证失败');
  }
};
</script>

<template>
  <div class="update-wrap">
    <el-form ref="formRef" class="update-container" :model="{ oldPassword, newPassword, checkPassword }"  :rules="rules" label-position="top">
      <h1 class="title">修改密码</h1>

      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" autocomplete="off" v-model="oldPassword"  show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" >
        <el-input type="password" autocomplete="off" v-model="newPassword" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword" >
        <el-input type="password"  autocomplete="off" v-model="checkPassword" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="validateForm($refs.formRef)" style="width: 100%">确认更改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.update-wrap {
  margin-top: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  /*padding-top: 5%;*/
  background-repeat: no-repeat;
  background-position: center right;
  background-size: 100%;
}

.update-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
</style>