<template>
  <div id="app">
    <el-container>
      <!-- 导航栏 -->
      <el-header style="background: #409EFF; color: white; display: flex; align-items: center; padding: 0 20px; height: 60px; flex-shrink: 0;">
        <!-- 左侧：系统名称 + Logo -->
        <div style="display: flex; align-items: center; gap: 12px; min-width: 180px;">
          <span style="font-size: 20px; font-weight: bold; cursor: pointer; white-space: nowrap;" @click="$router.push('/')">
            📄 简历生成系统
          </span>
        </div>

        <!-- 中间：导航菜单（居中） -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#409EFF"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleSelect"
          router
          style="border-bottom: none; flex: 1; justify-content: center;"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/templates">简历模版</el-menu-item>
          <el-menu-item index="/about">关于我</el-menu-item>
          <el-menu-item index="/guide">新手指引</el-menu-item>
          <el-menu-item index="/editor">创建简历</el-menu-item>
        </el-menu>

        <!-- 右侧：用户操作 -->
        <div style="display: flex; align-items: center; gap: 12px; min-width: 120px; justify-content: flex-end;">
          <el-button type="text" style="color: white;" @click="logout" v-if="isLoggedIn">退出</el-button>
          <el-button type="text" style="color: white;" @click="$router.push('/login')" v-else>登录</el-button>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main style="background: #f5f7fa; min-height: calc(100vh - 60px); padding: 20px;">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token')
    }
  },
  methods: {
    handleSelect(key) {
      this.$router.push(key).catch(() => {})
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$message.success('已退出')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; }

/* 导航菜单样式微调 */
.el-menu.el-menu--horizontal {
  border-bottom: none !important;
}
.el-menu--horizontal > .el-menu-item {
  height: 60px !important;
  line-height: 60px !important;
  color: #fff !important;
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 3px solid #ffd04b !important;
}
.el-menu--horizontal > .el-menu-item:hover {
  background-color: rgba(255,255,255,0.1) !important;
}
</style>