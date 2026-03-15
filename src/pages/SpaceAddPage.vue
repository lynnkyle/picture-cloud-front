<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { addSpace, getSpaceById } from '@/api/spaceController.ts'
import type { Rule } from 'ant-design-vue/es/form'
import { useRoute, useRouter } from 'vue-router'
import { SPACE_LEVEL_OPTIONS } from '@/constant/space.ts'

const route = useRoute()
const router = useRouter()
// 搜索栏
const spaceLevelOptions = ref([])
spaceLevelOptions.value = SPACE_LEVEL_OPTIONS

const space = reactive<API.SpaceVO>({})
const spaceForm = reactive<API.SpaceAddRequest>({})
const getOldSpace = async () => {
  const id = route.query?.id
  if (!id) {
    return
  }
  try {
    const resp = await getSpaceById({ id })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      const oldSpace = res.data
      Object.assign(space, oldSpace)
      spaceForm.picName = oldSpace.picName
      spaceForm.picIntro = oldSpace.picIntro
      spaceForm.picCategory = oldSpace.picCategory
      spaceForm.picTags = JSON.parse(oldSpace.picTags)
    }
  } catch (e) {
    console.log('获取空间失败', e.message)
  }
}

const rules: Record<string, Rule[]> = {
  picName: [{ required: true, trigger: 'change' }],
  picIntro: [
    { required: true, trigger: 'change' },
    { max: 512, message: '空间简介过长' },
  ],
  picCategory: [{ required: true, trigger: 'change' }],
  picTags: [{ required: true, trigger: 'change' }],
}
const loading = ref<boolean>(false)
const doSubmit = async (values: any) => {
  loading.value = true
  try {
    console.log(values)
    const resp = await addSpace({
      ...values,
    })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      message.success('更新空间成功')
      const spaceId = res.data
      router.push({
        path: `/space/detail/${spaceId}`,
      })
    } else {
      message.error(res.description)
    }
  } catch (e) {
    console.log('更新空间失败', e.message)
  }
  loading.value = false
}
onMounted(() => {
  getOldSpace()
})
</script>

<template>
  <div id="spaceAdd">
    <h2 style="margin-bottom: 16px">{{ route.query?.id ? '修改空间' : '创建空间' }}</h2>
    <a-spin :spinning="loading">
      <a-form :model="spaceForm" :rules="rules" @finish="doSubmit">
        <a-form-item label="空间名称" name="spaceName">
          <a-input
            v-model:value="spaceForm.spaceName"
            placeholder="请输入空间名称"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item label="空间级别" name="spaceLevel">
          <a-select
            v-model:value="spaceForm.spaceLevel"
            placeholder="请输入空间标签"
            :options="spaceLevelOptions"
          ></a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
            创建
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<style scoped>
#spaceAdd {
  max-width: 720px;
  margin: 0 auto;
}
</style>
