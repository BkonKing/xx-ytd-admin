<template>
  <a-card :bordered="false" title="基础信息" style="margin-top: 24px">
    <a-descriptions :column="3">
      <a-descriptions-item label="供应商ID">
        {{ data.idv || '--' }}
      </a-descriptions-item>
      <a-descriptions-item label="供应商名称">
        {{ data.supplierName || '--' }}
      </a-descriptions-item>
      <a-descriptions-item label="类型">
        {{ data.supplierTypeName || '--' }}
      </a-descriptions-item>
      <a-descriptions-item label="联系人">
        <span style="margin-right: 10px">{{ data.contactsMen }}</span>
        <span>{{ data.contactsMobile }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="统一社会信用代码">
        {{ data.socialCode  || '--'}}
      </a-descriptions-item>
      <a-descriptions-item label="法人代表">
        {{ data.legalPerson  || '--'}}
        <a-button
          v-if="data.legalPersonPzNum > 0"
          type="link"
          @click="previewImage(data.legalPersonPz)"
          >查看</a-button
        >
      </a-descriptions-item>
      <a-descriptions-item label="供应物料" :span="3">
        {{ data.materialName  || '--'}}
      </a-descriptions-item>
      <a-descriptions-item label="成立日期">
        {{ data.createDate  || '--'}}
      </a-descriptions-item>
      <a-descriptions-item label="营业期限">
        {{ data.businessTerm  || '--'}}
      </a-descriptions-item>
      <a-descriptions-item label="营业执照">
        {{ data.licensePzNum }}张
        <a-button type="link" @click="previewImage(data.licensePz)"
          >查看</a-button
        >
      </a-descriptions-item>
      <a-descriptions-item label="注册资金">
        {{ data.registeredCapital  || '--'}}
      </a-descriptions-item>
      <a-descriptions-item label="资质证件" :span="2">
        {{ data.qualificationsPzNum }}张
        <a-button type="link" @click="previewImage(data.qualificationsPz)"
          >查看</a-button
        >
      </a-descriptions-item>
      <a-descriptions-item label="注册地址" :span="3">
        {{ data.registeredAddress  || '--'}}
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    previewImage (images) {
      this.$viewerApi({
        images
      })
    }
  }
}
</script>

<style></style>
