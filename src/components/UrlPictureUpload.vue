<script setup lang="ts">
import { ref } from 'vue'
import { message, type UploadProps } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost, uploadPictureUsingPost } from '@/api/pictureController.ts'
import { LoadingOutlined } from '@ant-design/icons-vue'

interface Props {
  picture?: API.PictureVO
  onSuccess?: (picture: API.PictureVO) => void
}

const props = defineProps<Props>()
const loading = ref<boolean>(false)
const fileUrl = ref<string>()

const doUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
    if (props.picture) {
      params['id'] = props.picture.id
    }
    const resp = await uploadPictureByUrlUsingPost(params)
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
  <div id="urlPictureUpload">
    <a-input-group compact style="margin: 10px 0 20px">
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 100px)"
        placeholder="请输入图片URL地址"
      />
      <a-button type="primary" style="width: 100px" @click="doUpload">上传图片</a-button>
    </a-input-group>
    <div
      class="img-background"
      style="
        margin: 10px 0 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        object-fit: contain;
        background: #00000005;
        border: 1px dashed #d9d9d9;
        border-radius: 8px;
      "
      v-if="props.picture?.picUrl"
    >
      <loading-outlined v-if="loading"></loading-outlined>
      <img v-else :src="props.picture?.picUrl" alt="image" />
    </div>
  </div>
</template>

<style scoped>
#urlPictureUpload .img-background {
  width: 100% !important;
  height: 100% !important;
  min-width: 152px;
  min-height: 152px;
}

#urlPictureUpload img {
  max-width: 100%;
  max-height: 480px;
}
</style>
