<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-form-item
      :label="$t('form.basic-form.title.label')"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-input
        v-decorator="[
          'name',
          {
            rules: [
              { required: true, message: $t('form.basic-form.title.required') }
            ]
          }
        ]"
        name="name"
        :placeholder="$t('form.basic-form.title.placeholder')"
      />
    </a-form-item>
    <a-form-item
      :label="$t('form.basic-form.date.label')"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-range-picker
        name="buildTime"
        style="width: 100%"
        v-decorator="[
          'buildTime',
          {
            rules: [
              { required: true, message: $t('form.basic-form.date.required') }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      :label="$t('form.basic-form.goal.label')"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-textarea
        rows="4"
        :placeholder="$t('form.basic-form.goal.placeholder')"
        v-decorator="[
          'description',
          {
            rules: [
              { required: true, message: $t('form.basic-form.goal.required') }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      :label="$t('form.basic-form.standard.label')"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-textarea
        rows="4"
        :placeholder="$t('form.basic-form.standard.placeholder')"
        v-decorator="[
          'type',
          {
            rules: [
              {
                required: true,
                message: $t('form.basic-form.standard.required')
              }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      :label="$t('form.basic-form.client.label')"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-input
        :placeholder="$t('form.basic-form.client.placeholder')"
        v-decorator="[
          'customer',
          {
            rules: [
              { required: true, message: $t('form.basic-form.client.required') }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      :label="$t('form.basic-form.invites.label')"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      :required="false"
    >
      <a-input :placeholder="$t('form.basic-form.invites.placeholder')" />
    </a-form-item>
    <a-form-item
      :label="$t('form.basic-form.weight.label')"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      :required="false"
    >
      <a-input-number :min="0" :max="100" />
      <span> %</span>
    </a-form-item>
    <a-form-item
      :label="$t('form.basic-form.public.label')"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      :required="false"
      :help="$t('form.basic-form.label.help')"
    >
      <a-radio-group v-decorator="['target', { initialValue: 1 }]">
        <a-radio :value="1">{{ $t("form.basic-form.radio.public") }}</a-radio>
        <a-radio :value="2">{{
          $t("form.basic-form.radio.partially-public")
        }}</a-radio>
        <a-radio :value="3">{{ $t("form.basic-form.radio.private") }}</a-radio>
      </a-radio-group>
      <a-form-item v-show="form.getFieldValue('target') === 2">
        <a-select mode="multiple">
          <a-select-option value="4">{{
            $t("form.basic-form.option.A")
          }}</a-select-option>
          <a-select-option value="5">{{
            $t("form.basic-form.option.B")
          }}</a-select-option>
          <a-select-option value="6">{{
            $t("form.basic-form.option.C")
          }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form-item>
    <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
      <a-button htmlType="submit" type="primary">{{
        $t("form.basic-form.form.submit")
      }}</a-button>
      <a-button style="margin-left: 8px">{{
        $t("form.basic-form.form.save")
      }}</a-button>
    </a-form-item>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
const basic = {
  'form.basic-form.basic.title': 'Basic form',
  'form.basic-form.basic.description':
   'Form pages are used to collect or verify information to users, and basic forms are common in scenarios where there are fewer data items.',
  'form.basic-form.title.label': 'Title',
  'form.basic-form.title.placeholder': 'Give the target a name',
  'form.basic-form.title.required': 'Please enter a title',
  'form.basic-form.date.label': 'Start and end date',
  'form.basic-form.placeholder.start': 'Start date',
  'form.basic-form.placeholder.end': 'End date',
  'form.basic-form.date.required': 'Please select the start and end date',
  'form.basic-form.goal.label': 'Goal description',
  'form.basic-form.goal.placeholder': 'Please enter your work goals',
  'form.basic-form.goal.required': 'Please enter a description of the goal',
  'form.basic-form.standard.label': 'Metrics',
  'form.basic-form.standard.placeholder': 'Please enter a metric',
  'form.basic-form.standard.required': 'Please enter a metric',
  'form.basic-form.client.label': 'Client',
  'form.basic-form.label.tooltip': 'Target service object',
  'form.basic-form.client.placeholder':
    'Please describe your customer service, internal customers directly @ Name / job number',
  'form.basic-form.client.required': 'Please describe the customers you serve',
  'form.basic-form.invites.label': 'Inviting critics',
  'form.basic-form.invites.placeholder':
    'Please direct @ Name / job number, you can invite up to 5 people',
  'form.basic-form.weight.label': 'Weight',
  'form.basic-form.weight.placeholder': 'Please enter weight',
  'form.basic-form.public.label': 'Target disclosure',
  'form.basic-form.label.help': 'Customers and invitees are shared by default',
  'form.basic-form.radio.public': 'Public',
  'form.basic-form.radio.partially-public': 'Partially public',
  'form.basic-form.radio.private': 'Private',
  'form.basic-form.publicUsers.placeholder': 'Open to',
  'form.basic-form.option.A': 'Colleague A',
  'form.basic-form.option.B': 'Colleague B',
  'form.basic-form.option.C': 'Colleague C',
  'form.basic-form.email.required': 'Please enter your email!',
  'form.basic-form.email.wrong-format': 'The email address is in the wrong format!',
  'form.basic-form.userName.required': 'Please enter your userName!',
  'form.basic-form.password.required': 'Please enter your password!',
  'form.basic-form.password.twice': 'The passwords entered twice do not match!',
  'form.basic-form.strength.msg':
    "Please enter at least 6 characters and don't use passwords that are easy to guess.",
  'form.basic-form.strength.strong': 'Strength: strong',
  'form.basic-form.strength.medium': 'Strength: medium',
  'form.basic-form.strength.short': 'Strength: too short',
  'form.basic-form.confirm-password.required': 'Please confirm your password!',
  'form.basic-form.phone-number.required': 'Please enter your phone number!',
  'form.basic-form.phone-number.wrong-format': 'Malformed phone number!',
  'form.basic-form.verification-code.required': 'Please enter the verification code!',
  'form.basic-form.form.get-captcha': 'Get Captcha',
  'form.basic-form.captcha.second': 'sec',
  'form.basic-form.form.optional': ' (optional) ',
  'form.basic-form.form.submit': 'Submit',
  'form.basic-form.form.save': 'Save',
  'form.basic-form.email.placeholder': 'Email',
  'form.basic-form.password.placeholder': 'Password',
  'form.basic-form.confirm-password.placeholder': 'Confirm password',
  'form.basic-form.phone-number.placeholder': 'Phone number',
  'form.basic-form.verification-code.placeholder': 'Verification code'
}
export default {
  name: 'RepositoryForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      basic
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification.error({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    $t (value) {
      return this.basic[value]
    }
  }
}
</script>

<style scoped></style>
