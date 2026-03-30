<script setup lang="ts">
import { ref } from 'vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { uploadPicture } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  picture?: API.PictureVO
  onSuccess?: (picture: API.PictureVO) => void
}

const props = defineProps<Props>()

// 模态框
const open = ref<boolean>(false)
const openModal = () => {
  open.value = true
}
const closeModal = () => {
  open.value = false
}
defineExpose({ openModal })
// 图片裁剪
const cropperRef = ref()
const changeScale = (num) => {
  num = num || 1
  cropperRef.value?.changeScale(num)
}
const rotateLeft = () => {
  cropperRef.value?.changeScale()
}
const rotateRight = () => {
  cropperRef.value?.rotateLeft()
}
const uploadLoading = ref(false)
const cropFinish = () => {
  cropperRef.value?.getCropBlob((blob) => {
    // blob为已经裁切成功的文件
    const fileName = props.picture?.picName || 'image'
    const file = new File([blob], fileName, { type: blob.type })
    handleUpload({ file })
  })
}
const handleUpload = async ({ file }: any) => {
  uploadLoading.value = true
  try {
    const params: API.PictureUploadRequest = {}
    if (props.picture) {
      params['id'] = props.picture.id
      params['spaceId'] = props.picture.spaceId
    }
    const formData = new FormData()
    formData.append('file', file)
    const resp = await uploadPicture(params, formData)
    const res = resp.data
    if (res.code === 20000 && res?.data) {
      message.success('图片上传成功')
      props.onSuccess?.(res.data)
      closeModal()
    } else {
      message.error(`图片上传失败${res.message}`)
    }
  } catch (e) {
    console.error('图片上传失败', e)
    message.error(`图片上传失败${e.message}`)
  }
  uploadLoading.value = false
}
</script>

<template>
  <div class="imageCropper">
    <a-modal title="图片裁剪" :footer="false" v-model:open="open" @cancel="closeModal">
      <!--图片裁切组件//TODO output-size output-type full high-->
      <vue-cropper
        ref="cropperRef"
        :img="props.picture?.picUrl"
        output-type="png"
        :info="true"
        :can-move-box="true"
        :fixed-box="false"
        :auto-crop="true"
        :center-box="true"
        :onSuccess="onSuccess"
        style="margin-bottom: 10px"
      ></vue-cropper>
      <!--图片操作组件-->
      <div class="image-cropper-action">
        <a-space>
          <a-button @click="rotateLeft" class="btn">左旋</a-button>
          <a-button @click="rotateRight" class="btn">右旋</a-button>
          <a-button @click="changeScale(1)" class="btn">放大</a-button>
          <a-button @click="changeScale(-1)" class="btn">缩小</a-button>
          <a-button @click="cropFinish" :loading="uploadLoading" type="primary">确认裁剪</a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.imageCropper {
}

.imageCropper :deep(.vue-cropper) {
  width: 100% !important;
  height: 500px !important;
}

.imageCropper .image-cropper-action {
  text-align: center;
}
</style>
