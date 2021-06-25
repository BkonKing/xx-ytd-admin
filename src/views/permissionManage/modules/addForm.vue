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
      type="password"
        v-model="form.password"
        @blur="setPasswd"
        :maxLength="18"
        placeholder="请输入6~18个英文、数字，区分大小写"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="选择角色" prop="roleId">
     <a-tree-select
    v-model="form.roleId"
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    placeholder="请选择"
     :replaceFields="{ key: 'id',value:'id',title:'roleName' }"
    tree-default-expand-all
  >
    <span  slot="title" slot-scope="{title }" style="color: #08c">
    {{ title }}
    </span>
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
import { toGetRoles, toAddAdmin, toUpdateAdmin } from '@/api/permissionManage'
import bus from '@/utils/bus'

export default {
  name: 'addForm',
  props: {
    record: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      treeExpandedKeys: [],
      treeData: [],
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
    if (this.record) {
      this.form = this.record
    }
  },

  methods: {

    // 获取角色
    async getRole () {
      const res = await toGetRoles()
      this.treeData = res.data
      console.log('获取角色', res)
    },
    // 设置姓名
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
      // console.log('监听了 modal ok 事件')
      return new Promise(resolve => {
        this.$refs.form.validate(result => {
          if (result) {
            if (this.mode === 'add') {
              toAddAdmin(this.form).then(() => {
                this.$message.success('新增成功')
                bus.$emit('refresh', 'add')
              })
            } else {
              toUpdateAdmin(this.form).then(() => {
                this.$message.success('编辑成功')
                bus.$emit('refresh', 'mode')
              })
            }
            resolve(true)
          } else {
            this.$message.error('验证失败')
          }
        })
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
  },
  created () {
    this.getRole()
  }
}
</script>
