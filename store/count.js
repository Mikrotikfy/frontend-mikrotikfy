export const state = () => ({
  clientCount: {
    active: 0,
    clientCount: 0,
    clientCountActive: 0,
    clientCountDisable: 0,
    clientCountRetired: 0
  }
})
export const mutations = {
  activeClients (state, clients) {
    try {
      state.activeClients = clients.length
    } catch (error) {
      throw new Error(`ACTIVECOUNT MUTATE ${error}`)
    }
  },
  clientCount (state, res) {
    try {
      state.clientCount.clientCount = res.data.clientCount
    } catch (error) {
      throw new Error(`CLIENTCOUNT MUTATE ${error}`)
    }
  },
  clientCountActive (state, res) {
    try {
      state.clientCount.clientCountActive = res.data.clientCountActive
    } catch (error) {
      throw new Error(`CLIENTCOUNTACTIVE MUTATE ${error}`)
    }
  },
  clientCountDisable (state, res) {
    try {
      state.clientCount.clientCountDisable = res.data.clientCountDisable
    } catch (error) {
      throw new Error(`CLIENTCOUNTDISABLE MUTATE ${error}`)
    }
  },
  clientCountRetired (state, res) {
    try {
      state.clientCount.clientCountRetired = res.data.clientCountRetired
    } catch (error) {
      throw new Error(`CLIENTCOUNTRETIRED MUTATE ${error}`)
    }
  }
}
export const actions = {
  async activeClients ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}activeclients?city=${payload.city}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then(async (clients) => {
          localStorage.setItem('activeClients', clients.length)
          const clientActiveList = await clients.map((c) => {
            return c.name
          })
          localStorage.setItem('activeClientsList', JSON.stringify(clientActiveList))
          commit('activeClients', clients)
        })
    } catch (error) {
      throw new Error(`ACTIVECOUNT ACTION ${error}`)
    }
  }
}
