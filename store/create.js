export const state = () => ({
  e1: 1
})
export const mutations = {
  sete1 (state, e1) {
    try {
      state.e1 = e1
    } catch (error) {
      throw new Error(`CREATE e1 MUTATE ${error}`)
    }
  }
}
export const actions = {}
