<template>
  <a-form-model :model="form" ref="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules='rules'>
    <a-form-model-item label="登录账号" prop="account">
      <a-input
        v-model="form.account"
        @blur="setAccount"
        :maxLength="20"
        placeholder="请输入2~20个中文、英文或数字"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="登录密码" prop="password">
      <a-input
        v-model="form.password"
        @blur="setPasswd"
        :maxLength="18"
        placeholder="请输入6~18个英文、数字，区分大小写"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="选择角色" prop="roleId">
      <a-tree-select
      v-model="form.roleId"
        show-search
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="请选择"
        allow-clear
        tree-default-expand-all
      >
        <a-tree-select-node key="0-1" value="parent 1" title="parent 1">
          <a-tree-select-node key="0-1-1" value="parent 1-0" title="parent 1-0">
            <a-tree-select-node
              key="random"
              :selectable="false"
              value="leaf1"
              title="my leaf"
            />
            <a-tree-select-node key="random1" value="leaf2" title="your leaf" />
          </a-tree-select-node>
          <a-tree-select-node
            key="random2"
            value="parent 1-1"
            title="parent 1-1"
          >
            <a-tree-select-node key="random3" value="sss">
              <b slot="title" style="color: #08c">sss</b>
            </a-tree-select-node>
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
    </a-form-model-item>
    <a-form-model-item label="真实姓名" prop="realName">
      <a-input v-model="form.realName" :maxLength="10"  @blur="setName" placeholder="请输入1~10个字符"></a-input>
    </a-form-model-item>
    <a-form-model-item label="手机号">
      <a-input v-model="form.mobile" :maxLength="11" oninput="value=value.replace(/[^0-9]/g,'')"></a-input>
    </a-form-model-item>
  </a-form-model>
</template>

<script>

export default {
  name: 'addForm',
  props: {
    record: {
      type: Object,
      default: null

    }
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      treeExpandedKeys: [],
      form: {
        account: '', // 是varchar人员登录账户
        password: '', // 否varchar登录密码
        realName: '', // 否varchar姓名
        mobile: '', // 否varchar手机号
        roleId: '' // 是int权限角色ID
      },
      rules: {
        account: [{ required: true, message: '请输入登录账号', trigger: 'change' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        realName: [{ required: true, message: '请输入真实姓名', trigger: 'change' }]
      }
    }
  },
  mounted () {

  },
  methods: {
    setName () {
      if (this.form.realName !== '') {
        if (this.form.realName.length < 1) {
          this.$message.error('请输入正确的姓名')
        }
      }
    },
    // 设置账号
    setAccount (e) {
      if (this.form.account !== '') {
        if (this.form.account.length < 2) {
          this.$message.error('请输入正确的账号')
        }
      }
      // console.log(e.target.value)
      e.target.value = e.target.value.replace(
        /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, ''
      )
    },
    // 设置密码
    setPasswd (e) {
      if (this.form.password !== '') {
        if (this.form.password.length < 6) {
          this.$message.error('请输入正确的密码')
        }
      }
      e.target.value = e.target.value.replace(/[^\a-\z\A-\Z0-9]/g, '')
    },
    onOk () {
      this.$refs.form.validate(result => {
        if (result) {
          this.$message.success('验证成功')
        } else {
          this.$message.error('验证失败')
        }
      })
    },
    onCancel () {
      console.log('监听了 modal cancel 事件')
      return new Promise(resolve => {
        resolve(true)
      })
    }
    // handleSubmit () {
    //   const {
    //     form: { validateFields }
    //   } = this
    //   this.visible = true
    //   validateFields((errors, values) => {
    //     if (!errors) {
    //       console.log('values', values)
    //     }
    //   })
    // }
  }
}
</script>
