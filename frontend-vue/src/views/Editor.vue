<template>
  <div class="editor-container">
    <!-- 顶部导航 -->
    <div class="editor-header">
      <el-radio-group v-model="scenario" size="small" @change="onScenarioChange">
        <el-radio-button label="job">💼 求职</el-radio-button>
        <el-radio-button label="study">🎓 升学</el-radio-button>
      </el-radio-group>
      <el-select v-model="selectedTemplateId" placeholder="选择模板" size="small" style="width: 180px; margin-left: 16px;">
        <el-option
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          :label="tpl.name"
          :value="tpl.id"
        />
      </el-select>
      <el-button type="primary" size="small" style="margin-left: auto;" @click="saveResume">
        💾 保存简历
      </el-button>
    </div>

    <!-- 主体 -->
    <div class="editor-body">
      <!-- 左侧表单 -->
      <div class="editor-form">
        <el-form :model="resume" label-width="80px" size="small">
          <!-- 基本信息 -->
          <div class="form-section-title">📋 基本信息</div>
          <el-form-item label="姓名">
            <el-input v-model="resume.realName" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="resume.gender" :label="1">男</el-radio>
            <el-radio v-model="resume.gender" :label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="resume.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="resume.email" placeholder="请输入邮箱" />
          </el-form-item>

          <!-- 求职场景 -->
          <template v-if="scenario === 'job'">
            <div class="form-section-title">💼 求职信息</div>
            <el-form-item label="目标岗位">
              <el-input v-model="resume.jobTarget" placeholder="如：Java后端开发" />
            </el-form-item>
            <el-form-item label="期望薪资">
              <el-input v-model="resume.salary" placeholder="如：15k-20k" />
            </el-form-item>
            <el-form-item label="专业技能">
              <el-input type="textarea" v-model="resume.skills" rows="2" placeholder="用逗号分隔，如：Spring Boot, MySQL, Redis" />
            </el-form-item>
          </template>

          <!-- 升学场景 -->
          <template v-if="scenario === 'study'">
            <div class="form-section-title">🎓 升学信息</div>
            <el-form-item label="申请类别">
              <el-select v-model="resume.studyType" placeholder="请选择" style="width:100%;">
                <el-option label="硕士（学硕）" value="硕士（学硕）" />
                <el-option label="硕士（专硕）" value="硕士（专硕）" />
                <el-option label="直博" value="直博" />
              </el-select>
            </el-form-item>
            <el-form-item label="目标专业">
              <el-input v-model="resume.major" placeholder="如：计算机科学与技术" />
            </el-form-item>
            <el-form-item label="GPA">
              <el-input v-model="resume.gpa" placeholder="如：3.8/4.0" />
            </el-form-item>
          </template>

          <!-- 教育背景 -->
          <div class="form-section-title">🎓 教育背景</div>
          <el-form-item label="学校">
            <el-input v-model="resume.school" placeholder="请输入学校名称" />
          </el-form-item>
          <el-form-item label="专业">
            <el-input v-model="resume.major2" placeholder="请输入专业名称" />
          </el-form-item>
          <el-form-item label="学历">
            <el-select v-model="resume.degree" placeholder="请选择" style="width:100%;">
              <el-option label="本科" value="本科" />
              <el-option label="硕士" value="硕士" />
              <el-option label="博士" value="博士" />
            </el-select>
          </el-form-item>
          <el-form-item label="在校时间">
            <el-input v-model="resume.eduDate" placeholder="如：2020.09 - 2024.06" />
          </el-form-item>

          <!-- 工作/项目经历 -->
          <div class="form-section-title">💻 工作/项目经历</div>
          <el-form-item label="经历描述">
            <el-input type="textarea" v-model="resume.experience" rows="3" placeholder="请描述你的工作内容或项目经历..." />
          </el-form-item>

          <!-- 个人简介 -->
          <div class="form-section-title">📝 个人简介</div>
          <el-form-item label="简介">
            <el-input type="textarea" v-model="resume.summary" rows="4" placeholder="简要介绍自己" />
            <div style="margin-top: 8px;">
              <el-button size="small" type="primary" @click="aiPolish('summary')">✨ AI润色</el-button>
              <el-button size="small" type="success" @click="aiGenerateCoverLetter">📄 生成求职信</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 右侧：简历预览 -->
      <div class="editor-preview">
        <div class="resume-card">
          <!-- 头部：姓名 + 联系方式 -->
          <div class="resume-header">
            <div class="resume-name">{{ resume.realName || '你的姓名' }}</div>
            <div class="resume-contact">
              <span v-if="resume.phone">📞 {{ resume.phone }}</span>
              <span v-if="resume.email">✉️ {{ resume.email }}</span>
            </div>
            <div class="resume-divider"></div>
          </div>

          <!-- 求职意向 -->
          <div v-if="scenario === 'job' && (resume.jobTarget || resume.salary)" class="resume-section">
            <div class="section-title">🎯 求职意向</div>
            <div class="section-content">
              <span v-if="resume.jobTarget"><strong>岗位：</strong>{{ resume.jobTarget }}</span>
              <span v-if="resume.salary" style="margin-left: 20px;"><strong>期望薪资：</strong>{{ resume.salary }}</span>
            </div>
          </div>

          <!-- 升学信息 -->
          <div v-if="scenario === 'study' && (resume.studyType || resume.major || resume.gpa)" class="resume-section">
            <div class="section-title">🎓 升学意向</div>
            <div class="section-content">
              <div v-if="resume.studyType"><strong>申请类别：</strong>{{ resume.studyType }}</div>
              <div v-if="resume.major"><strong>目标专业：</strong>{{ resume.major }}</div>
              <div v-if="resume.gpa"><strong>GPA：</strong>{{ resume.gpa }}</div>
            </div>
          </div>

          <!-- 教育背景 -->
          <div v-if="resume.school || resume.major2 || resume.degree || resume.eduDate" class="resume-section">
            <div class="section-title">🎓 教育背景</div>
            <div class="section-content">
              <div><strong>{{ resume.school || '学校名称' }}</strong></div>
              <div>{{ resume.major2 || '专业' }} <span v-if="resume.degree">| {{ resume.degree }}</span></div>
              <div style="color: #888; font-size: 13px;">{{ resume.eduDate || '入学 - 毕业' }}</div>
            </div>
          </div>

          <!-- 工作/项目经历 -->
          <div v-if="resume.experience" class="resume-section">
            <div class="section-title">💻 工作/项目经历</div>
            <div class="section-content" style="white-space: pre-wrap; line-height: 1.8;">
              {{ resume.experience }}
            </div>
          </div>

          <!-- 专业技能 -->
          <div v-if="resume.skills" class="resume-section">
            <div class="section-title">🛠 专业技能</div>
            <div class="section-content">
              <el-tag
                v-for="skill in resume.skills.split(',').map(s => s.trim()).filter(s => s)"
                :key="skill"
                size="small"
                style="margin: 4px 6px 4px 0;"
                type="primary"
              >
                {{ skill }}
              </el-tag>
            </div>
          </div>

          <!-- 个人简介 -->
          <div v-if="resume.summary" class="resume-section">
            <div class="section-title">📝 个人简介</div>
            <div class="section-content" style="white-space: pre-wrap; line-height: 1.8; color: #444;">
              {{ resume.summary }}
            </div>
          </div>

          <div class="resume-footer">
            <span>更新于 {{ new Date().toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      scenario: 'job',
      selectedTemplateId: null,
      templates: [],
      resume: {
        realName: '',
        gender: 1,
        phone: '',
        email: '',
        jobTarget: '',
        salary: '',
        skills: '',
        studyType: '',
        major: '',
        gpa: '',
        school: '',
        major2: '',
        degree: '',
        eduDate: '',
        experience: '',
        summary: ''
      }
    }
  },
  computed: {
    filteredTemplates() {
      return this.templates.filter(t => t.scenario === this.scenario)
    }
  },
  mounted() {
    this.fetchTemplates()
  },
  methods: {
    async fetchTemplates() {
      const res = await axios.get('/api/template/list')
      this.templates = res.data.data || []
      if (this.templates.length > 0) {
        this.selectedTemplateId = this.templates[0].id
      }
    },
    onScenarioChange() {
      if (this.scenario === 'job') {
        this.resume.studyType = ''
        this.resume.major = ''
        this.resume.gpa = ''
      } else {
        this.resume.jobTarget = ''
        this.resume.salary = ''
        this.resume.skills = ''
      }
    },
    async saveResume() {
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/resume', {
        templateId: this.selectedTemplateId,
        scenario: this.scenario,
        content: this.resume
      }, {
        headers: { Authorization: token }
      })
      if (res.data.code === 200) {
        this.$message.success('保存成功')
        this.$router.push('/')
      } else {
        this.$message.error(res.data.msg || '保存失败')
      }
    },
    async aiPolish(field) {
      const text = this.resume[field]
      if (!text) {
        this.$message.warning('请先输入内容')
        return
      }
      const res = await axios.post('/api/ai/polish', { text })
      if (res.data.code === 200) {
        this.resume[field] = res.data.data
        this.$message.success('润色完成')
      } else {
        this.$message.error(res.data.msg || 'AI润色失败')
      }
    },
    async aiGenerateCoverLetter() {
      const res = await axios.post('/api/ai/cover-letter', this.resume)
      if (res.data.code === 200) {
        this.resume.summary = res.data.data
        this.$message.success('求职信生成成功')
      } else {
        this.$message.error(res.data.msg || '生成失败')
      }
    }
  }
}
</script>

