<script setup>
import { reactive, ref } from 'vue';
import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

const user = reactive({
  username: '',
  password: '',
  confirmPassword: '' ,// 添加确认密码字段
  customerName:''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' } // 通常密码有最小长度要求
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== user.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }, trigger: 'blur'
    }
  ],
};

const ok = () => {
  ElMessage({
    message: '注册成功!',
    type: 'success',
  });
}

const doRegister = async () => {
  try {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('customerName', user.customerName);
    formData.append('password', user.password);
    formData.append('confirmPassword', user.confirmPassword); // 添加确认密码到表单数据

    const res = await axios.post('/customerRegister', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log(res.data);
    if(res.data && res.data.success){ // 假设服务器响应包含success字段
      ok();
      router.push("/login"); // 注册成功后跳转到登录页面
    }

  } catch (err) {
    if (err.response.status === 400) {
      ElMessage({
        message: '注册失败，请重试!',
        type: 'error',
      })
    }
  }
};
</script>

<template>
  <div class="login-wrap">
    <el-form class="login-container" :rules="rules" :model="user" @submit.native.prevent="doRegister">
      <h1 class="title">用户注册</h1>
      <el-form-item prop="username">
        <el-input type="text" placeholder="用户账号"
                  v-model="user.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="customerName">
        <el-input type="text" placeholder="用户姓名"
                  v-model="user.customerName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="用户密码"
                  show-password v-model="user.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input type="password" placeholder="确认密码"
                  show-password v-model="user.confirmPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doRegister" style="width: 100%;">注册</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<style scoped>
.login-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 10%;
  background-repeat: no-repeat;
  background-position: center right;
  background-size: 100%;
}
.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>