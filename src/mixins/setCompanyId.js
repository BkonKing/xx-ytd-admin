export default {
  created () {
    this.setcompanyId()
  },
  methods: {
    reset () {
      this.queryParam = { companyId: '' }
      this.setcompanyId()
      this.$refs.table.refresh(true)
    },
    setcompanyId () {
      this.isParentCompany && this.$set(this.queryParam, 'companyId', this.userCompanyId)
    }
  }
}
