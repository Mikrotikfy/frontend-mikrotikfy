export const state = () => ({
  clients: [],
  clienttypes: [],
  clientsByDni: [],
  currentClientCode: null,
  clientForDeviceManipulation: null,
  headers: null
})
export const mutations = {
  updateClientPassword (state, payload) {
    try {
      state.clients[payload.index].update_password = !state.clients[payload.index].update_password
    } catch (error) {
      throw new Error(`MUTATE UPDATE CLIENT PASSWORD ${error}`)
    }
  },
  clearClientsFromDatatable (state) {
    state.clients = []
  },
  getUsersFromDatabase (state, clientsList) {
    try {
      state.clients = clientsList.data.results
      state.pagination = clientsList.data.pagination
    } catch (error) {
      throw new Error(`MUTATE SEARCH CLIENT${error}`)
    }
  },
  setActiveFromModal (state, payload) {
    state.clients[payload.index].active = payload.active
  },
  getUsersFromDatabaseByTypeAndCity (state, clientsList) {
    try {
      state.clientsForOlt = clientsList
    } catch (error) {
      throw new Error(`MUTATE OLT CLIENT${error}`)
    }
  },
  getClientTypesFromDatabase (state, clienttypesList) {
    try {
      state.clienttypes = clienttypesList
    } catch (error) {
      throw new Error(`MUTATE CLIENT TYPES${error}`)
    }
  },
  updateFromModal (state, client) {
    try {
      state.clients[client.index].plan = client.newPlan
    } catch (error) {
      throw new Error(`MUTATE ${error}`)
    }
  },
  adminToggle (state, { client, index }) {
    try {
      state.clients[index].active = !client.active
    } catch (error) {
      throw new Error(`ADMINTOGGLE MUTATE ${error}`)
    }
  },
  updateClient (state, { client, index }) {
    try {
      Object.assign(state.clients[index], client)
    } catch (error) {
      throw new Error(`UPDATE CLIENT MUTATE ${error}`)
    }
  },
  updateClientDevices (state, { device, index }) {
    try {
      state.clients[index].mac_addresses.push(device)
    } catch (error) {
      throw new Error(`UPDATE CLIENT DEVICE MUTATE ${error}`)
    }
  },
  insertClient (state, client) {
    try {
      // Object.assign(state.clients[0], client)
      state.clients.unshift(client)
    } catch (error) {
      throw new Error(`INSERT CLIENT MUTATE ${error}`)
    }
  },
  getHeadersByClientType (state, headers) {
    try {
      state.headers = headers
    } catch (error) {
      throw new Error(`GET HEADERS BY CLIENT TYPE MUTATE ${error}`)
    }
  },
  setPlanFromModal (state, payload) {
    try {
      if (payload.clientIndex !== null) {
        state.clients[payload.clientIndex].offer = payload.newPlan
      }
    } catch (error) {
      throw new Error(`SET PLAN FROM MODAL MUTATE ${error}`)
    }
  },
  setAuxPlan (state, payload) {
    try {
      state.clients[payload.index].plan = payload.plan
    } catch (error) {
      throw new Error(`SET AUX PLAN MUTATE ${error}`)
    }
  },
  getByDni (state, payload) {
    try {
      state.clientsByDni = payload
    } catch (error) {
      throw new Error(`GET BY DNI MUTATE ${error}`)
    }
  },
  clientForDeviceManipulation (state, payload) {
    try {
      state.clientForDeviceManipulation = payload
    } catch (error) {
      throw new Error(`CLIENT FOR DEVICE MANIPULATION MUTATE ${error}`)
    }
  },
  getCode (state, payload) {
    try {
      state.currentClientCode = payload[0].code
    } catch (error) {
      throw new Error(`GET CODE MUTATE ${error}`)
    }
  }
}
export const actions = {
  updatePassword ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.client.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              update_password: payload.updatePassword
            }
          })
        }).then((input) => {
          if (input.status === 200) {
            commit('updateClient', { client: payload.client, index: payload.index })
            this.$toast.info('Cambio de clave confirmado', { duration: 4000, position: 'bottom-center' })
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
          throw new Error(`EDIT CLIENT PLAN ACTION ${error}`)
        })
      })
    } catch (error) {
      throw new Error(`EDIT CLIENT PLAN ACTION ${error}`)
    }
  },
  async clearClientsFromDatatable ({ commit }) {
    try {
      await commit('clearClientsFromDatatable', true)
    } catch (error) {
      throw new Error(`CLEAR CLIENT ACTION ${error}`)
    }
  },
  async getUsersFromDatabaseBySearch ({ commit }, payload) {
    const qs = require('qs')
    const pagination = qs.stringify({
      pagination: payload.pagination
    },
    {
      encodeValuesOnly: true
    })
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}searchclient?search=${payload.search}&city=${payload.city}&clienttype=${payload.clienttype}&${pagination}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((clients) => {
          commit('getUsersFromDatabase', clients)
        })
    } catch (error) {
      throw new Error(`ACTION ${error}`)
    }
  },
  createTicketForNewClient ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              active: true,
              escalated: false,
              answered: false,
              city: payload.city,
              client: payload.client.id,
              tickettype: 36,
              assignated: 22,
              clienttype: payload.clienttype.id,
              channel: 'office',
              details: `
                CX: ${payload.client.address} ${payload.neighborhood.name}
              `
            }
          })
        }).then((input) => {
          if (input.status === 200) {
            this.$toast.info('Orden de instalacion creada', { duration: 4000, position: 'bottom-center' })
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
          throw new Error(`EDIT CLIENT PLAN ACTION ${error}`)
        })
      })
    } catch (error) {
      throw new Error(`EDIT CLIENT PLAN ACTION ${error}`)
    }
  },
  async insertClient ({ commit }, client) {
    try {
      // Object.assign(state.clients[0], client)
      await commit('insertClient', client)
    } catch (error) {
      throw new Error(`INSERT CLIENT ACTION ${error}`)
    }
  },
  getCode ({ commit }, payload) {
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
      sort: ['id:desc']
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
          .then((client) => {
            commit('getCode', client.data)
            resolve(client.data)
          })
      })
    } catch (error) {
      throw new Error(`ACTION GET CODE FROM LAST CLIENT ${error}`)
    }
  },
  getClientTypesFromDatabase ({ commit }, token) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clienttypes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then((clienttypes) => {
            commit('getClientTypesFromDatabase', clienttypes.data)
            resolve(clienttypes.data)
            localStorage.setItem('clienttypes', JSON.stringify(clienttypes.data))
          })
      })
    } catch (error) {
      throw new Error(`ACTION ${error}`)
    }
  },
  createAddress ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              address: payload.address,
              neighborhood: payload.neighborhood.id,
              client: payload.client.id
            }
          })
        }).then((input) => {
          if (input.status === 200) {
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
          throw new Error(`CREATE ADDRESS ACTION ${error}`)
        })
      })
    } catch (error) {
      throw new Error(`CREATE ADDRESS ACTION ${error}`)
    }
  },
  async getUsersFromDatabaseByTypeAndCity ({ commit }, payload) {
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
        pageSize: payload.pagination.pageSize || 25
      },
      populate: ['technology', 'neighborhood']
    },
    {
      encodeValuesOnly: true
    })
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((clients) => {
          commit('getUsersFromDatabaseByTypeAndCity', clients.data)
        })
    } catch (error) {
      throw new Error(`ACTION OLT CLIENTS ${error}`)
    }
  },
  updateFromModal ({ commit }, client) {
    try {
      commit('updateFromModal', client)
    } catch (error) {
      throw new Error(`MUTATE ${error}`)
    }
  },
  setAuxPlan ({ commit }, payload) {
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
              plan: payload.plan.id
            }
          })
        })
          .then(res => res.json())
          .then((client) => {
            if (payload.index) {
              commit('setAuxPlan', { client: client.data, index: payload.index, plan: payload.plan })
            }
            resolve(client)
          })
      })
    } catch (error) {
      throw new Error(`ACTION AUX PLAN SET ${error}`)
    }
  },
  getByDni ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        dni: payload.dni
      },
      populate: [
        'monthlybills',
        'city',
        'addresses',
        'addresses.neighborhood',
        'clienttype'
      ]
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then((client) => {
            resolve(client.data)
            commit('getByDni', client.data)
          })
      })
    } catch (error) {
      throw new Error(`CLIENT FROM PUBLIC ACTION ${error}`)
    }
  },
  clientForDeviceManipulation ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      populate: ['mac_addresses']
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.clientid}?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((client) => {
            commit('clientForDeviceManipulation', client.data)
            resolve(client.data)
          })
      })
    } catch (error) {
      throw new Error(`CLIENT FOR DEVICE MANIPULATION ACTION ${error}`)
    }
  },
  setPlanFromModal ({ commit }, payload) {
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}editclientplan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              id: payload.clientId,
              plan: payload.newPlan.id,
              isRx: payload.isRx,
              kick: payload.kick,
              operator: payload.operator
            }
          })
        }).then((input) => {
          if (input.status === 200) {
            if (payload.isOfferChange) {
              commit('setPlanFromModal', payload)
            }
            if (!payload.isBulkDx) {
              this.$toast.info('Plan actualizado actualizado con exito', { duration: 4000, position: 'bottom-center' })
            }
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
          throw new Error(`EDIT CLIENT PLAN ACTION ${error}`)
        })
      })
    } catch (error) {
      throw new Error(`EDIT CLIENT PLAN ACTION ${error}`)
    }
  },
  async setActiveFromModal ({ commit }, payload) {
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.clientid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      body: JSON.stringify({
        data: {
          active: payload.active
        }
      })
    })
      .then(res => res.json())
      .then((res) => {
        commit('setActiveFromModal', payload)
        this.$toast.info('Cliente actualizado con exito', { duration: 4000, position: 'bottom-center' })
      })
  },
  async updateServiceInfo ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            nap_onu_address: payload.ticketAdvance.nap_onu_address,
            opticalPower: '' + payload.ticketAdvance.opticalPower
          }
        })
      })
        .then(res => res.json())
        .then((_) => {
          this.$toast.info('Detalles del servicio actualizados con exito', { duration: 4000, position: 'bottom-center' })
        })
    } catch (error) {
      this.$toast.error('Error al actualizar detalles. Verifica tu conexion o reportalo a nico', { position: 'bottom-center' })
    }
  },
  async adminCreate ({ commit }, { client, city, index, token, operator }) {
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}admincreate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        data: { ...client, operator, city }
      })
    }).then((input) => {
      if (input.status === 200) {
        this.$toast.info('Ciente creado en mikrotik correctamente', { duration: 4000, position: 'bottom-center' })
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`ADMINCREATE ACTION ${error}`)
    })
  },
  async adminDelete ({ commit }, { client, index, token, operator }) {
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}admindelete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        data: { ...client, operator }
      })
    }).then((input) => {
      if (input.status === 200) {
        commit('adminToggle', { client, index })
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`ADMINDELETE ACTION ${error}`)
    })
  },
  async updateClient ({ commit }, payload) {
    delete payload.client.active
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.client.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      body: JSON.stringify({
        data: { operator: payload.operator, ...payload.client }
      })
    }).then((input) => {
      if (input.status === 200) {
        commit('updateClient', { client: payload.client, index: payload.index })
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`UPDATE USER ACTION ${error}`)
    })
  },
  editDebt ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: { indebt: payload.indebt }
        })
      }).then((input) => {
        resolve(input)
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
        throw new Error(`UPDATE DEBT CLIENT ACTION ${error}`)
      })
    })
  },
  editClientStatus ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${payload.client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            indebt: payload.indebt,
            active: payload.active
          }
        })
      }).then((input) => {
        resolve(input)
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
        throw new Error(`UPDATE DEBT CLIENT ACTION ${error}`)
      })
    })
  },
  updateClientPhone ({ commit }, { phone, client, token }) {
    // eslint-disable-next-line no-unreachable
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          data: { phone }
        })
      }).then((input) => {
        resolve(input)
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
        throw new Error(`UPDATE USER ACTION ${error}`)
      })
    })
  },
  async updateClientCommentOnMikrotik (_, { client, token }) {
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}clientcomment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        data: client
      })
    }).then((input) => {
      if (input.status === 200) {
        this.$toast.success('Comentario actualizado', { duration: 2000 })
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`UPDATE USER COMMENT ON MIKROTIK ACTION ${error}`)
    })
  },
  updateClientDevices ({ commit }, { device, index }) {
    commit('updateClientDevices', { device, index })
  }
}
