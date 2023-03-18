export const state = () => ({
  menu: []
})
export const mutations = {
  getMenuFromDatabase (state, menuList) {
    try {
      state.menu = menuList
    } catch (error) {
      throw new Error(`MENU MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getMenuFromDatabase ({ dispatch, commit }, payload) {
    const isConnected = await this.$checkInternetConnection()
    if (isConnected) {
      try {
        const qs = require('qs')
        const query = qs.stringify({
          populate: ['menus']
        },
        {
          encodeValuesOnly: true
        })
        return new Promise((resolve, reject) => {
          fetch(`${this.$config.API_STRAPI_ENDPOINT}users/${payload.userId}?${query}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${payload.token}`
            }
          })
            .then(res => res.json())
            .then((menu) => {
              const menuList = menu.menus.sort((a, b) => a.priority - b.priority)
              commit('getMenuFromDatabase', menuList) // get menu from database
              dispatch('offline/menuloc/saveMenusToIndexedDB', menuList, { root: true }) // save menu to indexedDB
              resolve(menuList)
            })
        })
          .catch((error) => {
            throw new Error(`MENU ACTION ${error}`)
          })
      } catch (error) {
        throw new Error(`MENU ACTION ${error}`)
      }
    } else { // if not connected to internet
      dispatch('offline/menuloc/getMenusFromIndexedDB', payload, { root: true })
    }
  },
  removeAlertOnMenu ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}menus/${payload.menuId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              alert: false
            }
          })
        })
          .then(res => res.json())
          .then((menu) => {
            resolve(menu.data)
          })
      })
    } catch (error) {
      throw new Error(`MENU ACTION ${error}`)
    }
  }
}
