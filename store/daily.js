export const state = () => ({
  headers: [],
  traslateheaders: [],
  selectedcx: [],
  selectedtr: []
})
export const mutations = {
  getHeadersByClientType (state, payload) {
    state.headers = payload
  },
  getTraslateHeadersByClientType (state, payload) {
    state.traslateheaders = payload
  },
  setSelectedCx (state, payload) {
    state.selectedcx = payload
  },
  setSelectedTr (state, payload) {
    state.selectedtr = payload
  }
}
export const actions = {
  getPendingTraslates ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const qs = require('qs')
      const query = qs.stringify({
        populate: [
          'client',
          'client.neighborhood',
          'client.plan',
          'client.technology',
          'client.addresses',
          'client.addresses.neighborhood'
        ],
        filters: {
          active: true,
          tickettype: {
            name: 'TRASLADO'
          },
          city: {
            name: payload.city
          },
          clienttype: {
            name: payload.clienttype
          }
        },
        sort: ['createdAt:desc']
      },
      {
        encodeValuesOnly: true
      })
      try {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((tickets) => {
            const clients = tickets.data.map((ticket) => {
              ticket.client.ticketCreatedAt = ticket.createdAt
              ticket.client.ticketid = ticket.id
              return ticket.client
            })
            resolve(clients)
          })
      } catch (error) {
        throw new Error(`ACTION ${error}`)
      }
    })
  },
  getPendingClients ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const qs = require('qs')
      const query = qs.stringify({
        populate: [
          'neighborhood',
          'plan',
          'technology',
          'addresses',
          'addresses.neighborhood'
        ],
        filters: {
          active: false,
          city: {
            name: payload.city
          },
          clienttype: {
            name: payload.clienttype
          }
        },
        sort: ['code:desc']
      },
      {
        encodeValuesOnly: true
      })
      try {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((clients) => {
            resolve(clients.data)
          })
      } catch (error) {
        throw new Error(`ACTION ${error}`)
      }
    })
  },
  getHeadersByClientType ({ commit }, { city, clienttype }) {
    const internet = [
      { text: 'Codigo', value: 'code', sortable: false },
      { text: 'Nombre', value: 'name', sortable: false },
      { text: 'Cedula', value: 'dni', sortable: false },
      { text: 'Direccion', sortable: false, value: 'address' },
      { text: 'Barrio', value: 'neighborhood.name', sortable: false },
      { text: 'Telefono', sortable: false, value: 'phone' },
      { text: 'Plan', value: 'plan.name', sortable: false },
      { text: 'Pendiente desde', value: 'createdAt', sortable: false },
      { text: '', value: 'actions', sortable: false }
    ]
    const television = [
      { text: 'Codigo', value: 'code', sortable: false },
      { text: 'Nombre', value: 'name', sortable: false },
      { text: 'Cedula', value: 'dni', sortable: false },
      { text: 'Direccion', sortable: false, value: 'address' },
      { text: 'Estado', sortable: false, value: 'active' },
      { text: 'Barrio', value: 'neighborhood.name', sortable: false },
      { text: 'Telefono', sortable: false, value: 'phone' },
      { text: 'Pendiente desde', value: 'createdAt', sortable: false },
      { text: '', value: 'actions', sortable: false }
    ]

    if (clienttype === 'INTERNET') {
      commit('getHeadersByClientType', internet)
    } else if (clienttype === 'TELEVISION') {
      commit('getHeadersByClientType', television)
    }
  },
  getTraslateHeadersByClientType ({ commit }, { city, clienttype }) {
    const internet = [
      { text: 'Codigo', value: 'code', sortable: false },
      { text: 'Nombre', value: 'name', sortable: false },
      { text: 'Cedula', value: 'dni', sortable: false },
      { text: 'Direccion', sortable: false, value: 'address' },
      { text: 'Barrio', value: 'neighborhood.name', sortable: false },
      { text: 'Telefono', sortable: false, value: 'phone' },
      { text: 'Plan', value: 'plan.name', sortable: false },
      { text: 'Tecnologia', value: 'technology.name', sortable: false },
      { text: 'Pendiente desde', value: 'createdAt', sortable: false },
      { text: '', value: 'actions', sortable: false }
    ]
    const television = [
      { text: 'Codigo', value: 'code', sortable: false },
      { text: 'Nombre', value: 'name', sortable: false },
      { text: 'Cedula', value: 'dni', sortable: false },
      { text: 'Direccion', sortable: false, value: 'address' },
      { text: 'Estado', sortable: false, value: 'active' },
      { text: 'Barrio', value: 'neighborhood.name', sortable: false },
      { text: 'Telefono', sortable: false, value: 'phone' },
      { text: 'Pendiente desde', value: 'createdAt', sortable: false },
      { text: '', value: 'actions', sortable: false }
    ]

    if (clienttype === 'INTERNET') {
      commit('getTraslateHeadersByClientType', internet)
    } else if (clienttype === 'TELEVISION') {
      commit('getTraslateHeadersByClientType', television)
    }
  }
}
