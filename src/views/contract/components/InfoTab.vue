<template>
  <div>
    <a-card title="基础信息" :bordered="false" style="margin-top: 24px;">
      <a-descriptions title="合同">
        <a-descriptions-item label="合同单号">1000000000</a-descriptions-item>
        <a-descriptions-item label="合同名称">已取货</a-descriptions-item>
        <a-descriptions-item label="所属项目">1234123421</a-descriptions-item>
        <a-descriptions-item label="合同状态">1234123421 </a-descriptions-item>
        <a-descriptions-item label="合同类型">1234123421 </a-descriptions-item>
        <a-descriptions-item label="所属公司">1234123421 </a-descriptions-item>
        <a-descriptions-item label="合同有效期"
          >1234123421
        </a-descriptions-item>
        <a-descriptions-item label="签订日期">1234123421 </a-descriptions-item>
        <a-descriptions-item label="合同照片">
          1234123421<a-button
            type="link"
            style="height: 21px;"
            @click="previewImage"
            >查看</a-button
          >
        </a-descriptions-item>
        <a-descriptions-item label="合同金额">1234123421 </a-descriptions-item>
        <a-descriptions-item label="合同总量">1234123421 </a-descriptions-item>
        <a-descriptions-item label="税率">1234123421 </a-descriptions-item>
        <a-descriptions-item label="供应商">1234123421 </a-descriptions-item>
        <a-descriptions-item label="结算方式">1234123421 </a-descriptions-item>
        <a-descriptions-item label="付款方式">1234123421 </a-descriptions-item>
        <a-descriptions-item label="物料" :span="3"
          >1234123421
        </a-descriptions-item>
        <a-descriptions-item label="备注" :span="3"
          >1234123421
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <log-list :load="logLoadData"></log-list>
  </div>
</template>

<script>
import { LogList } from '@/components'
import { getPermissions } from '@/api/manage'
export default {
  name: 'InfoTab',
  components: {
    LogList
  },
  data () {
    return {
      logLoadData: getPermissions
    }
  },
  methods: {
    previewImage () {
      this.$viewerApi({
        images: []
      })
    }
  }
}
</script>

<style></style>
