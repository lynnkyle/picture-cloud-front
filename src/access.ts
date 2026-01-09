import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'

let firstFetchLoginUser = true

/**
 * 全局权限校验：页面切换时执行
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // 页面刷新时/首次加载时, 等待后端返回用户信息后, 再校验权限
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }
  // 自定义权限校验规则
  const toUrl = to.fullPath
  if (toUrl.startsWith('/admin')) {
    if (!loginUser || loginUser?.userRole !== 'admin') {
      message.error('用户无权限')
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  next()
})
