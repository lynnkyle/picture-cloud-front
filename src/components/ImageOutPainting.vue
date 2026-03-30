<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  createPictureOutPaintingTask,
  getPictureOutPaintingTask,
  uploadPictureByUrl,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()
// 模态框组件
const open = ref<boolean>(false)
const openModal = () => {
  open.value = true
}
const closeModal = () => {
  open.value = false
}
defineExpose({ openModal })
// 创建扩图任务
const resultPictureUrl = ref<string>()
const taskId = ref<string>()
const outPaintingLoading = ref(false)
// 轮询任务
let pollingTimer: number | null = null
const POLL_INTERVAL = 3000
const MAX_POLL_COUNT = 10
const startPolling = () => {
  if (!taskId.value) {
    message.warning('任务 ID 不存在')
    return
  }
  let pollCount = 0
  pollingTimer = window.setInterval(async () => {
    pollCount += 1
    try {
      const resp = await getPictureOutPaintingTask({
        taskId: taskId.value,
      })
      const res = resp.data
      if (res.code !== 20000 || !res.data) {
        message.error(`查询扩图任务失败：${res.description || '未知错误'}`)
        clearPolling()
        return
      }
      const taskResult = res.data.output
      const taskStatus = taskResult?.taskStatus
      if (taskStatus === 'SUCCEEDED') {
        message.success('扩图任务执行成功')
        resultPictureUrl.value = taskResult?.outputImageUrl
        clearPolling()
        return
      }
      if (taskStatus === 'FAILED') {
        message.error('扩图任务执行失败')
        clearPolling()
        return
      }
      if (pollCount >= MAX_POLL_COUNT) {
        message.warning('轮询超时，请稍后手动刷新查看结果')
        clearPolling()
      }
    } catch (e: any) {
      console.error('查询扩图任务失败', e)
      message.error(`查询扩图任务失败：${e?.message || '未知错误'}`)
      clearPolling()
    }
  }, POLL_INTERVAL)
}
const clearPolling = () => {
  if (pollingTimer !== null) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
  outPaintingLoading.value = false
}

const createPictureOutPainting = async () => {
  if (!props.picture?.id) return
  outPaintingLoading.value = true
  try {
    const resp = await createPictureOutPaintingTask({
      pictureId: props.picture.id,
      // TODO 根据需要设置扩图参数
      parameters: {
        xScale: 2,
        yScale: 2,
      },
    })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      message.success('创建扩图任务成功, 请耐心等待')
      taskId.value = res.data.output.taskId
    } else {
      message.error(`创建扩图任务失败,${res.description}`)
      outPaintingLoading.value = false
    }
    startPolling()
  } catch (e) {
    console.log('创建扩图任务失败', e)
    message.error(`创建扩图任务失败${e.message}`)
    outPaintingLoading.value = false
  }
}
// 保存扩图任务
const uploadLoading = ref(false)
const uploadPictureOutPainting = async () => {
  uploadLoading.value = true
  try {
    const params: API.PictureUploadRequest = {
      fileUrl: resultPictureUrl.value,
      spaceId: props.picture.spaceId,
    }
    if (props.picture) {
      params['id'] = props.picture.id
      params['spaceId'] = props.picture.spaceId
    }
    const resp = await uploadPictureByUrl(params)
    const res = resp.data
    if (res.code === 20000 && res?.data) {
      message.success('图片上传成功')
      props.onSuccess?.(res.data)
      closeModal()
    } else {
      message.error(`图片上传失败${res.message}`)
    }
  } catch (error) {
    console.error('图片上传失败', error)
    message.error(`图片上传失败${error.message}`)
  }
  uploadLoading.value = false
}
// 缓存
const resultCache = ref<Record<string, string>>({})
watch(
  () => props.picture?.id,
  (newId, oldId) => {
    if (!newId) return

    if (newId !== oldId) {
      clearPolling()
      taskId.value = undefined
    }

    resultPictureUrl.value = resultCache.value[newId]
  },
  { immediate: true },
)
</script>

<template>
  <div class="imageOutPainting">
    <a-modal title="AI扩图" :footer="false" v-model:open="open" @cancel="closeModal">
      <a-row :gutter="24">
        <a-col span="12">
          <h4>原始图片</h4>
          <!--<a-image :src="props.picture?.picUrl"></a-image>-->
          <a-image :src="props.picture?.picUrl"></a-image>
        </a-col>
        <a-col span="12">
          <h4>扩图结果</h4>
          <a-spin size="large" :spinning="outPaintingLoading">
            <a-image :src="resultPictureUrl"></a-image>
          </a-spin>
        </a-col>
      </a-row>
      <a-flex justify="center" gap="16" style="margin-top: 10px">
        <a-button :loading="outPaintingLoading" @click="createPictureOutPainting"
          >图片扩展
        </a-button>
        <a-button type="primary" ghost @click="uploadPictureOutPainting">图片保存</a-button>
      </a-flex>
    </a-modal>
  </div>
</template>

<style scoped>
.imageOutPainting {
}
</style>
