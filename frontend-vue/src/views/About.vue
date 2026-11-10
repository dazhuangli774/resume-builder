<template>
  <div style="padding: 40px; max-width: 800px; margin: 0 auto; text-align: center;">
    <el-avatar :size="120" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
    <h2 style="margin-top: 20px;">刘永添</h2>
    <p style="color: #666;">全栈开发学习者 | 简历生成系统作者</p>
    <el-divider></el-divider>
    <div style="text-align: left; padding: 0 20px;">
      <p><i class="el-icon-user"></i> 姓名：刘永添</p>
      <p><i class="el-icon-phone"></i> 电话：15671677987</p>
      <p><i class="el-icon-message"></i> 邮箱：402856201@qq.com</p>
    </div>
    <el-divider></el-divider>
    <el-button type="primary" size="large" @click="goToGitHub" icon="el-icon-link">
      访问我的个人网站
    </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    goToGitHub() {
      // 跳转到你的 GitHub Pages 地址
      window.open('https://ranliuaca.github.io/', '_blank')
    }
  }
}
</script>