import db from '~/plugins/db'

export const actions = {
  async saveMenusToIndexedDB ({ commit }, menus) {
    await db.menus.clear()
    await db.menus.bulkAdd(menus)
    commit('menu/getMenuFromDatabase', menus, { root: true })
  },
  async getMenusFromIndexedDB ({ commit }) {
    const menus = await db.menus.toArray()
    commit('menu/getMenuFromDatabase', menus, { root: true })
  }
}