<style scoped>
.editor-container {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}
.editor-header {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 8px;
}
.editor-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
}
.editor-form {
  flex: 1;
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.editor-preview {
  flex: 1;
  background: #eef1f5;
  padding: 24px;
  border-radius: 12px;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #409EFF;
  padding: 8px 0 4px 0;
  margin-bottom: 8px;
  border-bottom: 2px solid #409EFF;
  display: inline-block;
}

/* ===== 简历卡片 ===== */
.resume-card {
  background: #ffffff;
  width: 100%;
  max-width: 580px;
  padding: 32px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  transition: all 0.2s;
}
.resume-header {
  text-align: center;
  padding-bottom: 6px;
}
.resume-name {
  font-size: 30px;
  font-weight: 700;
  color: #1a2b3c;
  letter-spacing: 3px;
}
.resume-contact {
  margin-top: 6px;
  font-size: 13px;
  color: #777;
}
.resume-contact span {
  margin: 0 8px;
}
.resume-divider {
  width: 50px;
  height: 3px;
  background: #409EFF;
  margin: 10px auto 16px;
  border-radius: 2px;
}
.resume-section {
  margin-bottom: 14px;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a2b3c;
  border-bottom: 1px solid #e8ecf0;
  padding-bottom: 4px;
  margin-bottom: 6px;
}
.section-content {
  font-size: 14px;
  color: #444;
  padding: 2px 0;
  line-height: 1.6;
}
.resume-footer {
  margin-top: 16px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
  font-size: 12px;
  color: #bbb;
}
</style>