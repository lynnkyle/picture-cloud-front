<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { listPictureVoByPage } from '@/api/pictureController.ts'
import { useCategoryTagStore } from '@/stores/useCategoryTagsStore.ts'
import { useRouter } from 'vue-router'
import PictureList from '@/components/PictureList.vue'

const router = useRouter()
const categoryTagStore = useCategoryTagStore()

// 定义数据
const total = ref(0)
const dataList = ref<API.PictureVO[]>()
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'ascend',
})
const loading = ref<boolean>(true)
// 分页参数
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchPictureVOList()
}
const doSearch = () => {
  searchParams.current = 1
  fetchPictureVOList()
}

// 标签和分类列表
const selectedCategory = ref<string>('全部')
const selectedTags = ref<boolean[]>([])
const categoryList = categoryTagStore.categoryList ?? []
const tagList = categoryTagStore.tagList ?? []

const fetchPictureVOList = async () => {
  loading.value = true
  // 搜索参数转换
  const param = {
    ...searchParams,
    picTags: [] as string[],
  }
  if (selectedCategory.value !== '全部') param.picCategory = selectedCategory.value
  selectedTags.value.forEach((useTag, index) => {
    if (useTag) param.picTags.push(tagList[index])
  })
  try {
    const resp = await listPictureVoByPage(param)
    const res = resp.data
    if (res.code === 20000 && res.data) {
      dataList.value = res.data.records ?? []
      total.value = Number(res.data.total) ?? 0
    } else {
      message.error(res.description)
    }
  } catch (e) {
    console.log('获取图片列表失败', e.message)
  }
  loading.value = false
}
onMounted(() => {
  fetchPictureVOList()
})
</script>
<template>
  <div id="indexPage">
    <!--搜索框-->
    <a-input-search
      v-model:value="searchParams.searchText"
      placeholder="海量图片搜索"
      enter-button="搜索"
      size="large"
      allow-clear
      @search="doSearch"
      style="padding: 24px"
    />
    <!--分类标签-->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch" style="padding: 0 24px">
      <a-tab-pane key="全部" tab="全部"></a-tab-pane>
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category"></a-tab-pane>
    </a-tabs>
    <a-space :size="[16, 8]" style="margin: 16px auto 16px; padding: 0 24px">
      <span style="font-weight: bold; white-space: nowrap">标签:</span>
      <a-checkable-tag
        v-for="(tag, index) in tagList"
        :key="tag"
        v-model:checked="selectedTags[index]"
        @change="doSearch"
      >
        {{ tag }}
      </a-checkable-tag>
    </a-space>
    <!--图片列表-->
    <picture-list :data-list="dataList" :loading="loading"></picture-list>
    <a-pagination
      v-model:current="searchParams.current"
      v-model:page-size="searchParams.pageSize"
      :total="total"
      @change="onPageChange"
      style="text-align: right"
    />
  </div>
</template>

<style scoped>
#indexPage {
}
</style>
