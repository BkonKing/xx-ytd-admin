<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar v-if="info" size="large" :src="info.adminInfo.avatar" />
        </div>
        <div class="content">
          <div class="content-title">
            <!-- {{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span> -->
            <span v-if="info">{{info.adminInfo.realName}}，</span>祝你开心每一天！
          </div>
          <div>{{info.department}}</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="待审核订单" :value="info.dsOrderNum" />
        </div>
        <div class="stat-item">
          <a-statistic title="待审核合同" :value="info.dsContractNum" />
        </div>
        <div class="stat-item">
          <a-statistic title="待审核供应商" :value="info.dsSupplierNum" />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="进行中的项目"
            :body-style="{ padding: 0 }"
          >
            <a slot="extra" @click="$router.push('/project/index')">全部项目</a>
            <div v-if="info != ''">
              <a-card-grid
                class="project-card-grid"
                :key="i"
                v-for="(item, i) in info.project"
              >
                <a-card :bordered="false" style="cursor: pointer;" :body-style="{ padding: 0 }" @click="$router.push('/project/detail?id='+item.projectId)">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar size="small" :src="item.cover" />
                      <a class="projectName">{{ item.projectName }}</a>
                    </div>
                    <div slot="description" class="card-description">
                      {{ item.stage }}
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <div class="item">
                      <div class="title">公司</div>
                      <div class="num">{{item.relationCompanyNum}}</div>
                    </div>
                    <div class="item">
                      <div class="title">合同</div>
                      <div class="num">{{item.relationContractNum}}</div>
                    </div>
                    <div class="item">
                      <div class="title">订单</div>
                      <div class="num">{{item.relationOrderNum}}</div>
                    </div>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card :loading="loading" title="动态" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in 3">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.dyAvatar" />
                  <div slot="title">
                    <span>林冬冬在</span
                    >&nbsp; 在&nbsp;<a href="#">项目名称</a
                    >&nbsp; 审核了&nbsp;
                    <a href="#">合同名称</a>
                  </div>
                  <div slot="description">5分钟</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            title="便捷导航"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div class="item-group">
              <a v-for="(item,index) in info.navigation" :key='index' @click="openTab(item)">{{item}}</a>

            </div>
          </a-card>
          <a-card class="card3" :loading="loading"  :bordered="false">
            <template #title>
              <div class="title">
                <span class='txt'>待办通知</span>
                <a-button type="link" @click="$router.push('/MessageCenter/index')">更多</a-button>
              </div>
            </template>
            <div class="members">
              <div class="item" v-for="(item,index) in 5" :key='index'>
                [通知] 内容内容内容内容内容
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from 'xx-ant-design-vue-pro-layout'
import { toWorkbench } from '@/api/dashboard'
export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},

      projects: [],
      loading: true,
      radarLoading: true,
      activities: [],
      teams: [],

      // data
      axis1Opts: {
        dataKey: 'item',
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }
      },
      axis2Opts: {
        dataKey: 'score',
        line: null,
        tickLine: null,
        grid: {
          type: 'polygon',
          lineStyle: {
            lineDash: null
          }
        }
      },
      scale: [
        {
          dataKey: 'score',
          min: 0,
          max: 80
        }
      ],
      axisData: [
        { item: '引用', a: 70, b: 30, c: 40 },
        { item: '口碑', a: 60, b: 70, c: 40 },
        { item: '产量', a: 50, b: 60, c: 40 },
        { item: '贡献', a: 40, b: 50, c: 40 },
        { item: '热度', a: 60, b: 70, c: 40 },
        { item: '引用', a: 70, b: 50, c: 40 }
      ],
      radarData: [],
      info: ''
    }
  },

  computed: {
    ...mapState({
      nickname: state => state.user.nickname,
      welcome: state => state.user.welcome
    }),
    currentUser () {
      return {
        name: 'Serati Ma',
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    // this.user = this.userInfo
    // this.avatar = this.userInfo.avatar

    // getRoleList().then(res => {
    //   // console.log('workplace -> call getRoleList()', res)
    // })

    // getServiceList().then(res => {
    //   // console.log('workplace -> call getServiceList()', res)
    // })
    toWorkbench().then(({ data }) => {
      this.info = data
      this.$nextTick(() => {
        this.loading = false
      })
      console.log('工作台数据', data)
    })
  },
  mounted () {
    // this.getProjects()
    // this.getActivity()
    // this.getTeams()
  },
  methods: {
    openTab (item) {
      if (item === '新增订单') {
        this.$router.push('/order/edit')
      } else if (item === '新增合同') {
        this.$router.push('/contract/edit')
      } else if (item === '新增供应商') {
        this.$router.push('/supplier/edit')
      }
    },
    getProjects () {
      this.$http.get('/list/search/projects').then(res => {
        this.projects = res.result && res.result.data
        this.loading = false
      })
    },
    getActivity () {
      this.$http.get('/workplace/activity').then(res => {
        this.activities = res.result
      })
    },
    getTeams () {
      this.$http.get('/workplace/teams').then(res => {
        this.teams = res.result
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./Workplace.less";

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    margin-left: 36px;
    overflow: hidden;
  }
  .projectName{
    font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le Regular', 'Microsoft Tai Le';
    font-weight: 700;
    font-style: normal;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.847058823529412);
    line-height: 24px;
  }

  .project-item {
    display: flex;
    // margin-top: 8px;
    // overflow: hidden;
    // font-size: 12px;
    // height: 20px;
    // line-height: 20px;
    .item {
      flex: 1;
      text-align: center;
      .title {
        font-family: "Microsoft Tai Le";
        font-weight: 400;
        color: rgba(0, 0, 0, 0.247058823529412);
        font-size: 12px;
      }
      .num {
        font-family: "Arial Negreta", "Arial Normal", "Arial";
        font-weight: 700;
        color: rgba(0, 0, 0, 0.647058823529412);
        font-size: 24px;
      }
    }
    // a {
    //   color: rgba(0, 0, 0, 0.45);
    //   display: inline-block;
    //   flex: 1 1 0;

    //   &:hover {
    //     color: #1890ff;
    //   }
    // }

    // .datetime {
    //   color: rgba(0, 0, 0, 0.25);
    //   flex: 0 0 auto;
    //   float: right;
    // }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}
/deep/ .ant-card-head-title{
  font-family: 'PingFang SC Bold', 'PingFang SC';
    font-weight: 650;
    font-style: normal;
    font-size: 16px;
    text-align: left;
    line-height: 24px;
}
.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;

  }
}

.members {
  // a {
  //   display: block;
  //   margin: 12px 0;
  //   line-height: 24px;
  //   height: 24px;

  //   .member {
  //     font-size: 14px;
  //     color: rgba(0, 0, 0, 0.65);
  //     line-height: 24px;
  //     max-width: 100px;
  //     vertical-align: top;
  //     margin-left: 12px;
  //     transition: all 0.3s;
  //     display: inline-block;
  //   }

  //   &:hover {
  //     span {
  //       color: #1890ff;
  //     }
  //   }
  // }
  .item{
    margin-bottom: 18px;
  }
}
.card3{
  .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }

}
</style>
