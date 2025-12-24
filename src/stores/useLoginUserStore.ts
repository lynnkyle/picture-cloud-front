import { ref } from 'vue'
import { defineStore } from 'pinia'


/**
 * 存储登录用户信息状态
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<any>(
    {
      user_name: '未登录'
    }
  )

  async function fetchLoginUser(): Promise<void> {
    // TODO: 获取登录用户信息
    setTimeout(() => {
      loginUser.value = {
        id: 1,
        user_name: 'admin'
      }
    }, 3000)
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
