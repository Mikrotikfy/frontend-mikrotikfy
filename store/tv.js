export const state = () => ({
  spectypes: []
})
export const mutations = {
  getTvSpecTypes (state, spectypes) {
    try {
      state.spectypes = spectypes
    } catch (error) {
      throw new Error(`TV SPEC TYPES MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getTvSpecTypes ({ commit, dispatch }, payload) {
    const isConnected = await this.$checkInternetConnection()
    if (isConnected) {
      try {
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}tvspectypes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((spectypes) => {
            commit('getTvSpecTypes', spectypes.data) // get tvspec types from database
            dispatch('offline/tvloc/saveTvSpecTypesToIndexedDB', spectypes.data, { root: true }) // save tvspec types to indexedDB
          })
      } catch (error) {
        throw new Error(`TV SPEC TYPES ACTION ${error}`)
      }
    } else {
      dispatch('offline/tvloc/getTvSpecTypesFromIndexedDB', payload, { root: true })
    }
  },
  saveSpecs ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}tvspecs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              client: payload.client.id,
              ticketdetail: payload.ticketdetail.id,
              ticket: payload.ticket.id,
              high: payload.specs.high,
              down: payload.specs.down,
              tvs: payload.specs.tvs,
              tvspectype: payload.specs.tvspectype.id
            }
          })
        })
          .then((res) => {
            if (res.status === 200) {
              this.$toast.success('Ficha tecnica actualizada con éxito.', { duration: 4000 })
              resolve(res)
            }
          })
      })
    } catch (error) {
      throw new Error(`TV SPECS SAVE ${error}`)
    }
  }
}
