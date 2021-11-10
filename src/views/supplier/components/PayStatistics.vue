<template>
  <a-card :bordered="false">
    <a-row type="flex">
      <a-col flex="1">
        <info title="已付款" :value="`￥${data.paid}`" :bordered="true" />
      </a-col>
      <a-col flex="1">
        <info title="未付款" :value="`￥${data.unpaid}`" :bordered="true" />
      </a-col>
      <a-col flex="1">
        <info title="已开票" :value="`￥${data.invoiced}`" :bordered="true" />
      </a-col>
      <a-col flex="1">
        <info title="未开票" :value="`￥${data.notInvoiced}`" />
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import Info from '@/views/project/components/Info'
export default {
  components: {
    Info
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style></style>
