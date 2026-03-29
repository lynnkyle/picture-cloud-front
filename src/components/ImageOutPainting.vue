<script setup lang="ts">
import { ref } from 'vue'
import {
  createPictureOutPaintingTask,
  getPictureOutPaintingTask,
  uploadPictureByUrl,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  picture?: API.PictureVO
  onSuccess?: () => void
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
// 扩图任务
const resultPictureUrl = ref<string>()
const taskId = ref<string>()
const pollingTimer: NodeJS.Timeout = null
const startPolling = () => {
  if (!taskId.value) return
  pollingTimer = setInterval(async () => {
    try {
      const resp = await getPictureOutPaintingTask({
        taskId: taskId.value,
      })
      const res = resp.data
      if (res.code === 20000 && res.data) {
        const taskResult = res.output
        if (taskResult?.status === 'SUCCESS') {
          message.success('扩图任务执行成功')
          resultPictureUrl.value = taskResult?.outputImageUrl
          clearPolling()
        } else if (taskResult?.status === 'FAILED') {
          message.error('扩图任务执行失败')
          clearPolling()
        }
      } else {
        message.error(`创建扩图任务失败,${res.description}`)
      }
    } catch (e) {
      console.log('创建扩图任务失败', error)
      message.error(`创建扩图任务失败${e.message}`)
      clearPolling()
    }
  }, 3000)
}
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}
const createPictureOutPainting = async () => {
  if (!props.picture?.id) return
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
    }
    startPolling()
  } catch (e) {
    console.log('创建扩图任务失败', e)
    message.error(`创建扩图任务失败${e.message}`)
  }
}
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
</script>

<template>
  <div class="imageOutPainting">
    <a-modal title="AI扩图" :footer="false" v-model:open="open" @cancel="closeModal">
      <a-row gutter="24">
        <a-col span="12">
          <h4>原始图片</h4>
          <!--<a-image :src="props.picture?.picUrl"></a-image>-->
          <a-image :src="props.picture?.picUrl"></a-image>
        </a-col>
        <a-col span="12">
          <h4>扩图结果</h4>
          <a-image :src="resultPictureUrl"></a-image>
        </a-col>
      </a-row>
      <a-flex justify="center" gap="16" style="margin-top: 10px">
        <a-button :loading="taskId" @click="createPictureOutPainting">图片扩展</a-button>
        <a-button type="primary" ghost @click="uploadPictureOutPainting">图片保存</a-button>
      </a-flex>
    </a-modal>
  </div>
</template>

<style scoped>
.imageOutPainting {
}
</style>
