<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { addSpace, getSpaceById, listSpaceLevel, updateSpace } from '@/api/spaceController.ts'
import type { Rule } from 'ant-design-vue/es/form'
import { useRoute, useRouter } from 'vue-router'
import { SPACE_LEVEL_ENUM, SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS } from '@/constant/space.ts'
import { formatSpaceSize } from '../utils'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

const route = useRoute()
const router = useRouter()
// 搜索栏
const spaceLevelOptions = ref([])
spaceLevelOptions.value = SPACE_LEVEL_OPTIONS

const space = ref<API.SpaceVO>({})
const spaceForm = reactive<API.SpaceAddRequest | API.SpaceEditRequest>({
  spaceLevel: SPACE_LEVEL_ENUM.COMMON.toString(),
})

const getOldSpace = async () => {
  const id = route.query?.id
  if (id) {
    const resp = await getSpaceById({ id })
    const res = resp.data
    try {
      if (res.code === 20000 && res.data) {
        space.value = res.data
        spaceForm.spaceName = res.data.spaceName
        spaceForm.spaceLevel = res.data.spaceLevel.toString()
      }
    } catch (e) {}
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
  const spaceId = space.value?.id
  loading.value = true
  let resp = null
  let res = null
  try {
    if (spaceId) {
      // 更新图片
      resp = await updateSpace({
        id: spaceId,
        ...values,
      })
      res = resp.data
    } else {
      // 添加图片
      resp = await addSpace({
        ...values,
      })
      res = resp.data
    }
    if (res.code === 20000 && res.data) {
      message.success('操作成功')
      const spaceId = res.data
      router.push({
        path: `/space/${spaceId}`,
      })
    } else {
      message.error(`操作失败${res.description}`)
    }
  } catch (e) {
    console.log('操作失败', e.message)
  }
  loading.value = false
}
// 空间级别
const spaceLevelList = ref<API.SpaceLevel[]>([])
const fetchSpaceLevelList = async () => {
  const resp = await listSpaceLevel()
  const res = resp.data
  try {
    if (res.code === 20000 && res.data) {
      spaceLevelList.value = res.data ?? []
      return
    } else {
      message.error(`获取空间级别列表失败${res.description}`)
    }
  } catch (e) {
    console.log(`获取空间级别列表失败`, e.message)
    message.error('获取空间级别列表失败')
  }
}

onMounted(() => {
  getOldSpace()
  fetchSpaceLevelList()
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
            placeholder="请选择空间级别"
            :options="spaceLevelOptions"
            :disabled="loginUser.userRole !== 'admin'"
          ></a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
    <a-card title="空间级别介绍">
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList" :key="spaceLevel.id">
        <a-row>
          <a-col :span="6">{{ spaceLevel.text }}</a-col>
          <a-col :span="9">
            空间容量
            <a-tag>{{ formatSpaceSize(spaceLevel.maxSize) }}MB</a-tag>
          </a-col>
          <a-col :span="9">
            空间允许上传图片数量
            <a-tag>{{ spaceLevel.maxCount }}</a-tag>
          </a-col>
        </a-row>
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<style scoped>
#spaceAdd {
  max-width: 720px;
  margin: 0 auto;
}
</style>
