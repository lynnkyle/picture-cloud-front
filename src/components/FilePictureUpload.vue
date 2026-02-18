<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message, type UploadProps } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/pictureController.ts'

interface Props {
  picture?: API.PictureVO
  onSuccess?: (picture: API.PictureVO) => void
}

const props = defineProps<Props>()
const loading = ref<boolean>(false)

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // 校验图片格式
  const isValidFormat =
    file.type === 'image/jpg' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/webp'
  if (!isValidFormat) {
    message.error('不支持上传该格式的图片')
  }
  // 校验图片大小
  const isLt2M = file.size / 1024 / 1024 <= 2
  if (!isLt2M) {
    message.error('不支持上传超过2MB的图片')
  }
  return isValidFormat && isLt2M
}
const doUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const picId = props.picture ? { id: props.picture.id } : {}
    const resp = await uploadPictureUsingPost(picId, {}, file)
    const res = resp.data
    if (res.code === 20000 && res?.data) {
      message.success('图片上传成功')
      props.onSuccess?.(res.data)
    } else {
      message.error('图片上传失败', res.message)
    }
  } catch (error) {
    console.error('图片上传失败', error)
    message.error('图片上传失败', error.message)
  }
  loading.value = false
}
</script>

<template>
  <div id="filePictureUpload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :custom-request="doUpload"
    >
      <img v-if="props.picture?.picUrl && !loading" :src="props.picture?.picUrl" alt="image" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>

<style scoped>
#filePictureUpload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-width: 152px;
  min-height: 152px;
}

#filePictureUpload img {
  max-width: 100%;
  max-height: 480px;
}
</style>
