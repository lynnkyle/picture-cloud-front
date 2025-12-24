// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** index GET /api/user/hello */
export async function indexUsingGet(options?: { [key: string]: any }) {
  return request<string>('/api/user/hello', {
    method: 'GET',
    ...(options || {}),
  })
}
