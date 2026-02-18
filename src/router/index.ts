import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import IndexPage from '@/pages/IndexPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import AddPicturePage from '@/pages/PictureAddPage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import PictureDetailPage from '@/pages/PictureDetailPage.vue'

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
  {
    path: '/picture/add',
    name: '图片创建',
    component: AddPicturePage,
  },
  {
    path: '/admin/picture-manage',
    name: '图片管理',
    component: PictureManagePage,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: '/picture/detail/:id',
    name: '图片详情页',
    component: PictureDetailPage,
    props: true,
    meta: {
      hideInMenu: true,
    },
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})
export default router
