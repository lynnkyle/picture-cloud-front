declare namespace API {
  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
    description?: string
  }

  type BaseResponseCreateImageOutPaintingTaskResponse = {
    code?: number
    data?: CreateImageOutPaintingTaskResponse
    message?: string
    description?: string
  }

  type BaseResponseGetImageOutPaintingTaskResponse = {
    code?: number
    data?: GetImageOutPaintingTaskResponse
    message?: string
    description?: string
  }

  type BaseResponseInteger = {
    code?: number
    data?: number
    message?: string
    description?: string
  }

  type BaseResponseIPagePicture = {
    code?: number
    data?: IPagePicture
    message?: string
    description?: string
  }

  type BaseResponseIPagePictureVO = {
    code?: number
    data?: IPagePictureVO
    message?: string
    description?: string
  }

  type BaseResponseIPageSpace = {
    code?: number
    data?: IPageSpace
    message?: string
    description?: string
  }

  type BaseResponseIPageSpaceVO = {
    code?: number
    data?: IPageSpaceVO
    message?: string
    description?: string
  }

  type BaseResponseIPageUserVO = {
    code?: number
    data?: IPageUserVO
    message?: string
    description?: string
  }

  type BaseResponseListSpaceLevel = {
    code?: number
    data?: SpaceLevel[]
    message?: string
    description?: string
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
    description?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
    description?: string
  }

  type BaseResponsePicture = {
    code?: number
    data?: Picture
    message?: string
    description?: string
  }

  type BaseResponsePictureTagCategory = {
    code?: number
    data?: PictureTagCategory
    message?: string
    description?: string
  }

  type BaseResponsePictureVO = {
    code?: number
    data?: PictureVO
    message?: string
    description?: string
  }

  type BaseResponseSpace = {
    code?: number
    data?: Space
    message?: string
    description?: string
  }

  type BaseResponseSpaceVO = {
    code?: number
    data?: SpaceVO
    message?: string
    description?: string
  }

  type BaseResponseString = {
    code?: number
    data?: string
    message?: string
    description?: string
  }

  type BaseResponseUser = {
    code?: number
    data?: User
    message?: string
    description?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
    description?: string
  }

  type CreateImageOutPaintingTaskResponse = {
    requestId?: string
    output?: Output
  }

  type DeleteRequest = {
    id?: number
  }

  type GetImageOutPaintingTaskResponse = {
    requestId?: string
    output?: Output
    usage?: Usage
  }

  type getPictureByIdParams = {
    id: number
  }

  type getPictureOutPaintingTaskParams = {
    taskId: string
  }

  type getPictureVOByIdParams = {
    id: number
  }

  type getSpaceByIdParams = {
    id: number
  }

  type getSpaceVOByIdParams = {
    id: number
  }

  type getUserByIdParams = {
    id: number
  }

  type getUserVOByIdParams = {
    id: number
  }

  type IPagePicture = {
    size?: number
    total?: number
    current?: number
    records?: Picture[]
    pages?: number
  }

  type IPagePictureVO = {
    size?: number
    total?: number
    current?: number
    records?: PictureVO[]
    pages?: number
  }

  type IPageSpace = {
    size?: number
    total?: number
    current?: number
    records?: Space[]
    pages?: number
  }

  type IPageSpaceVO = {
    size?: number
    total?: number
    current?: number
    records?: SpaceVO[]
    pages?: number
  }

  type IPageUserVO = {
    size?: number
    total?: number
    current?: number
    records?: UserVO[]
    pages?: number
  }

  type LoginUserVO = {
    id?: number
    userName?: string
    userAccount?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    editTime?: string
    createTime?: string
    updateTime?: string
  }

  type Output = {
    taskId?: string
    taskStatus?: string
    submitTime?: string
    scheduledTime?: string
    endTime?: string
    outputImageUrl?: string
    code?: string
    message?: string
  }

  type Parameters = {
    angle?: number
    yScale?: number
    xScale?: number
  }

  type Picture = {
    id?: number
    picName?: string
    picUrl?: string
    thumbnailUrl?: string
    picIntro?: string
    picCategory?: string
    picTags?: string
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    picStatus?: number
    userId?: number
    spaceId?: number
    reviewStatus?: number
    reviewMessage?: string
    reviewerId?: number
    reviewTime?: string
    isDelete?: number
    editTime?: string
    createTime?: string
    updateTime?: string
  }

  type PictureCreateOutPaintingTaskRequest = {
    pictureId?: number
    parameters?: Parameters
  }

  type PictureEditRequest = {
    id?: number
    picName?: string
    picIntro?: string
    picCategory?: string
    picStatus?: number
    picTags?: string[]
  }

  type PictureQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    picName?: string
    picIntro?: string
    picCategory?: string
    picTags?: string[]
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    picStatus?: number
    userId?: number
    spaceId?: number
    searchText?: string
    reviewStatus?: number
    reviewMessage?: string
    reviewerId?: number
    startEditTime?: string
    endEditTime?: string
    reviewTime?: string
  }

  type PictureReviewerRequest = {
    id?: number
    reviewStatus?: number
    reviewMessage?: string
  }

  type PictureTagCategory = {
    tagList?: string[]
    categoryList?: string[]
  }

  type PictureUpdateRequest = {
    id?: number
    picName?: string
    picIntro?: string
    picCategory?: string
    spaceId?: number
    picStatus?: number
    picTags?: string[]
  }

  type PictureUploadByBatchRequest = {
    searchText?: string
    count?: number
    namePrefix?: string
  }

  type PictureUploadRequest = {
    id?: number
    fileUrl?: string
    picName?: string
    spaceId?: number
  }

  type PictureVO = {
    id?: number
    picName?: string
    picUrl?: string
    thumbnailUrl?: string
    picIntro?: string
    picCategory?: string
    picTags?: string[]
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    picStatus?: number
    userId?: number
    spaceId?: number
    user?: UserVO
    editTime?: string
    createTime?: string
    updateTime?: string
  }

  type Space = {
    id?: number
    spaceName?: string
    spaceLevel?: number
    maxSize?: number
    maxCount?: number
    totalSize?: number
    totalCount?: number
    userId?: number
    createTime?: string
    editTime?: string
    updateTime?: string
    isDelete?: number
  }

  type SpaceAddRequest = {
    spaceName?: string
    spaceLevel?: number
  }

  type SpaceEditRequest = {
    id?: number
    spaceName?: string
  }

  type SpaceLevel = {
    value?: number
    text?: string
    maxCount?: number
    maxSize?: number
  }

  type SpaceQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    spaceName?: string
    spaceLevel?: number
    userId?: number
  }

  type SpaceUpdateRequest = {
    id?: number
    spaceName?: string
    spaceLevel?: number
    maxSize?: number
    maxCount?: number
  }

  type SpaceVO = {
    id?: number
    spaceName?: string
    spaceLevel?: number
    maxSize?: number
    maxCount?: number
    totalSize?: number
    totalCount?: number
    userId?: number
    user?: UserVO
    createTime?: string
    editTime?: string
    updateTime?: string
  }

  type uploadPictureParams = {
    pictureUploadRequest: PictureUploadRequest
  }

  type Usage = {
    imageCount?: number
  }

  type User = {
    id?: number
    userName?: string
    userAccount?: string
    userPassword?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    isDelete?: number
    editTime?: string
    createTime?: string
    updateTime?: string
  }

  type UserAddRequest = {
    userName?: string
    userAccount?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    userName?: string
    userAccount?: string
    userProfile?: string
    userRole?: string
    searchText?: string
  }

  type UserRegisterRequest = {
    userAccount?: string
    userPassword?: string
    checkPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userName?: string
    userAccount?: string
    userPassword?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    id?: number
    userName?: string
    userAccount?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    createTime?: string
    updateTime?: string
  }
}
