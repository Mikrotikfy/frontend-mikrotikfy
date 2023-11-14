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
  async getTvSpecTypes ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tvspectypes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then(({ data: spectypes }) => {
          commit('getTvSpecTypes', spectypes)
        })
    } catch (error) {
      throw new Error(`TV SPEC TYPES ACTION ${error}`)
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
              service: payload.service.id,
              ticketdetail: payload.ticketdetail.id,
              ticket: payload.ticket.id,
              high: payload.specs.high,
              down: payload.specs.down,
              tvs: payload.specs.tvs,
              tvspectype: payload.specs.tvspectype ? payload.specs.tvspectype.id : null
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
