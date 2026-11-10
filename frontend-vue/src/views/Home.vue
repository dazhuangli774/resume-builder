<template>
  <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
    <el-row :gutter="20">
      <el-col :span="24" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1>我的简历</h1>
        <div>
          <el-button type="primary" @click="$router.push('/editor')">+ 创建简历</el-button>
          <el-button @click="$router.push('/templates')">浏览模版</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 简历卡片网格 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in resumeList" :key="item.id" style="margin-bottom: 20px;">
        <el-card shadow="hover" @click.native="viewResume(item.id)" style="cursor: pointer; height: 100%;">
          <div style="text-align: center;">
            <el-avatar :size="80" :src="item.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
            <h3>{{ item.realName || '未命名' }}</h3>
            <p style="color: #999; font-size: 14px;">{{ item.intention || '求职意向未填写' }}</p>
            <el-tag size="small" :type="item.status === 1 ? 'success' : 'info'">
              {{ item.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" v-if="resumeList.length === 0" style="text-align: center; color: #999; padding: 50px 0;">
        暂无简历，点击右上角创建
      </el-col>
    </el-row>
  </div>
</template>

<script>
// ... (script 部分保持不变，与之前提供的 Home.vue 一致)
</script>

<style scoped>
.el-card {
  transition: transform 0.2s;
}
.el-card:hover {
  transform: translateY(-5px);
}
</style>