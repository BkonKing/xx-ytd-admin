<template>
  <div class="editContent">
    <a-card>
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="消息类型">
          {{ info.messageName }}
        </a-form-model-item>
        <a-form-model-item label="标签说明">
          <div class="box">
            <div class="item"><span>项目名称:</span><span>$project$</span></div>
            <div class="item"><span>订单编号:</span><span>$orderId$</span></div>
            <div class="item"><span>合同编号:</span><span>$contractId$</span></div>
            <div class="item"><span>合同名称:</span><span>$contractName$</span></div>
            <div class="item"><span>合同金额:</span><span>$contractMoney$</span></div>
            <div class="item"><span>合同结束日期:</span><span>$contractEndtime$</span></div>
            <div class="item">
              <span>供应商编号:</span><span>$supplierId$</span>
            </div>
            <div class="item">
              <span>供应商名称:</span><span>$supplier$</span>
            </div>
            <div class="item"><span>审核时间:</span><span>$auditTime$</span></div>
            <div class="item"><span>审核超时时间:</span><span>$auditTimeout$</span></div>
            <div class="item"><span>操作者:</span><span>$operator$</span></div>
          </div>
        </a-form-model-item>
        <div class="title">站内消息</div>
        <a-form-model-item label="消息标题" prop="webTitle">
          <a-input
            v-model="form.webTitle"
            :maxLength="20"
            style="width:440px"
          ></a-input>
          <div style="color: rgba(0, 0, 0, 0.447);">限2~20个字符</div>
        </a-form-model-item>
        <a-form-model-item label="内容模板" prop="webMessageTemp">
          <a-textarea
            v-model="form.webMessageTemp"
            class="textarea"
            :maxLength="200"
            placeholder="请输入"
            auto-size
          />
          <div style="textAlign: right;width:440px">
            {{ form.webMessageTemp.length }} / 200
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <template slot="label">
            <span>
              默认通知用户
              <a-tooltip>
                <template slot="title">
                  仅通知与本人相关的信息
                </template>
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
          </template>
            <div>{{info.webSendName}}</div>
        </a-form-model-item>
        <a-form-model-item>
          <template slot="label">
            <span>
              额外通知用户
              <a-tooltip>
                <template slot="title">
                  通知所有的信息
                </template>
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
          </template>
          <a-select
            v-model="webIds"
            mode="multiple"
            style="width:440px"
            placeholder="请选择"
            option-label-prop="label"
          >
            <a-select-option
              v-for="(item, index) in tzList"
              :key="index"
              :value="item.id"
              :label="item.realName"
            >
              {{ item.realName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <div class="title">微信公众号</div>
        <a-form-model-item label="模板标题">流程代办提醒</a-form-model-item>
        <a-form-model-item label="内容模板">
          <div class="inputBox">
            <a-form-model-item
              label="流程编号"
              prop="lcbh"
              :rules="{ required: true, message: '请填写 ', trigger: 'change' }"
            >
              <a-textarea
                v-model="form.lcbh"
                placeholder="请输入"
                auto-size
              />
            </a-form-model-item>
            <a-form-model-item
              label="流程名称"
              prop="lcmc"
              :rules="{ required: true, message: '请填写 ', trigger: 'change' }"
            >
              <a-textarea
                v-model="form.lcmc"
                placeholder="请输入"
                auto-size
              />
            </a-form-model-item>

            <a-form-model-item
              label="流程摘要"
              prop="lcmc"
              :rules="{ required: true, message: '请填写 ', trigger: 'change' }"
            >
              <a-textarea
                v-model="form.lczy"
                placeholder="请输入"
                auto-size
              />
            </a-form-model-item>
            <a-form-model-item
              label="备注"
              prop="lcbz"
              :rules="{ required: true, message: '请填写 ', trigger: 'change' }"
            >
              <a-textarea
                v-model="form.lcbz"
                placeholder="请输入"
                auto-size
              />
            </a-form-model-item>
          </div>
        </a-form-model-item>
             <a-form-model-item>
          <template slot="label">
            <span>
              默认通知用户
              <a-tooltip>
                <template slot="title">
                  仅通知与本人相关的信息
                </template>
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
          </template>
            <div>{{info.wxSendName}}</div>
        </a-form-model-item>
        <a-form-model-item>
            <template slot="label">
            <span>
              额外通知用户
              <a-tooltip>
                <template slot="title">
                  通知所有的信息
                </template>
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
          </template>
          <a-select
            v-model="wxIds"
            mode="multiple"
            style="width:440px"
            placeholder="请选择"
            option-label-prop="label"
          >
            <a-select-option
              v-for="(item, index) in tzList"
              :key="index"
              :value="item.id"
              :label="item.realName"
            >
              {{ item.realName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <div class="btn">
        <a-button type="primary" @click="save" :disabled="bol">保存</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import { toSetInfo, toTemplateSet, toGetAllAdminList } from '@/api/basicSet'
export default {
  data () {
    return {
      info: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      // webTagArr: [], // 站内消息通知用户
      // wxTagArr: [], // 微信消息通知用户
      tzList: [],
      id: '', // 是intID
      form: {
        webTitle: '', // 是varchar站内消息标题
        webMessageTemp: '', // 是varchar站内消息模版
        lcbh: '',
        lcmc: '',
        fqsj: '',
        lczy: '',
        lcbz: ''
      },
      webIds: undefined, // 否varchar站内消息通知用户：1,3,5
      wxMessageTemp: '', // 是varchar微信公众号消息模版
      wxIds: undefined, // 否varchar微信公众号通知用户：1,3,5

      rules: {
        webTitle: [{ required: true, message: '请填写', trigger: 'change' }],
        webMessageTemp: [{ required: true, message: '请填写', trigger: 'change' }]
      },
      bol: true
    }
  },
  watch: {
    form: {
      handler () {
        this.bol = false
      },
      deep: true
    },
    webIds: {
      handler () {
        this.bol = false
      },
      deep: true
    },
    wxIds: {
      handler () {
        this.bol = false
      },
      deep: true
    }
  },
  methods: {
    save () {
      console.log(this.$refs.form)
      this.$refs.form.validate(result => {
        if (result) {
          const obj = {}
          obj.lcbh = this.form.lcbh
          obj.lcmc = this.form.lcmc
          obj.fqsj = this.form.fqsj
          obj.lczy = this.form.lczy
          obj.lcbz = this.form.lcbz

          toTemplateSet({
            id: this.id,
            webTitle: this.form.webTitle,
            webMessageTemp: this.form.webMessageTemp,
            webIds: this.webIds.join(','),
            wxMessageTemp: obj,
            wxIds: this.wxIds.join(',')
          }).then(res => {
            this.$message.success(res.message)
            this.bol = true
          })
        }
      })
    },
    // 获取详情
    getDetail () {
      toSetInfo({ id: this.id }).then(res => {
        this.info = res.data
        // this.webTagArr = res.data.webIds
        // this.wxTagArr = res.data.wxIds
        this.form.webTitle = res.data.webTitle
        this.form.webMessageTemp = res.data.webMessageTemp || ''
        const wxMessageTemp = res.data.wxMessageTemp || {}
        this.form.fqsj = wxMessageTemp.fqsj
        this.form.lcbh = wxMessageTemp.lcbh
        this.form.lcbz = wxMessageTemp.lcbz
        this.form.lcmc = wxMessageTemp.lcmc
        this.form.lczy = wxMessageTemp.lczy
        this.webIds = res.data.webIds.map(item => {
          return item.adminId
        })

        this.wxIds = res.data.wxIds.map(item => {
          return item.adminId
        })
        this.$nextTick(() => {
          this.bol = true
        })
        // console.log('this.wxIds', this.wxIds)
      })
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.getDetail()
    }
    toGetAllAdminList().then(({ data }) => {
      this.tzList = data
      console.log('获取额外通知列表', data)
    })
  }
}
</script>

<style lang="less" scoped>
.editContent {
  .box {
    display: flex;
    width: 420px;
    flex-wrap: wrap;
    .item {
      width: 50%;
    }
  }
  .title {
    margin-left: 150px;
    font-family: "PingFang SC Bold", "PingFang SC";
    font-weight: 650;
    font-style: normal;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.847);
    line-height: 24px;
    margin-bottom: 24px;
  }
  .textarea {
    overflow-y: visible;
    min-height: 100px;
    width: 440px;
  }
  .btn {
    margin-left: 268px;
  }
  .inputBox {
    border: 1px solid rgba(217, 217, 217, 1);
    width: 440px;
    padding-left: 10px;

    textarea {
      width: 356px;
      border: none;
      outline: none;
      box-shadow: none;
      resize: none;
    }
    /deep/.textarea:focus {
      outline: none;
      border: none;
      box-shadow: none;
    }
  }
}
</style>
