<template>
  <div>
    <a-card :bordered="false" title="审批进度" style="margin-top: 24px;">
      <a-steps
        class="check-tab-steps"
        :current="stepList.length - 1"
        progressDot
      >
        <a-step v-for="(step, index) in stepList" :key="index">
          <template v-slot:title>
            <span>{{ step.title }}</span>
          </template>
          <template v-slot:description>
            <div v-if="step.status !== 1">
              <div>{{ step.name }}</div>
              <div>{{ step.company }}</div>
              <div>{{ step.time }}</div>
            </div>
          </template>
        </a-step>
      </a-steps>
    </a-card>
    <a-card
      v-if="checkList && checkList.length"
      :bordered="false"
      title="审批信息"
      style="margin-top: 24px;"
    >
      <a-descriptions
        v-for="(checkInfo, index) in checkList"
        :key="index"
        :title="checkInfo.title"
      >
        <a-descriptions-item label="审核时间">1000000000</a-descriptions-item>
        <a-descriptions-item label="审核状态">已取货</a-descriptions-item>
        <a-descriptions-item label="审核人">1234123421</a-descriptions-item>
        <a-descriptions-item label="审核说明" :span="3">
          <div>{{ checkInfo.desc || "无" }}</div>
          <div style="margin-top: 10px;">
            <t-image :images="images"></t-image>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script>
import { TImage } from '@/components'
export default {
  name: 'CheckTab',
  components: {
    TImage
  },
  data () {
    return {
      stepList: [
        {
          title: '创建',
          name: '曲丽丽',
          company: '公司名称',
          time: '2016-12-12 12:32'
        },
        {
          title: '一审',
          name: '曲丽丽',
          company: '公司名称',
          time: '2016-12-12 12:32'
        },
        {
          title: '完成',
          name: '曲丽丽',
          company: '公司名称',
          time: '2016-12-12 12:32',
          status: 1
        }
      ],
      checkList: [
        {
          title: '一审',
          desc: '审核说明'
        },
        {
          title: '二审',
          desc: ''
        }
      ],
      images: [
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://img01.yzcdn.cn/vant/cat.jpeg',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F2c.zol-img.com.cn%2Fproduct%2F124_500x2000%2F748%2FceZOdKgDAFsq2.jpg&refer=http%3A%2F%2F2c.zol-img.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626591139&t=19a24ce6a5ebe97faed40ced934a8701'
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.check-tab-steps {
  justify-content: center;
}
/deep/ .ant-descriptions-item > span {
  vertical-align: top;
}
.check-tab-descriptions-item {
  /deep/ .ant-descriptions-item-label {
    width: 69.05px;
  }
  /deep/ .ant-descriptions-item-content{
    width: calc(100% - 80px);
  }
}
</style>
