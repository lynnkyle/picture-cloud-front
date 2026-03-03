<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { listUserVoByPageUsingPost } from '@/api/userController.ts'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
// 表格属性
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    filters: [
      { text: '管理员', value: 'admin' },
      { text: '普通用户', value: 'user' },
    ],
    filterMultiple: false,
    onFilter: (value: string, record: any) => record.userRole === value,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]
// 定义数据
const total = ref(0)
const dataList = ref<API.UserVO[]>([])
const searchParams = reactive<API.UserQueryRequest>({
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
  fetchUserVOList()
}

const doSearch = () => {
  searchParams.current = 1
  fetchUserVOList()
}

const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const resp = await deleteUserUsingPost({ id })
  const res = resp.data
  if (res.code === 20000 && res.data) {
    message.success('删除成功')
    fetchUserVOList()
  } else {
    message.error(res.description)
  }
}
// 获取数据
const fetchUserVOList = async () => {
  const resp = await listUserVoByPageUsingPost({
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
  fetchUserVOList()
})
</script>

<template>
  <div id="userManage">
    <h2 style="margin-bottom: 16px; padding: 0 14px">用户管理</h2>
    <div class="form" style="padding: 0 16px">
      <a-form layout="inline">
        <a-form-item label="账号">
          <a-input
            v-model:value="searchParams.userAccount"
            placeholder="输入账号"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input
            v-model:value="searchParams.userName"
            placeholder="输入用户名"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="doSearch">搜索</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        @change="doTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'userAvatar'">
            <a-image :src="record.userAvatar" :width="50" />
          </template>
          <template v-else-if="column.dataIndex === 'userRole'">
            <div v-if="record.userRole === 'admin'">
              <a-tag color="red">管理员</a-tag>
            </div>
            <div v-else>
              <a-tag color="blue">普通用户</a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            <div>
              {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'updateTime'">
            <div>
              {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button danger @click="doDelete(record.id)">删除</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
#userManage .form {
  margin-bottom: 15px;
}
#userManage :deep(.ant-form-item-label > label) {
  font-size: 16px;
  font-weight: 400;
}
</style>
