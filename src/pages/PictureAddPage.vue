<script setup lang="ts">
import FilePictureUpload from '@/components/FilePictureUpload.vue'
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  getPictureByIdUsingGet,
  listPictureCategoryTagUsingGet,
  updatePictureUsingPost,
} from '@/api/pictureController.ts'
import type { Rule } from 'ant-design-vue/es/form'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryTagStore } from '@/stores/useCategoryTagsStore.ts'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'

const route = useRoute()
const router = useRouter()

const uploadType = ref<string>('file')

const picture = reactive<API.PictureVO>({})
const getOldPicture = async () => {
  const id = route.query?.id
  if (!id) {
    return
  }
  try {
    const resp = await getPictureByIdUsingGet({ id })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      const oldPicture = res.data
      Object.assign(picture, oldPicture)
      pictureForm.picName = oldPicture.picName
      pictureForm.picIntro = oldPicture.picIntro
      pictureForm.picCategory = oldPicture.picCategory
      pictureForm.picTags = JSON.parse(oldPicture.picTags)
    }
  } catch (e) {
    console.log('获取图片失败', e.message)
  }
}
const onSuccess = (newPicture: API.PictureVO) => {
  Object.assign(picture, newPicture)
  pictureForm.picName = newPicture.picName
}

const pictureForm = reactive<API.PictureEditRequest>({})
const rules: Record<string, Rule[]> = {
  picName: [{ required: true, trigger: 'change' }],
  picIntro: [
    { required: true, trigger: 'change' },
    { max: 512, message: '图片简介过长' },
  ],
  picCategory: [{ required: true, trigger: 'change' }],
  picTags: [{ required: true, trigger: 'change' }],
}
const doSubmit = async (values: any) => {
  const pictureId = picture.id
  if (pictureId == null) {
    message.warn('请先上传图片')
    return
  }
  try {
    const resp = await updatePictureUsingPost({
      id: pictureId,
      ...values,
    })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      message.success('更新图片成功')
      router.push({
        path: `/picture/detail/${pictureId}`,
      })
    }
  } catch (e) {
    console.log('更新图片失败', e.message)
  }
}
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
onMounted(() => {
  getOldPicture()
})
</script>

<template>
  <div id="pictureAdd">
    <h2 style="margin-bottom: 16px">{{ route.query?.id ? '修改图片' : '创建图片' }}</h2>
    <a-tabs v-model:activeKey="uploadType">
      <a-tab-pane key="file" tab="文件上传">
        <file-picture-upload :picture="picture" :on-success="onSuccess"></file-picture-upload>
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL上传">
        <url-picture-upload :picture="picture" :on-success="onSuccess"></url-picture-upload>
      </a-tab-pane>
    </a-tabs>
    <a-form :model="pictureForm" :rules="rules" @finish="doSubmit">
      <a-form-item label="图片名称" name="picName">
        <a-input
          v-model:value="pictureForm.picName"
          placeholder="请输入图片名称"
          allow-clear
        ></a-input>
      </a-form-item>
      <a-form-item label="图片简介" name="picIntro">
        <a-textarea
          v-model:value="pictureForm.picIntro"
          placeholder="请输入图片简介"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          allow-clear
        ></a-textarea>
      </a-form-item>
      <a-form-item label="图片分类" name="picCategory">
        <a-auto-complete
          v-model:value="pictureForm.picCategory"
          placeholder="请输入图片分类"
          :options="categoryOptions"
        ></a-auto-complete>
      </a-form-item>
      <a-form-item label="图片标签" name="picTags">
        <a-select
          v-model:value="pictureForm.picTags"
          placeholder="请输入图片标签"
          :options="tagOptions"
          mode="tags"
        ></a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">创建</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#pictureAdd {
  max-width: 720px;
  margin: 0 auto;
}
</style>
