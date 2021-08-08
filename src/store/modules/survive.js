const state = {
  process: false,
  processCode: 'loading',
  errorMsg: '失败'
}

const mutations = {
  CHANGE_PROCESS: (state, process) => {
    state.process = process
  },
  CHANGE_PROCESS_CODE: (state, processCode) => {
    state.processCode = processCode
  },
  CHANGE_ERROR_MESSAGE: (state, msg) => {
    state.errorMsg = msg
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
