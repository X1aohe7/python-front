<script setup>
import {reactive, ref} from 'vue';
import axios from "axios";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const router=useRouter();



const user=reactive({
  username:'',
  password:''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
  ],
};

const ok = () => {
  ElMessage({
    message: '登录成功!',
    type: 'success',
  })
}

const error = () => {
  ElMessage({
    message: '用户名或密码错误!',
    type: 'error',
  })
}

const doLogin = async () => {
  try {
    // 发送请求
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('password', user.password);

    // Send request with form data
    const res = await axios.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // 打印收到的数据（用于测试）
    console.log(res.data);
    if(res.data!=null){
      const user=res.data
      ok();
      sessionStorage.setItem("user",JSON.stringify(user));
      if(user.userType==1){
        router.push("/business");
      }else {
        router.push("/customer")
      }


    }


  } catch (err) {
    // 异常
    console.log(err)
    // if (err.response.status === 401) {
    //   error()
    // }
    error()
  }
};
</script>

<template>
  <div class="login-wrap">
    <el-form class="login-container" :rules="rules" :model="user">
      <h1 class="title">用户登录</h1>
      <el-form-item prop="id">
        <el-input type="text" placeholder="用户账号"
                  v-model="user.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="用户密码"
                  show-password v-model="user.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doLogin" style="width: 100%;">登录</el-button>
      </el-form-item>
      <div class="register-container">
        <el-row style="text-align: center;margin-top: -10px;">
        <el-link type="primary" @click="router.push('/customerRegister')">用户注册</el-link>
        </el-row>
        <el-row style="text-align: center;margin-top: -10px;">
          <el-link type="primary" @click="router.push('/businessRegister')">商铺注册</el-link>
        </el-row>
      </div>
    </el-form>

  </div>

</template>

<style>
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
.register-container{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>