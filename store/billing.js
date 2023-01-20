export const state = () => ({
  clients: [],
  billingInfo: {
    clientId: null,
    bills: []
  },
  total: 0,
  month: null,
  headers: [],
  selected: [],
  resetSelected: 0,
  showArchive: false
})
export const mutations = {
  editBill (state, payload) {
    state.billingInfo.bills[payload.index].payed = payload.payed
    state.billingInfo.bills[payload.index].details = payload.details
  },
  addDeposit (state, payload) {
    state.billingInfo.bills[payload.index].deposits.push({
      id: 3,
      amount: payload.amount,
      details: payload.details,
      createdAt: payload.createdAt
    })
  },
  getCurrentMonth (state) {
    const date = new Date()
    const month = date.getMonth() + 1
    state.month = month
  },
  toggleArchive (state, _) {
    state.showArchive = !state.showArchive
  },
  setBillingInfo (state, billingInfo) {
    state.billingInfo = billingInfo
  },
  setSelected (state, selected) {
    state.selected = selected
  },
  resetSelected (state) {
    state.selected = []
    state.resetSelected++
  },
  setTotal (state, total) {
    state.total = total
  },
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
      for: movement.for,
      billingMonth: movement.billingMonth,
      details: movement.details,
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
      const data = {
        clientId: billingInfo.clientid,
        clientName: billingInfo.clientname,
        bills: [
          { // ESTO ES UNA FACTURA
            id: 1,
            active: true,
            payed: false,
            createdAt: new Date('Sat Jan 25 2022 12:47:26 GMT-0500'),
            details: 'FEBRERO',
            type: { // ESTE ES EL TIPO DE MOVIMIENTO
              id: 1,
              name: 'MENSUALIDAD', // tipos de movimiento son: 'MENSUALIDAD', 'COBRO ROUTER', 'TRASLADO', 'DESCUENTO', ETC...
              billingMonth: 2,
              price: 50000
            },
            deposits: [ // ESTOS SON LOS ABONOS
              {
                id: 1,
                amount: 10000,
                details: 'Pago de factura',
                date: new Date('Sat Jan 26 2022 12:47:26 GMT-0500')
              },
              {
                id: 2,
                amount: 10000,
                details: 'Pago de factura',
                date: new Date('Sat Jan 27 2022 12:47:26 GMT-0500')
              }
            ]
          },
          { // ESTO ES UNA FACTURA
            id: 2,
            active: true,
            payed: false,
            createdAt: new Date('Sat Jan 25 2022 12:47:26 GMT-0500'),
            details: '',
            type: { // ESTE ES EL TIPO DE MOVIMIENTO
              id: 1,
              name: 'CAMBIO ROUTER', // tipos de movimiento son: 'MENSUALIDAD', 'COBRO ROUTER', 'TRASLADO', 'DESCUENTO', ETC...
              billingMonth: null,
              price: 80000
            },
            deposits: [ // ESTOS SON LOS ABONOS
            ]
          }
        ]
      }
      const filtered = data.bills.filter(item => billingInfo.showArchive ? item.active === false : item.active === true)
      data.bills = filtered
      state.billingInfo = data
    } catch (error) {
      throw new Error(`GET BILLING INFO BY CLIENT ID MUTATE ${error}`)
    }
  }
}
export const actions = {
  addMovement ({ commit }, payload) {
    commit('addMovement', payload)
  },
  addDeposit ({ commit }, payload) {
    commit('addDeposit', payload)
  },
  editBill ({ commit }, payload) {
    commit('editBill', payload)
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
  getBillsByClientId ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      populate: ['monthlybills']
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.client.id}?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((res) => {
            resolve(res.data)
          })
      })
    } catch (error) {
      throw new Error(`GET BILLS BY CLIENT ID ACTION ${error}`)
    }
  },
  sendBill ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(this.$config.META_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$config.META_TOKEN}`
        },
        body: JSON.stringify(
          {
            messaging_product: 'whatsapp',
            to: `57${payload.client.phone}`,
            type: 'template',
            template: {
              name: this.$config.META_TEMPLATE,
              language: {
                code: 'es'
              },
              components: [
                {
                  type: 'body',
                  parameters: [
                    {
                      type: 'text',
                      text: `${payload.bill.month.text}`
                    },
                    {
                      type: 'text',
                      text: `15 de ${payload.bill.month.text}`
                    }
                  ]
                },
                {
                  type: 'button',
                  sub_type: 'url',
                  index: '0',
                  parameters: [
                    {
                      type: 'text',
                      text: `${payload.client.dni}`
                    }
                  ]
                }
              ]
            }
          }
        )
      })
        .then(res => res.json())
        .then((res) => {
          resolve(res)
        })
    })
  },
  updateResend ({ commit }, payload) {
    const resend = payload.bill.resend + 1
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}monthlybills/${payload.bill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            resend,
            resend_at: new Date()
          }
        })
      }).then(res => res.json())
        .then((res) => {
          resolve(res)
        })
    })
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
