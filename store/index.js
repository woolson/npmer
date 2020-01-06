export const state = {
  account: undefined,
  templateData: {},
  templateUseVisible: false
}

export const mutations = {
  UPDATE_ACCOUNT (state, payload) {
    state.account = payload
  },
  UPDATE_STATE (state, payload) {
    Object.assign(state, payload)
  }
}
