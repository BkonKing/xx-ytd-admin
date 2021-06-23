<template>
  <a-card :bordered="false" title="基础信息" style="margin-top: 24px">
    <a-descriptions :column="3">
      <a-descriptions-item label="供应商ID">XX 服务</a-descriptions-item>
      <a-descriptions-item label="供应商名称">XX 服务</a-descriptions-item>
      <a-descriptions-item label="类型">X</a-descriptions-item>
      <a-descriptions-item label="联系人">X</a-descriptions-item>
      <a-descriptions-item label="统一社会信用代码">X</a-descriptions-item>
      <a-descriptions-item label="法人代表"
        >X<a-button type="link">查看</a-button></a-descriptions-item
      >
      <a-descriptions-item label="供应物料" :span="3">X</a-descriptions-item>
      <a-descriptions-item label="成立日期">X</a-descriptions-item>
      <a-descriptions-item label="营业期限">X</a-descriptions-item>
      <a-descriptions-item label="营业执照"
        >X<a-button type="link">查看</a-button></a-descriptions-item
      >
      <a-descriptions-item label="注册资金">项目名称</a-descriptions-item>
      <a-descriptions-item label="资质证件" :span="2">
        2017-07-07
        <a-button type="link">查看</a-button>
      </a-descriptions-item>
      <a-descriptions-item label="注册地址" :span="3">
        请于两个工作日内确认
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script>
export default {}
</script>

<style></style>
