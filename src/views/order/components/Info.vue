<template>
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
</template>

<script>
import { TImage } from '@/components'
export default {
  name: 'OrderInfo',
  components: {
    TImage
  },
  data () {
    return {
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

<style></style>
