<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/pictureController.ts'
import { useRouter } from 'vue-router'
import { downloadImage, formatSize } from '../utils'
import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const router = useRouter()

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

interface Props {
  id: string | number
}

const props = defineProps<Props>()
// 定义数据
const picture = ref<API.PictureVO>({})
const loading = ref<boolean>(true)

const fetchPictureDetail = async () => {
  try {
    const resp = await getPictureVoByIdUsingGet({ id: props.id })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      picture.value = res.data
    } else {
      message.error(res.description)
    }
  } catch (e) {
    console.log('获取图片详情失败', e.message)
  }
  loading.value = false
}

// 定义方法
const canOperate = computed(() => {
  if (!loginUser.id) return false
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})
const doDownload = () => {
  downloadImage(picture.value.picUrl)
}
const doEdit = () => {
  if (!loginUser.id) {
    return false
  }
  router.push({
    path: '/picture/add',
    query: {
      id: picture.value?.id,
    },
  })
}
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const resp = await deletePictureUsingPost({ id })
  const res = resp.data
  if (res.code === 20000 && res.data) {
    message.success('删除成功')
  } else {
    message.error(res.description)
  }
}

// 钩子函数
onMounted(() => {
  fetchPictureDetail()
})
</script>
<template>
  <div id="pictureDetail">
    <a-row :gutter="[16, 16]">
      <a-col :sm="24" :md="12" :xl="12">
        <a-card title="图片预览">
          <a-image :src="picture.picUrl" style="height: 180px; object-fit: contain"></a-image>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="12">
        <a-card title="图片信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="图片名称">
              {{ picture.picName }}
            </a-descriptions-item>
            <a-descriptions-item label="创作者">
              <a-space>
                <a-avatar :src="picture.user?.userAvatar"></a-avatar>
                <span>{{ picture.user?.userName }}</span>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="图片简介">
              {{ picture.picIntro }}
            </a-descriptions-item>
            <a-descriptions-item label="图片分类">
              {{ picture.picCategory }}
            </a-descriptions-item>
            <a-descriptions-item label="图片标签">
              <a-tag v-for="item in picture.picTags" color="cyan">
                {{ item }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="图片格式">
              {{ picture.picFormat ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="图片大小">
              {{ formatSize(picture.picSize) ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="图片宽度">
              {{ picture.picWidth ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="图片高度">
              {{ picture.picHeight ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="图片宽高比">
              {{ picture.picScale ?? '-' }}
            </a-descriptions-item>
          </a-descriptions>
          <a-space wrap>
            <a-button type="primary" :icon="h(DownloadOutlined)" @click="doDownload">免费下载</a-button>
            <a-button v-if="canOperate" :icon="h(EditOutlined)" @click="doEdit">编辑</a-button>
            <a-button v-if="canOperate" :icon="h(DeleteOutlined)" danger @click="doDelete"
              >删除
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
#pictureDetail {
}

#pictureDetail :deep(tr:nth-of-type(2) .ant-descriptions-item-label) {
  align-items: center;
}
</style>
