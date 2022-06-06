export const state = () => ({
  clients: [],
  billingInfo: {
    clientId: null,
    movements: []
  },
  headers: []
})
export const mutations = {
  addMovement (state, movement) {
    state.billingInfo.movements.push({
      id: state.billingInfo.movements.length + 1,
      amount: movement.amount,
      details: movement.details,
      type: movement.billtype.name,
      date: new Date()
    })
  },
  addDiscountMovement (state, movement) {
    state.billingInfo.movements.push({
      id: state.billingInfo.movements.length + 1,
      amount: movement.amount,
      type: 'RECAUDO',
      date: new Date()
    })
  },
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
  },
  getBillingInfoByClientId (state, billingInfo) {
    try {
      state.billingInfo = {
        clientId: billingInfo.clientid,
        clientName: billingInfo.clientname,
        movements: [
          {
            id: 1,
            amount: 50000,
            type: 'FACTURACION',
            date: new Date('Sat Jan 01 2022 12:47:26 GMT-0500')
          },
          {
            id: 2,
            amount: 50000,
            type: 'RECAUDO',
            date: new Date('Sat Feb 01 2022 12:47:26 GMT-0500')
          },
          {
            id: 3,
            amount: 50000,
            type: 'FACTURACION',
            date: new Date('Sat Mar 01 2022 12:47:26 GMT-0500')
          },
          {
            id: 4,
            amount: 50000,
            type: 'RECAUDO',
            date: new Date('Sat Apr 01 2022 12:47:26 GMT-0500')
          },
          {
            id: 5,
            amount: 50000,
            type: 'FACTURACION',
            date: new Date('Sat May 01 2022 12:47:26 GMT-0500')
          },
          {
            id: 6,
            amount: 80000,
            type: 'ROUTER NUEVO',
            details: 'SE LE QUEMO EL ROUTER',
            date: new Date('Sat Jun 01 2022 12:47:26 GMT-0500')
          },
          {
            id: 7,
            amount: 20000,
            details: 'Se traslado para la calle 4 # 5 - 76',
            type: 'TRASLADO',
            date: new Date('Sat Jun 01 2022 12:47:26 GMT-0500')
          },
          {
            id: 8,
            amount: 50000,
            type: 'RECAUDO',
            date: '01/01/2022'
          },
          {
            id: 9,
            amount: 50000,
            type: 'FACTURACION',
            date: '01/02/2022'
          },
          {
            id: 10,
            amount: 50000,
            type: 'RECAUDO',
            date: '01/03/2022'
          },
          {
            id: 11,
            amount: 50000,
            type: 'FACTURACION',
            date: '01/04/2022'
          },
          {
            id: 12,
            amount: 50000,
            type: 'RECAUDO',
            date: '01/05/2022'
          },
          {
            id: 13,
            amount: 80000,
            type: 'ROUTER NUEVO',
            date: '01/05/2022'
          },
          {
            id: 14,
            amount: 20000,
            type: 'TRASLADO',
            date: '01/06/2022'
          },
          {
            id: 15,
            amount: 50000,
            type: 'RECAUDO',
            date: '01/03/2022'
          },
          {
            id: 16,
            amount: 50000,
            type: 'FACTURACION',
            date: '01/04/2022'
          },
          {
            id: 17,
            amount: 50000,
            type: 'RECAUDO',
            date: '01/05/2022'
          },
          {
            id: 18,
            amount: 80000,
            type: 'ROUTER NUEVO',
            date: '01/05/2022'
          },
          {
            id: 19,
            amount: 20000,
            type: 'TRASLADO',
            date: '01/06/2022'
          },
          {
            id: 20,
            amount: 20000,
            type: 'TRASLADO',
            date: '01/06/2022'
          }
        ]
      }
    } catch (error) {
      throw new Error(`GET BILLING INFO BY CLIENT ID MUTATE ${error}`)
    }
  }
}
export const actions = {
  addMovement ({ commit }, payload) {
    commit('addMovement', payload)
  },
  addDiscountMovement ({ commit }, payload) {
    try {
      commit('addDiscountMovement', payload)
    } catch (error) {
      throw new Error(`ADD MOVEMENT ACTION ${error}`)
    }
  },
  getBillingInfoByClientId ({ commit }, payload) {
    try {
      commit('getBillingInfoByClientId', payload)
    } catch (error) {
      throw new Error(`GET BILLING INFO BY CLIENT ID ACTION ${error}`)
    }
    // const clientId = payload.clientId
    // const qs = require('qs')
    // const query = qs.stringify({
    //   filters: {},
    //   populate: []
    // },
    // {
    //   encodeValuesOnly: true
    // })
    // await fetch(`${this.$config.API_STRAPI_ENDPOINT}contenttype`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${payload.token}`
    //   },
    //   body: JSON.stringify({})
    // })
    //   .then(res => res.json())
    //   .then((res) => {

    //   })
  },
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
