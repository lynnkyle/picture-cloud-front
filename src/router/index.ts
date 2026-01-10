import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import IndexPage from '@/pages/IndexPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'

const routes = [
  {
    path: '/',
    name: '首页',
    component: IndexPage,
    meta: {
      icon: h(HomeOutlined),
    },
  },
  {
    path: '/user/register',
    name: '用户注册',
    component: UserRegisterPage,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/user/login',
    name: '用户登录',
    component: UserLoginPage,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/admin/user-manage',
    name: '用户管理',
    component: UserManagePage,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})
export default router
