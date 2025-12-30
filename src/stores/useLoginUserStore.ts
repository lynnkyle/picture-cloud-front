import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/api/userController.ts'

/**
 * 存储登录用户信息状态
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录'
  })

  async function fetchLoginUser(): Promise<void> {
    const res = (await getLoginUserUsingGet()).data
    if (res.data && res.code === 20000) {
      loginUser.value = res.data
    }
  }

  /**
   * 设置登录用户
   * @param user
   */
  function setLoginUser(user: any) {
    loginUser.value = user
  }

  return {
    loginUser,
    fetchLoginUser,
    setLoginUser
  }
})
