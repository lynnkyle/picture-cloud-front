<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { listSpaceByPage, listSpaceVoByPage } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import { onMounted } from 'vue'

const loginUserStore = useLoginUserStore()
const router = useRouter()
const checkUserSpace = async () => {
  //1).用户未登录，则直接跳转到登录页面
  const loginUser = loginUserStore.loginUser
  if (loginUser.id) {
    router.push({
      path: '/user/login',
      replace: true,
    })
    return
  }
  //2).用户已登录，则获取该用户已创建空间
  const resp = await listSpaceVoByPage({
    userId: loginUser.id,
    current: 1,
    pageSize: 1,
  })
  const res = resp.data
  if (res.code === 20000 && res.data) {
    if (res.data?.records?.length > 0) {
      //有, 则进入第一个空间
      const space = res.data?.records[0]
      router.push({
        path: `/space/${space.id}`,
        replace: true,
      })
    } else {
      //没有，则跳转到创建空间页面
      router.push({
        path: '/space/add',
        replace: true,
      })
      message.warn('请先创建空间')
    }
  } else {
    message.error(`加载空间失败,${res.description}`)
  }
}
onMounted(() => {
  checkUserSpace()
})
</script>

<template>
  <div id="spacePrivate">
    <p>正在跳转,请稍后...</p>
  </div>
</template>

<style scoped>
#spaceAdd {
  max-width: 720px;
  margin: 0 auto;
}
</style>
