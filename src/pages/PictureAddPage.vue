<script setup lang="ts">
import FilePictureUpload from '@/components/FilePictureUpload.vue'
import { h, onMounted, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { getPictureById, updatePicture } from '@/api/pictureController.ts'
import type { Rule } from 'ant-design-vue/es/form'
import { useRoute, useRouter } from 'vue-router'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import { useCategoryTagStore } from '@/stores/useCategoryTagsStore.ts'
import { PIC_STATUS_ENUM, PIC_STATUS_OPTIONS } from '@/constant/picture.ts'
import ImageCropper from '@/components/ImageCropper.vue'
import { EditOutlined } from '@ant-design/icons-vue'
import ImageOutPainting from '@/components/ImageOutPainting.vue'

const route = useRoute()
const router = useRouter()
// 图片上传
const uploadType = ref<string>('file')
const picture = reactive<API.PictureVO>({})
const getOldPicture = async () => {
  const id = route.query?.id
  if (!id) {
    return
  }
  try {
    const resp = await getPictureById({ id })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      const oldPicture = res.data
      Object.assign(picture, oldPicture)
      pictureForm.picName = oldPicture.picName
      pictureForm.picIntro = oldPicture.picIntro
      pictureForm.picCategory = oldPicture.picCategory
      if (oldPicture.picTags != null) pictureForm.picTags = JSON.parse(oldPicture.picTags)
      if (oldPicture.picStatus != null) pictureForm.picStatus = oldPicture.picStatus.toString()
    }
  } catch (e) {
    console.log('获取图片失败', e)
    message.error(`获取图片失败${e.message}`)
  }
}
const onUploadSuccess = (newPicture: API.PictureVO) => {
  Object.assign(picture, newPicture)
  pictureForm.picName = newPicture.picName
  if (newPicture.id) {
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        id: newPicture.id,
      },
    })
  }
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
  picStatus: [{ required: true, trigger: 'change' }],
}
// 分类 / 标签
const categoryTagStore = useCategoryTagStore()
const categoryOptions = ref<string[]>()
const tagOptions = ref<string[]>()
categoryOptions.value = (categoryTagStore.categoryList ?? []).map((item: string) => ({
  value: item,
  label: item,
}))
tagOptions.value = (categoryTagStore.tagList ?? []).map((item: string) => ({
  value: item,
  label: item,
}))
const statusOptions = ref<string[]>()
statusOptions.value = PIC_STATUS_OPTIONS
const doSubmit = async (values: any) => {
  const pictureId = picture.id
  if (pictureId == null) {
    message.warn('请先上传图片')
    return
  }
  try {
    const resp = await updatePicture({
      id: pictureId,
      spaceId: route.query?.space_id,
      ...values,
    })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      message.success('更新图片成功')
      router.push({
        path: `/picture/${pictureId}`,
      })
    } else {
      message.error(res.description)
    }
  } catch (e) {
    console.log('更新图片失败', e.message)
  }
}

// 图片编辑(图片裁剪、扩图任务)
const imageCropper = ref()
const doImageCropper = () => {
  imageCropper.value?.openModal()
}
const onImageCropperSuccess = (newPicture: API.PictureVO) => {
  Object.assign(picture, newPicture)
}
// AI扩图
const imageOutPainting = ref()
const doImageOutPainting = () => {
  imageOutPainting.value?.openModal()
}
const onImageOutPaintingSuccess = (newPicture: API.PictureVO) => {
  Object.assign(picture, newPicture)
}
watch(
  () => route.query.space_id,
  (newId) => {
    if (newId != null) {
      pictureForm.picStatus = PIC_STATUS_ENUM.PRIVATE.toString()
    } else {
      pictureForm.picStatus = PIC_STATUS_ENUM.PUBLIC.toString()
    }
    picture.spaceId = newId
  },
  { immediate: true }, // 一进页面就执行
)
onMounted(() => {
  getOldPicture()
})
</script>

<template>
  <div id="pictureAdd">
    <h2 style="margin-bottom: 16px">{{ route.query?.id ? '修改图片' : '创建图片' }}</h2>
    <a-tabs v-model:activeKey="uploadType">
      <a-tab-pane key="file" tab="文件上传">
        <file-picture-upload :picture="picture" :on-success="onUploadSuccess"></file-picture-upload>
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL上传">
        <url-picture-upload :picture="picture" :on-success="onUploadSuccess"></url-picture-upload>
      </a-tab-pane>
    </a-tabs>
    <div v-if="picture" class="editBar">
      <a-space>
        <a-button :icon="h(EditOutlined)" @click="doImageCropper">编辑图片</a-button>
        <a-button :icon="h(EditOutlined)" @click="doImageOutPainting">AI 扩图</a-button>
      </a-space>
      <ImageCropper
        ref="imageCropper"
        :picture="picture"
        :on-success="onImageCropperSuccess"
      ></ImageCropper>
      <ImageOutPainting
        ref="imageOutPainting"
        :picture="picture"
        :on-success="onImageOutPaintingSuccess"
      ></ImageOutPainting>
    </div>
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
      <a-form-item label="图片权限" name="picStatus">
        <a-select
          v-model:value="pictureForm.picStatus"
          placeholder="请输入图片权限"
          :options="statusOptions"
        ></a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#pictureAdd {
  max-width: 720px;
  margin: 0 auto;
}

#pictureAdd .editBar {
  text-align: center;
  margin: 10px;
}
</style>
