<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { updatePictureUsingPost, uploadPictureByBatchUsingPost } from '@/api/pictureController.ts'
import type { Rule } from 'ant-design-vue/es/form'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref<Boolean>(false)
const pictureForm = reactive<API.PictureUploadByBatchRequest>({
  count: 5,
})
const rules: Record<string, Rule[]> = {
  searchText: [{ required: true, trigger: 'change' }],
  count: [
    { required: true, trigger: 'change' },
    { type: 'number', min: 1, max: 5, trigger: 'change' },
  ],
  namePrefix: [{ required: true, trigger: 'change' }],
}
const doSubmit = async (values: any) => {
  loading.value = false
  try {
    const resp = await uploadPictureByBatchUsingPost({
      ...pictureForm,
    })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      message.success(`批量创建图片成功,共爬取${res.data}张图片`)
      router.push({
        path: '/',
      })
    } else {
      message.error('批量创建图片失败' + res.description)
    }
  } catch (e) {
    console.log('批量创建图片图片失败', e.message)
  }
  loading.value = true
}
</script>

<template>
  <div id="pictureAddBatch">
    <h2 style="margin-bottom: 16px">批量创建图片</h2>
    <a-form :model="pictureForm" :rules="rules" @finish="doSubmit">
      <a-form-item label="图片关键词" name="searchText">
        <a-input
          v-model:value="pictureForm.searchText"
          placeholder="请输入图片关键词"
          allow-clear
        ></a-input>
      </a-form-item>
      <a-form-item label="图片爬取数量" name="count">
        <a-input-number
          v-model:value="pictureForm.count"
          placeholder="请输入图片爬取数量"
          allow-clear
        ></a-input-number>
      </a-form-item>
      <a-form-item label="图片名称前缀" name="namePrefix">
        <a-input v-model:value="pictureForm.namePrefix" placeholder="请输入图片名称前缀"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading"
          >批量创建
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#pictureAddBatch {
  max-width: 720px;
  margin: 0 auto;
}
</style>
