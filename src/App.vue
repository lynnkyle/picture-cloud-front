<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { ref } from 'vue'
import BasicLayout from '@/layouts/BasicLayout.vue'

const locale = ref(zhCN)
dayjs.locale('zh-cn')

</script>

<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <BasicLayout />
    </a-config-provider>
  </div>
</template>

<style scoped></style>
