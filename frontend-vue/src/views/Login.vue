<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 style="text-align:center; margin-bottom: 30px;">简历生成系统</h2>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密码" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="handleLogin" :loading="loading">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" @click="$router.push('/register')">还没有账号？去注册</el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form: { username: '', password: '' },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        this.loading = true
        try {
          const res = await axios.post('/api/user/login', this.form)
          if (res.data.code === 200) {
            this.$message.success('登录成功')
            // 存储用户信息和 token（稍后 Vuex 管理）
            localStorage.setItem('token', res.data.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.data.user))
            this.$router.push('/')
          } else {
            this.$message.error(res.data.msg || '登录失败')
          }
        } catch (err) {
          this.$message.error('网络错误，请检查后端是否启动')
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2b8cbe 0%, #4db6ac 100%);
}
.login-card {
  width: 400px;
  padding: 30px;
  border-radius: 8px;
}
</style>