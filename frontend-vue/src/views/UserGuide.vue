<template>
  <div style="padding: 40px; max-width: 600px; margin: 0 auto; text-align: center;">
    <h2>欢迎来到简历生成系统</h2>
    <p style="color: #666; margin-bottom: 30px;">请选择你的目标，我们将为你推荐合适的模版</p>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover" class="guide-card" @click.native="selectPurpose('job')">
          <i class="el-icon-briefcase" style="font-size: 48px; color: #409EFF;"></i>
          <h3>求职</h3>
          <p>寻找工作机会</p>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="guide-card" @click.native="selectPurpose('study')">
          <i class="el-icon-reading" style="font-size: 48px; color: #67C23A;"></i>
          <h3>升学</h3>
          <p>继续深造学习</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    selectPurpose(purpose) {
      // 这里可以保存用户的选择到 store 或 localStorage
      localStorage.setItem('userPurpose', purpose)
      this.$message.success(`已选择：${purpose === 'job' ? '求职' : '升学'}`)
      this.$router.push('/templates')
    }
  }
}
</script>

<style scoped>
.guide-card {
  cursor: pointer;
  transition: transform 0.2s;
  padding: 20px 0;
}
.guide-card:hover {
  transform: scale(1.02);
}
</style>