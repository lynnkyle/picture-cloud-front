<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { listUserVoByPageUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: 'id',
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
// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
})
// 获取数据
const fetchData = async () => {
  const resp = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  const res = resp.data
  if (res.code === 20000 && res.data) {
    dataList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error(res.description)
  }
}

// 钩子函数
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div id="userManage">
    <a-table :columns="columns" :data-source="dataList">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="30" />
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="red">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">普通用户</a-tag>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
