import cloneDeep from 'lodash.clonedeep'
import {
  STable
} from '@/components'
import './combined-table.less'

export default {
  components: {
    STable
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    footerData: {
      type: Array,
      default: () => []
    },
    scroll: {
      type: Object,
      default: null
    },
    data: {
      type: Function,
      required: true
    },
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    }
  },
  watch: {
    footerData (val) {
      if (val && val.length) {
        setTimeout(() => {
          var ele = document.getElementsByClassName('ant-table-body')[1]
          var table = document.getElementsByClassName('ant-table-body')[0]
          ele.addEventListener('scroll', function (e) {
            table.scrollLeft = ele.scrollLeft || 0
          })
        }, 10)
      }
    }
  },
  methods: {
    refresh (bool = false) {
      this.$refs.table.refresh(bool)
    },
    clearSelected () {
      this.$refs.table.clearSelected()
    }
  },
  render () {
    const columns = this.$props.columns
    const scroll = this.$props.scroll
    const footerData = this.$props.footerData
    const data = this.$props.data
    const alert = this.$props.alert
    const rowSelection = this.$props.rowSelection
    const footerColumns = cloneDeep(this.$props.columns).map((obj, index) => {
      index === 0 && (obj.class = 'first-td')
      obj.fixed && delete obj.fixed
      obj.sorter && delete obj.sorter
      // 如果有removeCustom，则删除customRender
      obj.removeFooterCustom && delete obj.customRender
      return obj
    })

    const table = footerData && footerData.length ? <template slot="footer"><a-table
      class="table-footer"
      size="default"
      rowKey="id"
      tableLayout="fixed"
      columns={footerColumns}
      dataSource={footerData}
      scroll={scroll}
      pagination={false}
      rowSelection={rowSelection ? {} : null}
      showHeader={false}
    >
    </a-table></template> : ''
    return (<s-table
      ref="table"
      size="default"
      rowKey="id"
      tableLayout="fixed"
      class="combined-table"
      {...{ scopedSlots: { ...this.$scopedSlots } }}
      data={data}
      alert={alert}
      rowSelection={rowSelection}
      columns={columns}
      scroll={scroll}
    >
      {table}
    </s-table>)
  }
}
