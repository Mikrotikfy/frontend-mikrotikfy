export const state = () => ({
  results: []
})
export const mutations = {
  get (state, results) {
    try {
      state.results = results
    } catch (error) {
      throw new Error(`GET RESULTS FROM SEARCH MUTATE ${error}`)
    }
  }
}
export const actions = {
  get ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        const qs = require('qs')
        const query = qs.stringify({
          filters: {
            $or: [
              {
                id: {
                  $contains: payload.search
                }
              },
              {
                code: {
                  $contains: payload.search
                }
              },
              {
                neighborhood: {
                  name: payload.search
                }
              },
              {
                name: {
                  $contains: payload.search
                }
              },
              {
                address: {
                  $contains: payload.search
                }
              },
              {
                technology: {
                  name: payload.search
                }
              },
              {
                plan: {
                  name: payload.search
                }
              },
              {
                dni: payload.search
              },
              {
                phone: payload.search
              }
            ]
          },
          populate: ['city', 'services', 'services.clienttype', 'plan', 'addresses', 'addresses.neighborhood', 'neighborhood', 'technology', 'clienttype', 'vlan', 'offer', 'offer.plan', 'offermovements.offer'],
          orderBy: { id: 'asc' }
        },
        {
          encodeValuesOnly: true
        })
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((results) => {
            commit('get', results.data)
          })
      })
    } catch (error) {
      throw new Error(`GET RESULTS FROM SEARCH ACTION ${error}`)
    }
  }
}
