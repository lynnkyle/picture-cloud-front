import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listPictureCategoryTagUsingGet } from '@/api/pictureController.ts'

export const useCategoryTagStore = defineStore('categoryTag', () => {
  const categoryList = ref<string[]>()
  const tagList = ref<string[]>()
  const fetchCategoryTagStore = async () => {
    try {
      const resp = await listPictureCategoryTagUsingGet()
      const res = resp.data
      if (res.code === 20000 && res.data) {
        categoryList.value = res.data.categoryList
        tagList.value = res.data.tagList
      }
    } catch (e) {
      console.log('获取分类标签失败', e.message)
    }
  }
  const setCategoryList = (list: string[]) => {
    categoryList.value = list
  }
  const setTagList = (list: string[]) => {
    tagList.value = list
  }
  return {
    categoryList,
    tagList,
    fetchCategoryTagStore,
    setCategoryList,
    setTagList,
  }
})
