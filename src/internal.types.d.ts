export type ISpecStore = {
  name?: string
  path?: string
  options?: ISpecStoreOptions
  cb?: Function
}

export type ISpecStoreOptions = {
  status?: 'PASSED' | 'FAILED'
  append?: boolean
}