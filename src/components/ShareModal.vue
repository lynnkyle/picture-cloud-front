<script lang="ts" setup>
import logoImg from '@/assets/logo.png'
import { ref } from 'vue'

interface Props {
  title?: string
  link?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '分享图片',
  link: '',
})

const open = ref<boolean>(false)
const openModal = (e: MouseEvent) => {
  open.value = true
}
const closeModal = (e: MouseEvent) => {
  open.value = false
}
defineExpose({ openModal })
</script>
<template>
  <div>
    <a-modal v-model:open="open" :title="props.title" :footer="false" @cancel="closeModal">
      <h4>复制分享链接</h4>
      <a-typography-paragraph copyable>
        {{ props.link }}
      </a-typography-paragraph>
      <h4>手机扫码查看</h4>
      <a-qrcode :icon="logoImg" :link="props.link" />
    </a-modal>
  </div>
</template>

<style scoped></style>
