import db from '~/plugins/db'

export const actions = {
  async saveTvSpecTypesToIndexedDB ({ commit }, tvspectypes) {
    await db.tvspectypes.clear()
    await db.tvspectypes.bulkAdd(tvspectypes)
    commit('tv/getTvSpecTypes', tvspectypes, { root: true })
  },
  async getTvSpecTypesToIndexedDB ({ commit }) {
    const tvspectypes = await db.tvspectypes.toArray()
    commit('tv/getTvSpecTypes', tvspectypes, { root: true })
  }
}
