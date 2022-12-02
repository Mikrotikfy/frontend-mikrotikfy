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
  },
  getMenuFromDatabase ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}menus?sort=priority:asc`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((menu) => {
            commit('getMenuFromDatabase', menu.data)
            resolve(menu.data)
          })
      })
    } catch (error) {
      throw new Error(`MENU ACTION ${error}`)
    }
  }
}
