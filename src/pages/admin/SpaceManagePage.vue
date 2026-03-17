<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteSpace, listSpaceByPage } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { formatSpaceCount, formatSpaceSize } from '../../utils'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS } from '../../constant/space.ts'
import { PlusOutlined } from '@ant-design/icons-vue'

const loginUserSrore = useLoginUserStore()
// 搜索栏
const spaceLevelOptions = ref([])
spaceLevelOptions.value = SPACE_LEVEL_OPTIONS

const doSearch = () => {
  searchParams.current = 1
  fetchSpaceList()
}

// 表格属性
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
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
    title: '用户ID',
    dataIndex: 'userId',
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
const dataList = ref<API.Space[]>([])
const searchParams = reactive<API.SpaceQueryRequest>({
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
  fetchSpaceList()
}

const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const resp = await deleteSpace({ id })
  const res = resp.data
  if (res.code === 20000 && res.data) {
    message.success('删除成功')
    await fetchSpaceList()
  } else {
    message.error(res.description)
  }
}
// 获取数据
const fetchSpaceList = async () => {
  const resp = await listSpaceByPage({
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
  fetchSpaceList()
})
</script>

<template>
  <div id="spaceManage">
    <h2 style="margin-bottom: 16px; padding: 0 14px">空间管理</h2>
    <div class="search" style="margin: 16px 0; padding: 0 16px">
      <a-row :gutter="[24, 16]">
        <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="20">
          <div>
            <a-form>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="名称">
                    <a-input
                      v-model:value="searchParams.spaceName"
                      placeholder="请输入空间名称"
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="级别">
                    <a-select
                      v-model:value="searchParams.spaceLevel"
                      placeholder="请选择空间级别"
                      :options="spaceLevelOptions"
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
                  <a-form-item label="用户id">
                    <a-input
                      v-model:value="searchParams.userId"
                      placeholder="请输入用户id"
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item>
                    <a-button type="primary" @click="doSearch">搜索</a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="4">
          <div>
            <a-space>
              <a-button href="/space/add" target="_blank">
                <PlusOutlined />
                创建空间
              </a-button>
            </a-space>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        :scroll="{ x: 'max-content', y: 500 }"
        @change="doTableChange"
      >
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
          <template v-else-if="column.dataIndex === 'userId'">
            <span>{{ record.userId }}</span>
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
              <a-button
                size="small"
                type="link"
                :href="`/space/add?id=${record.id}`"
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
#spaceManage {
}

#spaceManage .form {
  margin-bottom: 15px;
}

#spaceManage .search {
  overflow: hidden;
}

#spaceManage :deep(.ant-select-selection-item) {
  background: none;
  border: none;
}

#spaceManage :deep(.ant-form-item-label) {
  font-size: 16px;
  font-weight: 400;
}

#spaceManage :deep(.ant-form-item-label > label) {
  font-size: 16px;
  font-weight: 400;
}
</style>
