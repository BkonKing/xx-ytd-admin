<template>
  <div class="checkSet">
    <a-card>
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="title">订单审核</div>
        <a-form-model-item label="审核处理时间">
          <a-input style="width:88px"></a-input>
          <span style="marginLeft:10px">小时内</span>
          <div>需要在设定时间内进行审核处理，超时则提醒</div>
        </a-form-model-item>
        <a-form-model-item label="审核人员">
          <div>同一级审核，多人时，任意一人同意即可</div>
          <div class="checkInputs">
            <div class="item">
              <a-input style="width:88px"></a-input>
              <span style="padding:0 10px">--</span>
              <a-select
                mode="multiple"
                style="width: 330px"
                placeholder="select one country"
                option-label-prop="label"
              >
                <a-select-option value="china" label="China">
                  <span role="img" aria-label="China">
                    🇨🇳
                  </span>
                  China (中国)
                </a-select-option>
                <a-select-option value="usa" label="USA">
                  <span role="img" aria-label="USA">
                    🇺🇸
                  </span>
                  USA (美国)
                </a-select-option>
                <a-select-option value="japan" label="Japan">
                  <span role="img" aria-label="Japan">
                    🇯🇵
                  </span>
                  Japan (日本)
                </a-select-option>
                <a-select-option value="korea" label="Korea">
                  <span role="img" aria-label="Korea">
                    🇰🇷
                  </span>
                  Korea (韩国)
                </a-select-option>
              </a-select>
              <a-icon type="minus-circle" class="icon" />
            </div>
            <div class="item">
              <a-input style="width:88px"></a-input>
              <span style="padding:0 10px">--</span>
              <a-select
                mode="multiple"
                style="width: 330px"
                placeholder="select one country"
                option-label-prop="label"
              >
                <a-select-option value="china" label="China">
                  <span role="img" aria-label="China">
                    🇨🇳
                  </span>
                  China (中国)
                </a-select-option>
                <a-select-option value="usa" label="USA">
                  <span role="img" aria-label="USA">
                    🇺🇸
                  </span>
                  USA (美国)
                </a-select-option>
                <a-select-option value="japan" label="Japan">
                  <span role="img" aria-label="Japan">
                    🇯🇵
                  </span>
                  Japan (日本)
                </a-select-option>
                <a-select-option value="korea" label="Korea">
                  <span role="img" aria-label="Korea">
                    🇰🇷
                  </span>
                  Korea (韩国)
                </a-select-option>
              </a-select>
              <a-icon type="minus-circle" class="icon" />
            </div>
          </div>
          <div class="addArea">
            +添加
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  }
}
</script>

<style lang="less" scoped>
.checkSet {
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
  .checkInputs {
    .item {
      display: flex;
      align-items: center;
      .icon {
        margin-left: 10px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.427450980392157);
      }
    }
  }
  .addArea{
    width: 440px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border: 1px dashed #e9e9e9;
  }
}
</style>
