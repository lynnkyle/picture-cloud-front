import { saveAs } from 'file-saver'

export const formatPictureSize = (size?: number) => {
  if (!size) return '图片大小未知'
  if (size < 1024) return size + 'B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + 'KB'
  return (size / (1024 * 1024)).toFixed(2) + 'MB'
}

export function downloadImage(url?: string, fileName?: string) {
  if (!url) {
    return
  }
  saveAs(url, fileName)
}

export const formatSpaceSize = (size?: number) => {
  if (!size) return undefined
  return (size / (1024 * 1024)).toFixed(0)
}

export const formatSpaceCount = (count?: number) => {
  if (!count) return undefined
  return count
}

export const getFileSuffix = (fileUrl: string | undefined) => {
  if (!fileUrl) return undefined
  const index = fileUrl.lastIndexOf('.')
  if (index === -1 || index === fileUrl.length - 1) {
    return ''
  }
  return fileUrl.slice(index + 1).toLowerCase()
}
