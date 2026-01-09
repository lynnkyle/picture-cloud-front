import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import checkAccess from '@/access/checkAccess.ts'
import AccessEnum from '@/access/accessEnum.ts'

let firstFetchLoginUser = true

/**
 * 全局权限校验：页面切换时执行
 */
router.beforeEach(async (to, from, next) => {
  let needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN

  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // 页面刷新时/首次加载时, 等待后端返回用户信息后, 再校验权限
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }

  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    if (loginUser?.userRole === AccessEnum.NOT_LOGIN) {
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
    if (!checkAccess(loginUser, needAccess)) {
      next(`/noAuth`)
      return
    }
  }
  next()
})
