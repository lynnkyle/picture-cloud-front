<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router'
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

interface MenuItem {
  key: string
  title: string
  label?: string
  icon?: () => any
  access?: string
  hideInMenu: boolean
  children?: MenuItem[]
}

const processRoutes = (routes: RouteRecordRaw[], menuList: MenuItem[]) => {
  routes.forEach((route) => {
    const menuItem: MenuItem = {
      key: route.path,
      title: route.name as string,
      label: route.name as string,
      icon: () => route.meta?.icon ?? null,
      access: route.meta?.access as string,
      hideInMenu: route.meta?.hideInMenu as boolean,
    }
    if (route.children && route.children.length > 0) {
      menuItem.children = []
      processRoutes(route.children, menuItem.children)
    }
    menuList.push(menuItem)
  })
}
const filterMenus = (menus: MenuItem[] = []) => {
  return menus?.filter((menu) => {
    if (menu?.hideInMenu) {
      return false
    }
    return checkAccess(loginUserStore.loginUser, menu.access as string)
  })
}
const items = computed(() => {
  const menuList: MenuItem[] = []
  const routes = router.options.routes as RouteRecordRaw[]
  processRoutes(routes, menuList)
  console.log(menuList)
  return filterMenus(menuList)
})
const doMenuClick = ({ key }: any) => {
  router.push({
    path: key,
  })
}
// 用户注销
const doLogout = async () => {
  const resp = await userLogoutUsingPost()
  const res = resp.data
  if (res.code === 20000) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录')
    router.push({
      path: '/user/login',
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
