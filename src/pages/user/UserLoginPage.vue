<script setup lang="ts">
import { reactive, computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'


const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
  remember: true
})
const doSubmit = (values: any) => {
  console.log('Success:', values)
}
const disabled = computed(() => {
  return !(formState.username && formState.password)
})
</script>

<template>
  <div class="userLoginPage">
    <div class="title">云图库 —— 用户登录</div>
    <div class="desc">企业级智能协同云图库</div>
    <a-form
      :model="formState"
      class="login-form"
      @finish="doSubmit"
    >
      <a-form-item
        label="用户账号"
        name="userAccount"
        :rules="[{ required: true, message: '请输入账号!'}]"
      >
        <a-input v-model:value="formState.userAccount" placeholder='请输入账号'>
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>
        <a class="login-form-forgot" href="">Forgot password</a>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          Log in
        </a-button>
        Or
        <a href="">register now!</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.login-form {
  max-width: 300px;
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}
</style>
