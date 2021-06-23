<template>
  <a-card style="margin-top: 24px" :bordered="false">
    <a-row type="flex">
      <a-col flex="1">
        <info title="已付款" value="￥5000" :bordered="true" />
      </a-col>
      <a-col flex="1">
        <info title="未付款" value="￥5000" :bordered="true" />
      </a-col>
      <a-col flex="1">
        <info title="已收票" value="￥5000" :bordered="true" />
      </a-col>
      <a-col flex="1">
        <info title="未收票" value="￥5000" />
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import Info from '../../project/components/Info'
export default {
  name: 'statistics',
  components: {
    Info
  }
}
</script>

<style></style>
