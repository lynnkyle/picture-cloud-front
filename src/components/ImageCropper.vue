<script setup lang="ts">
import { ref } from 'vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

interface Props {
  imgUrl?: string
}

const props = defineProps<Props>()
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
const cropFinish = () => {
  cropperRef.value?.getCropBlob((data) => {
    console.log(data)
    // img = window.URL.createObjectURL(data)
    // model = true
    // modelSrc = img
  })
}
</script>

<template>
  <div class="imageCropper">
    <!--图片裁切组件//TODO output-size output-type full high-->
      <vue-cropper ref="cropperRef" :img="props.imgUrl" output-type="png"
                   :info="true" :can-move-box="true" :fixed-box="false"
                   :auto-crop="true" :center-box="true" style="margin-bottom: 10px"></vue-cropper>
      <!--图片操作组件-->
      <div class="image-cropper-action">
        <a-space>
          <a-button @click="rotateLeft" class="btn">左旋</a-button>
          <a-button @click="rotateRight" class="btn">右旋</a-button>
          <a-button @click="changeScale(1)" class="btn">放大</a-button>
          <a-button @click="changeScale(-1)" class="btn">缩小</a-button>
        </a-space>
      </div>
  </div>
</template>

<style scoped>
.imageCropper {

}

.imageCropper .vue-cropper {
  height: 400px;
}

.imageCropper .image-cropper-action {
  text-align: center;
}
</style>
