<script lang="ts" setup>
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const loginUserStore = useLoginUserStore()
const router = useRouter()
// 菜单
const current = ref<string[]>(['/'])
const menuItem = ref([
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
    title: '公共图库',
  },
  {
    key: '/private',
    label: '私有图库',
    icon: () => h(UserOutlined),
    title: '私有图库',
  },
])
const doMenuClick = ({ key }) => {
  router.push({ path: key })
}
router.afterEach((to, from, next) => {
  current.value = [to.path]
})
</script>
<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      width="200"
      breakpoint="lg"
      collapsed-width="0"
    >
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="menuItem"
        @click="doMenuClick"
      ></a-menu>
    </a-layout-sider>
  </div>
</template>
<style scoped>
#globalHeader {
}

#globalHeader .title {
  color: #000000;
  font-size: 20px;
}

#globalHeader .logo {
  width: 48px;
  height: 48px;
}
</style>
