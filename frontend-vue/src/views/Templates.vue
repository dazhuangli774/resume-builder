<template>
  <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
    <h2 style="margin-bottom: 20px;">选择简历模版</h2>
    <!-- 场景筛选 -->
    <el-radio-group v-model="filterScenario" size="small" style="margin-bottom: 20px;">
      <el-radio-button label="all">全部</el-radio-button>
      <el-radio-button label="job">💼 求职</el-radio-button>
      <el-radio-button label="study">🎓 升学</el-radio-button>
    </el-radio-group>
    
    <!-- 模板卡片网格 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="tpl in filteredTemplates" :key="tpl.id" style="margin-bottom: 20px;">
        <el-card shadow="hover" body-style="{ padding: '10px' }">
          <img :src="tpl.previewImage || 'https://via.placeholder.com/300x400?text=预览图'" style="width: 100%; height: 250px; object-fit: cover; border-radius: 4px;">
          <div style="padding: 10px;">
            <span style="font-weight: bold;">{{ tpl.name }}</span>
            <div style="margin-top: 8px;">
              <el-tag size="mini" v-for="tag in tpl.tags.split(',')" :key="tag" style="margin-right: 4px;">{{ tag }}</el-tag>
            </div>
            <el-button type="primary" size="small" style="margin-top: 10px; width: 100%;" @click="useTemplate(tpl.id)">使用此模版</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      templates: [],
      filterScenario: 'all'
    }
  },
  computed: {
    filteredTemplates() {
      if (this.filterScenario === 'all') return this.templates
      return this.templates.filter(t => t.scenario === this.filterScenario)
    }
  },
  mounted() {
    this.fetchTemplates()
  },
  methods: {
    async fetchTemplates() {
      const res = await axios.get('/api/template/list')
      this.templates = res.data.data || []
    },
    useTemplate(id) {
      // 跳转到编辑器，并传递模板ID
      this.$router.push(`/editor?template=${id}`)
    }
  }
}
</script>