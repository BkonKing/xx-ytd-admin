<template>
  <page-header-wrapper>
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-form layout="inline">
        <standard-form-row title="参与公司" block style="padding-bottom: 11px;">
          <a-form-item v-if="companyList && companyList.length">
            <tag-select v-model="companyIds" @change="getProjectList">
              <tag-select-option
                v-for="tag in companyList"
                :key="tag.companyId"
                :value="tag.companyId"
                >{{ tag.companyName }}</tag-select-option
              >
            </tag-select>
          </a-form-item>
        </standard-form-row>

        <standard-form-row title="其它选项" grid last>
          <a-row>
            <a-col :lg="8" :md="10" :sm="10" :xs="24">
              <a-form-item
                :wrapper-col="{ sm: { span: 16 }, xs: { span: 24 } }"
                label="项目"
              >
                <a-input
                  v-model="serachText"
                  placeholder="ID、名称"
                  @change="getProjectList"
                  style="max-width: 200px; width: 100%;"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="10" :sm="10" :xs="24">
              <a-form-item
                :wrapper-col="{ sm: { span: 16 }, xs: { span: 24 } }"
                label="项目阶段"
              >
                <a-select
                  v-model="stage"
                  @change="getProjectList"
                  style="max-width: 200px; width: 100%;"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="option in projectStageList"
                    :key="option.stageId"
                    :value="option.stageId"
                    >{{ option.stageText }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </standard-form-row>
      </a-form>
    </a-card>

    <div class="ant-pro-pages-list-applications-filterCardList">
      <a-list
        :loading="loading"
        :data-source="data"
        :grid="{ gutter: 24, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
        style="margin-top: 24px;"
      >
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-card
            class="add-project-card"
            v-if="index === 0"
            :body-style="{ paddingBottom: 20 }"
            @click="openAddProject"
          >
            <a-icon type="plus"></a-icon>新增项目
          </a-card>
          <a-card
            v-else
            :body-style="{ paddingBottom: 20 }"
            hoverable
            @click="goProjectDetail(item)"
          >
            <a-card-meta>
              <template slot="title">
                <div class="project-header">
                  <span class="project-title">{{ item.projectName }}</span>
                  <a-tag v-if="item.stage" color="blue" class="project-stage">
                    {{ item.stage }}
                  </a-tag>
                </div>
              </template>
              <template slot="avatar">
                <a-avatar size="large" :src="item.avatar" />
              </template>
            </a-card-meta>
            <template slot="actions">
              <div class="actions-span" @click.stop="openEditProject(item)">
                编辑
              </div>
              <div class="actions-span" @click.stop="removeProject(item)">
                删除
              </div>
            </template>
            <card-info
              :company-num="item.relationCompanyNum"
              :contract-num="item.relationContractNum"
              :order-num="item.relationOrderNum"
            ></card-info>
          </a-card>
        </a-list-item>
      </a-list>
    </div>

    <a-modal
      :title="title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :width="640"
      :maskClosable="false"
      :keyboard="false"
      @ok="handleOkProject"
      @cancel="closeModal"
    >
      <project-form
        ref="projectForm"
        :company-list="companyList"
        :stage-list="projectStageList"
      ></project-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import clonedeep from 'lodash.clonedeep'
// import _pick from 'lodash.pick'
import {
  TagSelect,
  StandardFormRow
  /* Ellipsis, AvatarList */
} from '@/components'
import CardInfo from './components/CardInfo'
import projectForm from './components/ProjectForm'
import {
  getAllCompany,
  getProjectStage,
  getProjectList,
  addProject,
  updateProject,
  removeProject
} from '@/api/project'
import cloneDeep from 'lodash.clonedeep'
const TagSelectOption = TagSelect.Option
// const AvatarListItem = AvatarList.AvatarItem

export default {
  components: {
    // AvatarList,
    // AvatarListItem,
    // Ellipsis,
    TagSelect,
    TagSelectOption,
    StandardFormRow,
    CardInfo,
    projectForm
  },
  data () {
    return {
      data: [],
      companyIds: [],
      serachText: '',
      stage: '',
      companyList: [],
      projectStageList: [],
      loading: true,
      title: '',
      visible: false,
      confirmLoading: false
    }
  },
  filters: {
    fromNow (date) {
      return moment(date).fromNow()
    }
  },
  created () {
    this.getAllCompany()
    this.getProjectStage()
    this.getProjectList()
  },
  methods: {
    // 获取所有公司
    getAllCompany () {
      getAllCompany().then(({ data }) => {
        this.companyList = data
      })
    },
    // 获取项目阶段接口
    getProjectStage () {
      getProjectStage().then(({ data }) => {
        this.projectStageList = data
      })
    },
    // 获取项目列表
    getProjectList () {
      getProjectList({
        companyIds: this.companyIds,
        serachText: this.serachText,
        stage: this.stage
      }).then(({ data }) => {
        this.data = [{}, ...data]
        this.loading = false
      })
    },
    // 打开新增项目弹窗
    openAddProject () {
      this.title = '新增项目'
      this.showModal()
      this.$refs.projectForm && this.$refs.projectForm.resetFields()
    },
    // 打开编辑项目弹窗
    openEditProject (obj) {
      this.title = '编辑项目'
      this.showModal()
      this.$refs.projectForm && this.$refs.projectForm.resetFields()
      this.$nextTick(() => {
        const data = cloneDeep(obj)
        if (obj.startDate) {
          data.buildTime = [moment(obj.startDate), moment(obj.endDate)]
        }
        if (obj.provinceId) {
          data.area = [obj.provinceId, obj.cityId, obj.areaId]
        }
        this.$refs.projectForm.setFieldsValue(data)
      })
    },
    showModal () {
      this.visible = true
    },
    handleOkProject (e) {
      this.$refs.projectForm.handleSubmit().then(res => {
        this.confirmLoading = true
        const data = clonedeep(res)
        if (data.buildTime && data.buildTime.length) {
          data.startDate = moment(data.buildTime[0]).format('YYYY-MM-DD')
          data.endDate = moment(data.buildTime[1]).format('YYYY-MM-DD')
        }
        if (data.area && data.area.length) {
          data.provinceId = data.area[0]
          data.cityId = data.area[1]
          data.areaId = data.area[2]
        }
        if (data.id) {
          this.updateProject(data)
        } else {
          this.addProject(data)
        }
      })
    },
    addProject (data) {
      addProject(data)
        .then(({ success }) => {
          if (success) {
            this.$message.success('添加项目成功')
            this.getProjectList()
            this.visible = false
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    updateProject (data) {
      updateProject(data)
        .then(({ success }) => {
          if (success) {
            this.$message.success('修改项目成功')
            this.getProjectList()
            this.visible = false
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    closeModal () {
      this.visible = false
    },
    removeProject ({ id }) {
      const that = this
      this.$confirm({
        content: '是否删除该项目？',
        onOk () {
          removeProject({
            id
          }).then(({ data }) => {
            that.$message.success('删除项目成功')
            that.getProjectList()
          })
        }
      })
    },
    goProjectDetail ({ id }) {
      this.$router.push({
        name: 'ProjectDetail',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add-project-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 201px;
  background: none;
  border: 1px dashed #ccc;
}
/deep/
  .antd-pro-components-standard-form-row-index-standardFormRow
  .antd-pro-components-standard-form-row-index-label {
  margin-top: 4px;
}
/deep/
  .antd-pro-components-standard-form-row-index-standardFormRow.antd-pro-components-standard-form-row-index-standardFormRowGrid
  .ant-form-item-label {
  margin-top: 4px;
}
/deep/ .ant-card-actions {
  li {
    margin: 0;
    div {
      padding: 12px 0;
    }
  }
  > li:not(:last-child) {
    border-right: none;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 12px;
      right: 0;
      width: 1px;
      height: calc(100% - 24px);
      background: #e8e8e8;
    }
  }
}
.project-header {
  display: flex;
  justify-content: space-between;
}
.project-title {
  font-size: 16px;
  font-weight: bold;
}
.project-stage {
  margin-right: 0;
}
</style>
