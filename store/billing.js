export const state = () => ({
  clients: [],
  headers: []
})
export const mutations = {
  getClientsBySearch (state, clients) {
    try {
      state.clients = clients.data
    } catch (error) {
      throw new Error(`BILLING CLIENTS SEARCH MUTATE ${error}`)
    }
  },
  getHeadersByClientType (state, headers) {
    try {
      state.headers = headers
    } catch (error) {
      throw new Error(`GET BILLING HEADERS BY CLIENT TYPE MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getClientsBySearch ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          $and: [
            {
              city: {
                name: payload.city
              }
            },
            {
              clienttype: {
                name: payload.clienttype
              }
            },
            {
              $or: [
                {
                  name: {
                    $contains: payload.search
                  }
                },
                {
                  code: payload.search
                },
                {
                  dni: payload.search
                }
              ]
            }
          ]
        },
        populate: ['neighborhood', 'plan', 'technology']
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((clients) => {
          commit('getClientsBySearch', clients)
        })
    } catch (error) {
      throw new Error(`BILLING CLIENTS SEARCH ACTION ${error}`)
    }
  },
  getHeadersByClientType ({ commit }, { city, clienttype }) {
    const internet = [
      { text: 'Codigo', value: 'code', sortable: false },
      { text: 'Nombre', value: 'name', sortable: false },
      { text: 'Cedula', value: 'dni', sortable: false },
      { text: 'Direccion', sortable: false, value: 'address' },
      { text: 'Barrio', value: 'neighborhood.name', sortable: false },
      { text: 'Telefono', sortable: false, value: 'phone' }
    ]
    const television = [
      { text: 'Codigo', value: 'code', sortable: false },
      { text: 'Nombre', value: 'name', sortable: false },
      { text: 'Cedula', value: 'dni', sortable: false },
      { text: 'Direccion', sortable: false, value: 'address' },
      { text: 'Estado', sortable: false, value: 'active' },
      { text: 'Barrio', value: 'neighborhood.name', sortable: false },
      { text: 'Telefono', sortable: false, value: 'phone' }
    ]

    if (clienttype === 'INTERNET') {
      commit('getHeadersByClientType', internet)
    } else if (clienttype === 'TELEVISION') {
      commit('getHeadersByClientType', television)
    }
  }
}
