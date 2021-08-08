import { Message } from 'element-ui'

export const ErrorMsg = msg => Message({
  type: 'error',
  message: msg
})

export const SuccessMsg = msg => Message({
  type: 'success',
  message: msg
})

export const WarningMsg = msg => Message({
  type: 'warning',
  message: msg
})

export const InfoMsg = msg => Message({
  type: 'info',
  message: msg
})
