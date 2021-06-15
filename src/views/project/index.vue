<template>
  <page-header-wrapper>
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-form :form="form" layout="inline">
        <standard-form-row title="参与公司" block style="padding-bottom: 11px;">
          <a-form-item>
            <tag-select v-model="tagActive">
              <tag-select-option
                v-for="tag in tagList"
                :key="tag.value"
                :value="tag.value"
                >{{ tag.text }}</tag-select-option
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
                <a-select
                  style="max-width: 200px; width: 100%;"
                  mode="multiple"
                  placeholder="ID、名称"
                  @change="handleChange"
                >
                  <a-select-option value="lisa">王昭君</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="10" :sm="10" :xs="24">
              <a-form-item
                :wrapper-col="{ sm: { span: 16 }, xs: { span: 24 } }"
                label="项目阶段"
              >
                <a-select
                  style="max-width: 200px; width: 100%;"
                  placeholder="请选择"
                >
                  <a-select-option value="good">优秀</a-select-option>
                  <a-select-option value="normal">普通</a-select-option>
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
            @click="addProject"
          >
            <a-icon type="plus"></a-icon>新增项目
          </a-card>
          <a-card v-else :body-style="{ paddingBottom: 20 }" hoverable>
            <a-card-meta :title="item.title">
              <template slot="avatar">
                <a-avatar size="large" :src="item.avatar" />
              </template>
            </a-card-meta>
            <template slot="actions">
              <span>编辑</span>
              <span>删除</span>
            </template>
            <div class="">
              <card-info active-user="100" new-user="999"></card-info>
            </div>
          </a-card>
        </a-list-item>
      </a-list>
    </div>

    <a-modal
      :title="title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <project-form></project-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import {
  TagSelect,
  StandardFormRow
  /* Ellipsis, AvatarList */
} from '@/components'
import CardInfo from './components/CardInfo'
import projectForm from './components/ProjectForm.vue'
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
      form: this.$form.createForm(this),
      tagActive: [],
      tagList: [
        {
          value: 'Category1',
          text: '类目1'
        },
        {
          value: 'Category2',
          text: '类目2'
        },
        {
          value: 'Category3',
          text: '类目3'
        },
        {
          value: 'Category4',
          text: '类目4'
        },
        {
          value: 'Category5',
          text: '类目5'
        },
        {
          value: 'Category6',
          text: '类目6'
        }
      ],
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
    this.getList()
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    getList () {
      const data = [{}, {}, {}, {}, {}, {}]
      this.data = [{}, ...data]
      this.loading = false
    },
    addProject () {
      this.title = '新增项目'
      this.showModal()
    },
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.ModalText = 'The modal will be closed after two seconds'
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
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
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
.ant-pro-pages-list-projects-cardList {
  margin-top: 24px;

  /deep/ .ant-card-meta-title {
    margin-bottom: 4px;
  }

  /deep/ .ant-card-meta-description {
    height: 44px;
    overflow: hidden;
    line-height: 22px;
  }

  .cardItemContent {
    display: flex;
    height: 20px;
    margin-top: 16px;
    margin-bottom: -4px;
    line-height: 20px;

    > span {
      flex: 1 1;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }

    /deep/ .ant-pro-avatar-list {
      flex: 0 1 auto;
    }
  }
}
</style>
