export const state = () => ({
  e1: 1,
  readyForSend: false,
  bills: [],
  codes: [],
  clients: [],
  sendIndex: 0,
  month: null
})
export const mutations = {
  e1 (state, payload) {
    state.e1 = payload.e1
  },
  setMonth (state, payload) {
    state.month = payload.month
  },
  setClientSuccess (state, payload) {
    state.clients[payload.index].messageSent = payload.success
  },
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
                      text: `${payload.month.text}`
                    },
                    {
                      type: 'text',
                      text: `15 de ${payload.month.text}`
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
  async updateSentStatus ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        client: payload.client.id
      },
      sort: 'createdAt:desc'
    },
    {
      encodeValuesOnly: true
    })
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}monthlybills?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      }
    })
      .then((raw) => {
        if (raw.status === 200) {
          return raw.json()
        } else {
          this.$toast.error('No existe el movimiento monthlybill err#107')
          return false
        }
      })
      .then(async (monthlybills) => {
        if (!monthlybills) {
          return false
        }
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}monthlybills/${monthlybills.data[0].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              success: payload.success
            }
          })
        })
          .then((res) => {
            if (res.status === 200) {
              return res.json()
            } else {
              this.$toast.error('No se pudo actualizar movimiento err#131')
              commit('setClientSuccess', {
                index: payload.index,
                success: payload.success
              })
              return false
            }
          })
          .then((res) => {
            if (!res) {
              return false
            }
            this.$toast.info('Exito al actualizar movimiento')
            commit('setClientSuccess', {
              index: payload.index,
              success: payload.success
            })
          })
      })
  },
  createBillAccount ({ commit }, payload) {
    const date = Date.now()
    const year = new Date(date).getFullYear()
    const path = `fac/${payload.month.value}/${payload.city.toLowerCase()}/${payload.clienttype.toLowerCase()}/${payload.month.value}${year}_${payload.client.code}.pdf`
    try {
      return new Promise((resolve, reject) => {
        const sentBody = {
          data: {
            month: parseInt(payload.month.value),
            year: parseInt(year),
            path,
            success: payload.success,
            client: payload.client.id,
            type: payload.clienttype.toLowerCase()
          }
        }
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
          .catch((err) => {
            reject(err)
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
        },
        monthlybills: {
          $or: [
            {
              month: {
                $ne: parseInt(payload.month.value)
              }
            },
            {
              path: {
                $null: true
              }
            }
          ]
        },
        phone: {
          $ne: '0'
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
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}listofbills?city=${payload.city}&clienttype=${payload.clienttype}&month=${payload.month.value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((bills) => {
          if (bills.data === null) {
            commit('getListOfBills', [])
          } else {
            commit('getListOfBills', bills.data)
          }
        })
    } catch (error) {
      throw new Error(`GET BILLS ACTION ${error}`)
    }
  }
}
