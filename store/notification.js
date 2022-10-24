export const state = () => ({
  readyForSend: false,
  bills: [],
  codes: [],
  clients: [],
  sendIndex: 0
})
export const mutations = {
  setSendIndex (state, index) {
    state.sendIndex = index
  },
  readyForSend (state) {
    state.readyForSend = true
  },
  setCodes (state, codes) {
    state.codes = codes
  },
  setClients (state, clients) {
    state.clients = clients
  },
  getListOfBills (state, bills) {
    try {
      state.bills = bills
    } catch (error) {
      throw new Error(`GET BILLS MUTATE ${error}`)
    }
  }
}
export const actions = {
  sendWhatsapp ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch('https://graph.facebook.com/v14.0/100480202798133/messages', {
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
              name: 'internet_account_dynamic',
              language: {
                code: 'es'
              },
              components: [
                {
                  type: 'body',
                  parameters: [
                    {
                      type: 'text',
                      text: '15 de noviembre'
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
  notificationSent ({ commit }, payload) {
    const date = Date.now()
    const month = new Date(date).getMonth()
    const year = new Date(date).getFullYear()
    const path = `fac/${payload.city.toLowerCase()}/${payload.clienttype.toLowerCase()}/${month}${year}_${payload.client.code}.pdf`
    try {
      return new Promise((resolve, reject) => {
        const sentBody = {
          data: {
            month: parseInt(month),
            year: parseInt(year),
            path,
            success: payload.success,
            client: payload.client.id
          }
        }
        console.log(sentBody)
        fetch(`${this.$config.API_STRAPI_ENDPOINT}monthlybills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify(sentBody)
        })
          .then(res => res.json())
          .then((monthlybill) => {
            resolve(monthlybill.data)
          })
      })
    } catch (error) {
      throw new Error(`GET CLIENTS ACTION ${error}`)
    }
  },
  getClients ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        city: {
          name: payload.city
        },
        clienttype: {
          name: payload.clienttype
        }
      },
      pagination: {
        pageSize: 20000
      }
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
          .then((clients) => {
            resolve(clients.data)
          })
      })
    } catch (error) {
      throw new Error(`GET CLIENTS ACTION ${error}`)
    }
  },
  async getListOfBills ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}listofbills?city=${payload.city}&clienttype=${payload.clienttype}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((bills) => {
          commit('getListOfBills', bills.data)
        })
    } catch (error) {
      throw new Error(`GET BILLS ACTION ${error}`)
    }
  }
}
