<script lang="ts" setup>
import { h, ref } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const current = ref<string[]>(['/'])
const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/about',
    label: '关于',
    title: '关于',
  },
  {
    key: '/others',
    label: '其它',
    title: '其他',
  },
])
const doMenuClick = ({ key }) => {
  router.push({
    path: key,
  })
}
// 路由守卫
router.afterEach((to, from, next) => {
  console.log(to.path)
  current.value = [to.path]
})
</script>
<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="160px">
        <router-link to="/">
          <div class="title-bar">
            <img src="../assets/logo.png" alt="logo" class="logo" />
            <div class="title">云图库</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <a-button>登录</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #000000;
  font-size: 20px;
}

.logo {
  width: 48px;
  height: 48px;
}
</style>
