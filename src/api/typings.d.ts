declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
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

  type getUserByIdUsingGETParams = {
    /** id */
    id: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id: number
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
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
