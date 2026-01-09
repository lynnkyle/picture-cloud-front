<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { type RouteRecordRaw, useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { type ItemType, type MenuProps, message } from 'ant-design-vue'
import { userLogoutUsingPost } from '@/api/userController.ts'
import checkAccess from '@/access/checkAccess.ts'

const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()

const router = useRouter()
// 菜单
const current = ref<string[]>(['/'])



const filterMenus = (menus: MenuProps['items'] = []) => {
  return menus?.filter((menu) => {
    if (menu?.hideInMenu) {
      return false
    }
    return checkAccess(loginUserStore.loginUser, menu.access as string)
  })
}
const items = computed(() => {
  const menuList: MenuProps['items'] = []
  const routes = router.getRoutes()
  routes.forEach(route => {
    const menuItem: ItemType = {
      key: route.path,
      title: route.name,
      label: route.name,
      icon: route.meta.icon,
      access: route.meta.icon
    }
    menuList.push(menuItem)
  })
  return filterMenus(menuList)
})
const doMenuClick = ({ key }) => {
  router.push({
    path: key
  })
}
// 用户注销
const doLogout = async () => {
  const resp = await userLogoutUsingPost()
  const res = resp.data
  if (res.code === 20000) {
    loginUserStore.setLoginUser({
      userName: '未登录'
    })
    message.success('退出登录')
    router.push({
      path: '/user/login'
    })
  } else {
    message.error(res.description)
  }
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
      <!--用户信息展示-->
      <a-col flex="120px">
        <div v-if="loginUserStore.loginUser.id">
          <a-dropdown>
            <a-space>
              <a-avatar size="large" :src="loginUserStore.loginUser.userAvatar">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              {{ loginUserStore.loginUser.userName ?? '无名' }}
            </a-space>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="doLogout">
                  <a-space>
                    <LogoutOutlined />
                    <a href="javascript:;">退出登录</a>
                  </a-space>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div v-else>
          <a-button type="primary" href="/user/login">登录</a-button>
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
