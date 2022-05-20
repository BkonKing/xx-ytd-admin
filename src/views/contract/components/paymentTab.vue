<template>
  <div>
    <payment-table :id="id" :unpaid="data.orderUnPayMoney" @change="handleChange"></payment-table>
    <invoice-table :id="id" :unpaid="data.orderUnInvoicedMoney" @change="handleChange"></invoice-table>
  </div>
</template>

<script>
import PaymentTable from './PaymentTable'
import InvoiceTable from './InvoiceTable'
export default {
  name: 'paymentTab',
  components: { PaymentTable, InvoiceTable },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleChange () {
      this.$emit('change')
    }
  }
}
</script>

<style></style>
