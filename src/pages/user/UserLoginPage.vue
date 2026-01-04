<script setup lang="ts">
import { reactive, computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { userLoginUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})
const loginUserStore = useLoginUserStore()
const doSubmit = async (values: any) => {
  try {
    const resp = await userLoginUsingPost(values)
    const res = resp.data
    // 登录成功, 把登录态保存到全局状态中
    if (res.code === 20000 && res.data) {
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      router.push({
        path: '/',
        replace: true
      })
    } else {
      message.error(res.description)
    }
  } catch (e) {
    message.error('登录失败')
  }
}
</script>

<template>
  <div id="userLoginPage">
    <div class="title">云图库 —— 用户登录</div>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formState" class="login-form" @finish="doSubmit">
      <a-form-item
        name="userAccount"
        :rules="[
          { required: true, message: '请输入账号!' },
          { min: 4, message: '账号长度不允许小于4位!' },
        ]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码!' },
          { min: 8, message: '密码长度不允许小于8位!' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <div class="tip">
        没有账号?
        <router-link to="/user/register"> 去注册</router-link>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 16px;
}

.desc {
  color: #bbbbbb;
  text-align: center;
  margin-bottom: 16px;
}

.tip {
  text-align: right;
  font-size: 12px;
  color: #bbbbbb;
}
</style>
