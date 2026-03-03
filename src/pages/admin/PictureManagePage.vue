<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
} from '@/api/pictureController.ts'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useCategoryTagStore } from '@/stores/useCategoryTagsStore.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { PIC_REVIEW_STATUS_ENUM, PIC_REVIEW_STATUS_MAP } from '../../constant/picture.ts'
import { formatSize } from '../../utils'
import { PlusOutlined } from '@ant-design/icons-vue'

const loginUserSrore = useLoginUserStore()

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
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '图片',
    dataIndex: 'picUrl',
  },
  {
    title: '名称',
    dataIndex: 'picName',
  },
  {
    title: '简介',
    dataIndex: 'picIntro',
  },
  {
    title: '分类',
    dataIndex: 'picCategory',
  },
  {
    title: '标签',
    dataIndex: 'picTags',
  },
  {
    title: '属性',
    dataIndex: 'picInfo',
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
  },
  {
    title: '审核',
    dataIndex: 'reviewInfo',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]
// 定义数据
const total = ref(0)
const dataList = ref<API.Picture[]>([])
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 5,
  sortField: 'createTime',
  sortOrder: 'ascend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '15'],
    showTotal: (total: number) => `共${total}条`,
  }
})

// 表格变化 重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchPictureList()
}

const doSearch = () => {
  searchParams.current = 1
  fetchPictureList()
}
const modalInfo = reactive({
  open: false,
  id: null,
  reviewStatus: PIC_REVIEW_STATUS_ENUM.REVIEWING,
  reviewMessage: '',
})
const doReview = async () => {
  try {
    const resp = await doPictureReviewUsingPost({
      id: modalInfo.id,
      reviewStatus: modalInfo.reviewStatus,
      reviewMessage: modalInfo.reviewMessage,
    })
    const data = resp.data
    if (data.code === 20000) {
      message.success('审核操作成功')
      modalInfo.open = false
      fetchPictureList()
    } else {
      message.error('审核操作失败', data.message)
    }
  } catch (e) {
    console.log('审核操作失败', e.message)
  }
}

const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const resp = await deletePictureUsingPost({ id })
  const res = resp.data
  if (res.code === 20000 && res.data) {
    message.success('删除成功')
    await fetchPictureList()
  } else {
    message.error(res.description)
  }
}
// 获取数据
const fetchPictureList = async () => {
  const resp = await listPictureByPageUsingPost({
    ...searchParams,
  })
  const res = resp.data
  if (res.code === 20000 && res.data) {
    dataList.value = res.data.records ?? []
    total.value = Number(res.data.total) ?? 0
  } else {
    message.error(res.description)
  }
}
// 钩子函数
onMounted(() => {
  fetchPictureList()
})
</script>

<template>
  <div id="pictureManage">
    <div class="modal">
      <a-modal v-model:open="modalInfo.open" title="审核信息" @ok="doReview">
        <a-form>
          <a-form-item label="审核意见">
            <a-input v-model:value="modalInfo.reviewMessage" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <h2 style="margin-bottom: 16px; padding: 0 14px">图片管理</h2>
    <div class="search" style="margin: 16px 0; padding: 0 16px">
      <a-flex justify="space-between">
        <div style="width: 60%">
          <a-form layout="inline">
            <a-form-item label="图片关键词">
              <a-input
                v-model:value="searchParams.searchText"
                placeholder="输入关键词"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-form-item label="图片分类">
              <a-auto-complete
                v-model:value="searchParams.picCategory"
                placeholder="请输入图片标签"
                mode="tags"
                :options="categoryOptions"
                style="width: 190px"
              ></a-auto-complete>
            </a-form-item>
            <a-form-item label="图片标签">
              <a-select
                v-model:value="searchParams.picTags"
                placeholder="请输入图片标签"
                mode="tags"
                :max-tag-count="2"
                :options="tagOptions"
                style="width: 190px"
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
            <a-form-item>
              <a-button type="primary" @click="doSearch">搜索</a-button>
            </a-form-item>
          </a-form>
        </div>
        <div>
          <a-space>
            <a-button href="/picture/add/unit" target="_blank">
              <PlusOutlined />
              创建图片
            </a-button>
            <a-button href="/picture/add/batch" target="_blank">
              <PlusOutlined />
              批量创建图片
            </a-button>
          </a-space>
        </div>
      </a-flex>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        @change="doTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'picUrl'">
            <a-image :src="record.picUrl" :width="50" />
          </template>
          <template v-else-if="column.dataIndex === 'picCategory'">
            <div>{{ record.picCategory }}</div>
          </template>
          <template v-else-if="column.dataIndex === 'picTags'">
            <a-space wrap>
              <a-tag color="cyan" :bordered="false" v-for="tag in JSON.parse(record.picTags)">
                {{ tag }}
              </a-tag>
            </a-space>
          </template>
          <template v-else-if="column.dataIndex === 'picInfo'">
            <div class="picInfo">
              <div>格式:{{ record.picFormat }}</div>
              <div>宽:{{ record.picWidth }}</div>
              <div>高:{{ record.picHeight }}</div>
              <div>宽高比:{{ record.picScale }}</div>
              <div>大小:{{ formatSize(record.picSize) }}</div>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'userId'">
            <span>{{ record.userId }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'reviewInfo'">
            <div class="reviewInfo">
              <div>审核状态:{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
              <div>审核信息:{{ record.reviewMessage }}</div>
              <div>审核人:{{ record.reviewerId }}</div>
              <div>审核时间:{{ dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            <div class="timeInfo">
              {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'editTime'">
            <div class="timeInfo">
              {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space wrap>
              <a-dropdown>
                <a-button size="small" type="link"> 审核</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-button
                        size="small"
                        type="link"
                        @click="
                          () => {
                            modalInfo.open = true
                            modalInfo.id = record.id
                            modalInfo.reviewStatus = PIC_REVIEW_STATUS_ENUM.PASS
                            modalInfo.reviewMessage = '管理员审核通过'
                          }
                        "
                      >
                        通过
                      </a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-button
                        size="small"
                        type="link"
                        danger
                        @click="
                          () => {
                            modalInfo.open = true
                            modalInfo.id = record.id
                            modalInfo.reviewStatus = PIC_REVIEW_STATUS_ENUM.REJECT
                            modalInfo.reviewMessage = '管理员审核拒绝'
                          }
                        "
                      >
                        拒绝
                      </a-button>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <a-button
                size="small"
                type="link"
                :href="`/picture/add?id=${record.id}`"
                target="_blank"
              >
                编辑
              </a-button>
              <a-button size="small" type="link" danger @click="doDelete(record.id)">
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
#pictureManage .form {
  margin-bottom: 15px;
}

#pictureManage :deep(.ant-select-selection-item) {
  background: none;
  border: none;
}

#pictureManage :deep(.ant-form-item-label > label) {
  font-size: 16px;
  font-weight: 400;
}

#pictureManage .picInfo {
  min-width: 85px;
  overflow: hidden;
}

#pictureManage .reviewInfo {
  min-width: 225px;
}

#pictureManage .timeInfo {
  min-width: 135px;
}
</style>
