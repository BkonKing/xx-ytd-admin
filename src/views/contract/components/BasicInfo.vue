<template>
  <a-card title="基础信息" :bordered="false" style="margin-top: 24px;">
    <a-descriptions>
      <a-descriptions-item label="合同单号">
        {{ data.contractNo }}
      </a-descriptions-item>
      <a-descriptions-item label="合同名称">
        {{ data.contractName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属项目">
        {{ data.projectName }}
      </a-descriptions-item>
      <a-descriptions-item label="合同状态">
        {{ data.contractStatusv }}
      </a-descriptions-item>
      <a-descriptions-item label="合同类型">
        {{ data.categoryName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属公司">
        {{ data.companyName }}
      </a-descriptions-item>
      <a-descriptions-item label="合同有效期">
        {{ data.startDate }} ~ {{ data.endDate }}
      </a-descriptions-item>
      <a-descriptions-item label="签订日期">
        {{ data.signDate }}
      </a-descriptions-item>
      <a-descriptions-item label="合同文件">
        {{ data.contractPzNum }}个文件<a
          v-if="data.contractPzNum > 0"
          class="two-blank"
          @click="previewImage"
          >查看</a
        >
      </a-descriptions-item>
      <a-descriptions-item label="合同金额">
        ￥{{ data.contractMoney }}
      </a-descriptions-item>
      <a-descriptions-item label="合同总量">
        {{ data.contractTotal }}
      </a-descriptions-item>
      <a-descriptions-item label="税率">
        {{ data.taxRate }}
      </a-descriptions-item>
      <a-descriptions-item label="供应商">
        {{ data.supplierName }}
      </a-descriptions-item>
      <a-descriptions-item label="结算方式">
        {{ data.settleTypeName }}
      </a-descriptions-item>
      <a-descriptions-item label="付款方式">
        {{ data.payTypeName }}
      </a-descriptions-item>
      <a-descriptions-item label="物料" :span="3">
        {{ data.materialName }}
      </a-descriptions-item>
      <a-descriptions-item label="备注" :span="3">
        {{ data.remarks || "--" }}
      </a-descriptions-item>
    </a-descriptions>
    <a-modal
      title="合同文件"
      :visible="previvewVisible"
      :footer="null"
      @cancel="previvewVisible = false"
    >
      <div class="ant-upload-list ant-upload-list-picture">
        <div
          v-for="(file, index) in data.contractPz"
          :key="index"
          class="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture"
        >
          <div class="ant-upload-list-item-info">
            <span>
              <a
                class="ant-upload-list-item-thumbnail"
                @click="openHref(file.url)"
              >
                <img
                  v-if="isImg(file.name)"
                  :src="file.url"
                  :alt="file.name"
                  class="ant-upload-list-item-image"/>
                <a-icon
                  v-else
                  class="anticon anticon-file ant-upload-list-item-icon"
                  type="file"/></a
              ><a
                :title="file.name"
                @click="openHref(file.url)"
                class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                >{{ file.name }}</a
              >
              <span class="ant-upload-list-item-card-actions picture">
                <a :href="file.url" :download="file.name"
                  ><a-icon type="download"></a-icon
                ></a>
              </span>
            </span>
          </div>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
export default {
  name: 'BasicInfo',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      previvewVisible: false
    }
  },
  methods: {
    previewImage () {
      this.previvewVisible = true
    },
    openHref (url) {
      if (url.indexOf('.doc') > 0 || url.indexOf('.docx') > 0) {
        window.open(
          `https://view.officeapps.live.com/op/view.aspx?src=${url}`,
          '_target'
        )
        return
      }
      window.open(url, '_target')
    },
    // 是否是图片
    isImg (val) {
      var reg = /(.png)|(.jpg)/g
      return reg.test(val)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-upload-list-item:first-child {
  margin-top: 0;
}
/deep/ .ant-descriptions-item {
  > span {
    vertical-align: top;
  }
}
/deep/ .ant-descriptions-view tbody > tr:last-child {
  .ant-descriptions-item {
    padding-bottom: 0;
    .ant-descriptions-item-content {
      width: calc(100% - 70px);
    }
  }
}
</style>
