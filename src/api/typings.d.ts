declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    description?: string
    message?: string
  }

  type BaseResponseIPagePicture_ = {
    code?: number
    data?: IPagePicture_
    description?: string
    message?: string
  }

  type BaseResponseIPagePictureVO_ = {
    code?: number
    data?: IPagePictureVO_
    description?: string
    message?: string
  }

  type BaseResponseIPageUserVO_ = {
    code?: number
    data?: IPageUserVO_
    description?: string
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    description?: string
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    description?: string
    message?: string
  }

  type BaseResponsePicture_ = {
    code?: number
    data?: Picture
    description?: string
    message?: string
  }

  type BaseResponsePictureTagCategory_ = {
    code?: number
    data?: PictureTagCategory
    description?: string
    message?: string
  }

  type BaseResponsePictureVO_ = {
    code?: number
    data?: PictureVO
    description?: string
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    description?: string
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    description?: string
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    description?: string
    message?: string
  }

  type DeleteRequest = {
    id?: number
  }

  type getPictureByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getPictureVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id: number
  }

  type IPagePicture_ = {
    current?: number
    pages?: number
    records?: Picture[]
    size?: number
    total?: number
  }

  type IPagePictureVO_ = {
    current?: number
    pages?: number
    records?: PictureVO[]
    size?: number
    total?: number
  }

  type IPageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type LoginUserVO = {
    createTime?: string
    editTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type Picture = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    picCategory?: string
    picFormat?: string
    picHeight?: number
    picIntro?: string
    picName?: string
    picScale?: number
    picSize?: number
    picTags?: string
    picUrl?: string
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    updateTime?: string
    userId?: number
  }

  type PictureEditRequest = {
    id?: number
    picCategory?: string
    picIntro?: string
    picName?: string
    picTags?: string[]
  }

  type PictureQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    picCategory?: string
    picFormat?: string
    picHeight?: number
    picIntro?: string
    picName?: string
    picScale?: number
    picSize?: number
    picTags?: string[]
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    searchText?: string
    sortField?: string
    sortOrder?: string
    userId?: number
  }

  type PictureReviewerRequest = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type PictureTagCategory = {
    categoryList?: string[]
    tagList?: string[]
  }

  type PictureUpdateRequest = {
    id?: number
    picCategory?: string
    picIntro?: string
    picName?: string
    picTags?: string[]
  }

  type PictureUploadRequest = {
    fileUrl?: string
    id?: number
  }

  type PictureVO = {
    createTime?: string
    editTime?: string
    id?: number
    picCategory?: string
    picFormat?: string
    picHeight?: number
    picIntro?: string
    picName?: string
    picScale?: number
    picSize?: number
    picTags?: string[]
    picUrl?: string
    picWidth?: number
    updateTime?: string
    user?: UserVO
    userId?: number
  }

  type uploadPictureUsingPOSTParams = {
    fileUrl?: string
    id?: number
  }

  type User = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserAddRequest = {
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    searchText?: string
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
