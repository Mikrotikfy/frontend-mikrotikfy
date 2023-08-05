export const state = () => ({
  clients: [],
  activeClients: [],
  currentClient: null,
  e1: 1,
  invoices: [],
  legalNotes: [],
  billsOnDataRange: [],
  sendIndex: 0,
  billsForCurrentClient: [],
  total: 0,
  month: null,
  year: null,
  headers: [],
  selected: [],
  resetSelected: 0,
  refresh: 1,
  showPayed: false
})
export const mutations = {
  e1 (state, payload) {
    state.e1 = payload.e1
  },
  setYear (state, payload) {
    state.year = payload.year
  },
  setMonth (state, payload) {
    state.month = payload.month
  },
  refresh (state) {
    state.refresh++
  },
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
  togglePayed (state, _) {
    state.showPayed = !state.showPayed
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
  resetInvoices (state) {
    state.invoices = []
    state.legalNotes = []
  },
  resetCurrentClient (state) {
    state.currentClient = {}
  },
  setTotal (state, total) {
    state.total = total
  },
  setShowPayedToFalse (state) {
    state.showPayed = false
  },
  getBillsByDateRange (state, bills) {
    try {
      state.billsOnDataRange = bills
    } catch (error) {
      throw new Error(`BILLING CLIENTS MUTATE ${error}`)
    }
  },
  setPaginationForBillsByDateRange (state, pagination) {
    try {
      state.billsOnDataRangePagination = pagination
    } catch (error) {
      throw new Error(`BILLING CLIENTS MUTATE ${error}`)
    }
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
  getBillsByClientId (state, bills) {
    try {
      state.billsForCurrentClient = []
      state.billsForCurrentClient = bills
    } catch (error) {
      throw new Error(`BILLING CLIENTS MUTATE ${error}`)
    }
  },
  getClientsBySearch (state, clients) {
    try {
      state.clients = null
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
  getBillingInfoByClientId (state, data) {
    state.currentClient = data.client
    state.invoices = data.invoices
    state.legalNotes = data.legalNotes
  },
  getListOfActiveClients (state, clients) {
    try {
      state.activeClients = clients
    } catch (error) {
      throw new Error(`GET LIST OF ACTIVE CLIENTS MUTATE ${error}`)
    }
  },
  resetListOfActiveClients (state, clients) {
    try {
      state.activeClients = []
    } catch (error) {
      throw new Error(`GET LIST OF ACTIVE CLIENTS MUTATE ${error}`)
    }
  }
}
export const actions = {
  addMovement ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}invoices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              balance: payload.balance,
              value: payload.balance,
              month: payload.month,
              year: payload.year,
              type: payload.type,
              offer: payload.offer,
              concept: payload.concept,
              details: payload.details,
              payed: payload.payed,
              partial: payload.partial,
              indebt: payload.indebt,
              client: payload.client,
              invoice_type: payload.invoice_type
            }
          })
        })
          .then(res => res.json())
          .then(({ data: invoice }) => {
            resolve(invoice)
          })
      })
    } catch (error) {
      throw new Error(`UPDATE BILLING INFO BY CLIENT ID ACTION ${error}`)
    }
  },
  getInvoiceTypes ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}invoice-types`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((invoiceTypes) => {
            localStorage.setItem('invoiceTypes', JSON.stringify(invoiceTypes.data))
            resolve(invoiceTypes.data)
          })
      })
    } catch (error) {
      throw new Error(`GET BILLING INFO BY CLIENT ID ACTION ${error}`)
    }
  },
  updateInvoice ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}invoices/${payload.invoice.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              payed: payload.payed,
              balance: payload.balance
            }
          })
        })
          .then(res => res.json())
          .then(({ data: invoiceMovement }) => {
            resolve(invoiceMovement)
          })
      })
    } catch (error) {
      throw new Error(`UPDATE BILLING INFO BY CLIENT ID ACTION ${error}`)
    }
  },
  createInvoiceMovement ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}invoice-movements`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              invoice: payload.invoice.id,
              amount: payload.amount,
              details: payload.details,
              biller: payload.biller.id,
              type: payload.type,
              concept: payload.concept,
              legal_note: payload.legalNote ? payload.legalNote : null
            }
          })
        })
          .then(res => res.json())
          .then(({ data: invoiceMovement }) => {
            resolve(invoiceMovement)
          })
      })
    } catch (error) {
      throw new Error(`GET BILLING INFO BY CLIENT ID ACTION ${error}`)
    }
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
  updateClientBalance ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.clientId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              balance: payload.balance
            }
          })
        })
          .then(res => res.json())
          .then(({ data: client }) => {
            resolve(client)
          })
      })
    } catch (error) {
      throw new Error(`UPDATE CLIENT BALANCE ACTION ${error}`)
    }
  },
  createLegalNote ({ commit }, { token, invoices, debit, credit, client, biller, concept, connect = false }) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}legal-notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            data: {
              invoices: connect ? {
                connect: invoices.map(invoice => invoice.id)
              } : [],
              credit,
              debit,
              client,
              concept,
              biller: biller.id
            }
          })
        })
          .then(res => res.json())
          .then(({ data: legalNotes }) => {
            resolve(legalNotes)
          })
      })
    } catch (error) {
      throw new Error(`GET BILLING INFO BY CLIENT ID ACTION ${error}`)
    }
  },
  getBillingInfoByClientId ({ commit }, payload) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        populate: [
          'city',
          'invoices.offer',
          'invoices',
          'invoices.invoice_type',
          'invoices.invoice_movements',
          'invoices.invoice_movements.biller',
          'legal_notes',
          'legal_notes.biller',
          'legal_notes.invoices',
          'legal_notes.invoice_movements'
        ]
      },
      {
        encodeValuesOnly: true
      })
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.clientId}?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((client) => {
            client.data.invoices = client.data.invoices.filter(invoice => invoice.payed === payload.showPayed)
            commit('getBillingInfoByClientId', { invoices: client.data.invoices, legalNotes: client.data.legal_notes, showArchive: payload.showArchive, client: client.data })
            resolve(client.data.invoices)
          })
      })
    } catch (error) {
      throw new Error(`GET BILLING INFO BY CLIENT ID ACTION ${error}`)
    }
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
        populate: ['neighborhood', 'plan', 'technology', 'offer', 'offer.plan', 'offermovements.offer', 'offermovements', 'debtmovements', 'debtmovements.technician']
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
  getBillById ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      populate: [
        'biller',
        'invoices',
        'invoice_movements',
        'client',
        'client.offer',
        'client.neighborhood'
      ]
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}legal-notes/${payload.id}?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((invoice) => {
            resolve(invoice.data)
          })
      })
    } catch (error) {
      throw new Error(`GET BILL BY ID ACTION ${error}`)
    }
  },
  getBillsByDateRange ({ commit }, payload) {
    let filterDebitCredit = {}
    if (payload.debit && !payload.credit) {
      filterDebitCredit.credit = 0
    } else if (payload.credit && !payload.debit) {
      filterDebitCredit.debit = 0
    } else if (payload.credit && payload.debit) {
      filterDebitCredit = {}
    }
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        $and: [
          filterDebitCredit,
          {
            city: payload.city
          },
          {
            clienttype: payload.clienttype
          },
          {
            createdAt: {
              $gte: payload.from + 'T00:00:00'
            }
          },
          {
            createdAt: {
              $lte: payload.to + 'T23:59:59'
            }
          }
        ]
      },
      populate: [
        'biller',
        'invoices',
        'invoice_movements',
        'client',
        'client.offer',
        'client.neighborhood'
      ],
      pagination: payload.pagination
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}legal-notes?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((invoices) => {
            commit('getBillsByDateRange', invoices.data)
            resolve(invoices)
          })
      })
    } catch (error) {
      throw new Error(`GET BILLS BY DATE RANGE ACTION ${error}`)
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
            commit('getBillsByClientId', res.data)
            resolve(res.data)
          })
      })
    } catch (error) {
      throw new Error(`GET BILLS BY CLIENT ID ACTION ${error}`)
    }
  },
  getListOfActiveClients ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        active: payload.active,
        indebt: payload.indebt,
        city: {
          name: payload.city
        },
        clienttype: {
          name: payload.clienttype
        }
      },
      pagination: {
        pageSize: 5000
      },
      populate: ['offer', 'addresses']
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: clients }) => {
            commit('getListOfActiveClients', clients)
            resolve(clients)
          })
      })
    } catch (error) {
      throw new Error(`GET LIST OF ACTIVE CLIENTS ACTION ${error}`)
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
      { text: 'Estado', sortable: false, value: 'active' },
      { text: 'Saldo', sortable: false, value: 'balance' }
    ]
    const television = [
      { text: 'Codigo', value: 'code', sortable: false },
      { text: 'Nombre', value: 'name', sortable: false },
      { text: 'Cedula', value: 'dni', sortable: false },
      { text: 'Direccion', sortable: false, value: 'address' },
      { text: 'Barrio', value: 'neighborhood.name', sortable: false },
      { text: 'Estado', sortable: false, value: 'active' },
      { text: 'Saldo', sortable: false, value: 'balance' }
    ]

    if (clienttype === 'INTERNET') {
      commit('getHeadersByClientType', internet)
    } else if (clienttype === 'TELEVISION') {
      commit('getHeadersByClientType', television)
    }
  }
}
