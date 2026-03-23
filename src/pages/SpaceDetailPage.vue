<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { deleteSpace, getSpaceVoById, listSpaceVoByPage } from '@/api/spaceController.ts'
import { useRouter } from 'vue-router'
import { downloadImage, formatSpaceCount, formatSpaceSize } from '../utils'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import PictureList from '@/components/PictureList.vue'
import { listPictureVoByPage } from '@/api/pictureController.ts'
import { SPACE_LEVEL_MAP } from '@/constant/space.ts'

const router = useRouter()

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

interface Props {
  id: string | number // 空间id
}

const props = defineProps<Props>()
// 定义数据
// 1.空间详情
const space = ref<API.SpaceVO>({})
const loading = ref<boolean>(true)

const fetchSpaceDetail = async () => {
  try {
    const resp = await getSpaceVoById({ id: props.id })
    const res = resp.data
    if (res.code === 20000 && res.data) {
      space.value = res.data
    } else {
      message.error(res.description)
    }
  } catch (e) {
    console.log('获取空间详情失败', e.message)
  }
  loading.value = false
}

const activeKey = ref(['2'])
const columns = [
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '操作',
    key: 'action',
  },
]
// 2.图片列表
const total = ref(0)
const dataList = ref<API.PictureVO[]>()
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'ascend',
})

const fetchPictureVOList = async () => {
  loading.value = true
  // 搜索参数转换
  const param = {
    spaceId: props.id,
    ...searchParams,
  }
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
    console.log('获取列表列表失败', e.message)
  }
  loading.value = false
}

// 定义方法
const canOperate = computed(() => {
  if (!loginUser.id) return false
  const user = space.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})
const doEdit = () => {
  if (!loginUser.id) {
    return false
  }
  router.push({
    path: '/space/add',
    query: {
      id: space.value?.id,
    },
  })
}
const doDelete = async () => {
  const id = space.value.id
  if (!id) {
    return
  }
  const resp = await deleteSpace({ id })
  const res = resp.data
  if (res.code === 20000 && res.data) {
    message.success('删除成功')
  } else {
    message.error(res.description)
  }
}

// 钩子函数
onMounted(() => {
  fetchSpaceDetail()
  fetchPictureVOList()
})
</script>
<template>
  <div id="spaceDetail">
    <a-collapse v-model:activeKey="activeKey">
      <!--空间信息-->
      <a-collapse-panel key="1" header="空间状态">
        <a-table :columns="columns" :data-source="[space]" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'spaceName'">
              <div>{{ record.spaceName }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'spaceLevel'">
              <div>空间级别:{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</div>
            </template>
            <template v-else-if="column.dataIndex === 'spaceUseInfo'">
              <div class="picInfo">
                <div style="display: flex">
                  <a-space>
                    <div>
                      <div>
                        <a-progress
                          type="circle"
                          :percent="(record.totalSize * 100) / record.maxSize"
                          :format="
                            () =>
                              `${formatSpaceSize(record.totalSize)}/${formatSpaceSize(record.maxSize)}`
                          "
                        />
                      </div>
                      <div style="text-align: center">空间容量(MB)</div>
                    </div>
                    <div>
                      <div>
                        <a-progress
                          type="circle"
                          :percent="(record.totalCount * 100) / record.maxCount"
                          :format="
                            () =>
                              `${formatSpaceCount(record.totalCount)}/${formatSpaceCount(record.maxCount)}`
                          "
                        />
                      </div>
                      <div style="text-align: center">空间图片数量</div>
                    </div>
                  </a-space>
                </div>
              </div>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space wrap>
                <a-button
                  size="small"
                  type="link"
                  :href="`/picture/add?space_id=${id}`"
                  target="_blank"
                >
                  创建图片
                </a-button>
                <a-button
                  size="small"
                  type="link"
                  :href="`/space/add?id=${record.id}`"
                  target="_blank"
                >
                  编辑
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-collapse-panel>
      <!--图片列表-->
      <a-collapse-panel key="2" header="私有图库">
        <picture-list
          :data-list="dataList"
          :show-actions="true"
          :on-reload="fetchPictureVOList"
        ></picture-list>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<style scoped>
#spaceDetail {
}
</style>
