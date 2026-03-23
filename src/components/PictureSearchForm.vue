<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { deletePicture, doPictureReview, listPictureByPage } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { useCategoryTagStore } from '@/stores/useCategoryTagsStore.ts'
import { PIC_REVIEW_STATUS_ENUM } from '../constant/picture.ts'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { RangeValue } from 'ant-design-vue/es/vc-picker/interface'
import dayjs from 'dayjs'

interface Props {
  onSearch?: (searchParams: API.PictureQueryRequest) => void
}

const props = defineProps<Props>()
const categoryOptions = ref<string[]>()
const tagOptions = ref<string[]>()
const categoryTagStore = useCategoryTagStore()
categoryOptions.value = (categoryTagStore.categoryList ?? []).map((item: string) => ({
  value: item,
  label: item,
}))
tagOptions.value = (categoryTagStore.tagList ?? []).map((item: string) => ({
  value: item,
  label: item,
}))
// 表格属性
// 定义数据
const dateRange = ref<[]>([])
const onRangeChange = (dates: Date[], dateStrings: string[]) => {
  if (dates) {
    console.log('From: ', dates[0], ', to: ', dates[1])
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
  } else {
    console.log('Clear')
  }
}
const rangePresets = ref([
  { label: '过去7天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去14天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去30天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去90天', value: [dayjs().add(-90, 'd'), dayjs()] },
])
const searchParams = reactive<API.PictureQueryRequest>({})

const doSearch = () => {
  props.onSearch?.(searchParams)
}
const doClear = () => {
  // 清空日期
  dateRange.value = []
  // 清空
  Object.keys(searchParams).forEach((key: string) => {
    searchParams[key] = undefined
  })
  // 重新搜索
  props.onSearch?.(searchParams)
}
</script>

<template>
  <div id="pictureSearchForm">
    <div class="search" style="margin: 16px 0; padding: 0 16px">
      <a-row :gutter="[24, 16]">
        <div>
          <a-form>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="关键词">
                  <a-input
                    v-model:value="searchParams.searchText"
                    placeholder="输入关键词"
                    allow-clear
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="分类">
                  <a-auto-complete
                    v-model:value="searchParams.picCategory"
                    placeholder="请输入图片标签"
                    :options="categoryOptions"
                  ></a-auto-complete>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="标签">
                  <a-select
                    v-model:value="searchParams.picTags"
                    placeholder="请输入图片标签"
                    :options="tagOptions"
                  >
                    <template #tagRender="{ value, label, option }">
                      <a-tag color="cyan">
                        {{ label }}
                      </a-tag>
                    </template>
                    <template #maxTagPlaceholder="omittedValues">
                      <a-tag color="blue" style="margin-right: 3px; font-weight: bold">
                        +{{ omittedValues.length }}标签
                      </a-tag>
                    </template>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="格式">
                  <a-input
                    v-model:value="searchParams.picFormat"
                    placeholder="请输入格式"
                    allow-clear
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="18">
                <a-form-item label="日期">
                  <a-range-picker
                    style="width: 100%"
                    v-model:value="dateRange"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    :presets="rangePresets"
                    @change="onRangeChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" style="text-align: center">
                <div style="display: flex; gap: 16px">
                  <a-button type="primary" @click="doSearch" style="width: 50%">搜索</a-button>
                  <a-button @click="doClear" style="width: 50%">重置</a-button>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-row>
    </div>
  </div>
</template>

<style scoped>
#pictureSearchForm {
}
</style>
