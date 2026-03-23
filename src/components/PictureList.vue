<script setup lang="ts">
import { useRouter } from 'vue-router'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { deletePicture } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showActions?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showActions: false,
})

const router = useRouter()

const doClickPicture = (pictureId) => {
  router.push({
    path: `/picture/${pictureId}`,
  })
}

const doEdit = (picture) => {
  router.push({
    path: '/picture/add',
    query: {
      id: picture.id,
      space_id: picture.spaceId,
    },
  })
}
const doDelete = async (picture) => {
  const id = picture.id
  if (!id) return
  const resp = await deletePicture({ id })
  const res = resp.data
  if (res.code === 20000 && res.data) {
    message.success('删除成功')
    props.onReload?.()
  } else {
    message.error(res.description)
  }
}
</script>
<template>
  <div id="pictureList">
    <!--图片列表-->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 6 }"
      :data-source="props.dataList"
      :loading="props.loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item>
          <a-card hoverable @click="doClickPicture(picture.id)">
            <template #cover>
              <a-image
                :alt="picture.picName"
                :src="picture.thumbnailUrl ?? picture.picUrl"
                height="180px"
              ></a-image>
            </template>
            <a-card-meta :title="picture.picName">
              <template #description>
                <a-flex>
                  <a-tag color="green">
                    {{ picture.picCategory ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.picTags">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template #actions v-if="showActions">
              <a-space @click.stop="doEdit(picture)">
                <EditOutlined />
                编辑
              </a-space>
              <a-space @click.stop="doDelete(picture)">
                <DeleteOutlined />
                删除
              </a-space>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
#pictureList {
}
</style>
