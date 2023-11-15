export const state = () => ({
  services: [],
  clients: [],
  pagination: {
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0
  },
  clienttypes: [],
  clientsByDni: [],
  fuzzySearch: false,
  currentClientCode: null,
  clientForDeviceManipulation: null,
  headers: null,
  refresh: 0
})
export const mutations = {
  refresh (state) {
    try {
      state.refresh++
    } catch (error) {
      throw new Error(`MUTATE REFRESH ${error}`)
    }
  },
  setFuzzySearch (state, payload) {
    try {
      state.fuzzySearch = payload
    } catch (error) {
      throw new Error(`MUTATE FUZZY SEARCH ${error}`)
    }
  },
  updateDniType (state, payload) {
    try {
      state.clients[payload.index].corporate = !state.clients[payload.index].corporate
    } catch (error) {
      throw new Error(`MUTATE UPDATE DNI TYPE ${error}`)
    }
  },
  updateClientPassword (state, payload) {
    try {
      state.clients[payload.index].update_password = !state.clients[payload.index].update_password
    } catch (error) {
      throw new Error(`MUTATE UPDATE CLIENT PASSWORD ${error}`)
    }
  },
  clearServicesFromDatatable (state) {
    state.services = []
  },
  getServicesFromDatabase (state, data) {
    try {
      state.services = data.services
      state.pagination = data.meta.pagination
    } catch (error) {
      throw new Error(`MUTATE SEARCH SERVICES${error}`)
    }
  },
  getClientsFromDatabase (state, data) {
    try {
      state.clients = data.clients
      state.pagination = data.meta.pagination
    } catch (error) {
      throw new Error(`MUTATE SEARCH CLIENTS${error}`)
    }
  },
  getServicesFromDatabaseFuzzy (state, serviceList) {
    try {
      state.services = serviceList.services
    } catch (error) {
      throw new Error(`MUTATE SEARCH CLIENT FUZZY${error}`)
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
  // updateClient (state, { client, index }) {
  //   try {
  //     Object.assign(state.clients[index], client)
  //   } catch (error) {
  //     throw new Error(`UPDATE CLIENT MUTATE ${error}`)
  //   }
  // },
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
      if (payload.clientIndex !== null || payload.clientIndex !== -1) {
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
  updateDniType ({ commit }, payload) {
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
              corporate: payload.corporate
            }
          })
        }).then((input) => {
          if (input.status === 200) {
            commit('updateDniType', { corporate: payload.corporate, index: payload.index })
            this.$toast.info('Cambio de tipo correcto.', { duration: 4000, position: 'bottom-center' })
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
            // commit('updateClient', { client: payload.client, index: payload.index })
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
  async clearServicesFromDatatable ({ commit }) {
    try {
      await commit('clearServicesFromDatatable', true)
    } catch (error) {
      throw new Error(`CLEAR CLIENT ACTION ${error}`)
    }
  },
  async getServicesFromDatabaseBySearch ({ commit }, payload) {
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
          }, {
            $or: [
              {
                code: payload.search
              },
              {
                dni: payload.search
              },
              {
                phone: {
                  $contains: payload.search
                }
              },
              {
                client_name: {
                  $contains: payload.search
                }
              },
              {
                address: {
                  $contains: payload.search
                }
              },
              {
                neighborhood: payload.search
              }
            ]
          }
        ]
      },
      pagination: {
        page: payload.page
      },
      populate: ['normalized_client']
    },
    {
      encodeValuesOnly: true
    })
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}services?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then(({ data: services, meta }) => {
          commit('getServicesFromDatabase', { services, meta })
        })
    } catch (error) {
      throw new Error(`ACTION ${error}`)
    }
  },
  async getClientsFromDatabaseBySearch ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        $or: [
          {
            dni: {
              $eq: payload.search
            }
          },
          {
            name: {
              $contains: payload.search
            }
          },
          {
            phone: payload.search
          }
        ]
      },
      pagination: {
        page: payload.page
      }
    },
    {
      encodeValuesOnly: true
    })
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}normalized-clients?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then(({ data: clients, meta }) => {
          console.log(clients)
          commit('getClientsFromDatabase', { clients, meta })
        })
    } catch (error) {
      throw new Error(`ACTION ${error}`)
    }
  },
  async getServicesFromDatabaseByFuzzySearch ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        city: {
          name: payload.city
        }
      }
    },
    {
      encodeValuesOnly: true
    })
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}fuzzy-search/search?query=${payload.search}&${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        }
      })
        .then(res => res.json())
        .then((services) => {
          commit('getServicesFromDatabaseFuzzy', services)
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
              city: payload.city.id,
              service: payload.service.id,
              tickettype: 36,
              assignated: 22,
              clienttype: payload.clienttype.id,
              channel: 'office',
              details: `
                CX: ${payload.address} ${payload.neighborhood.name}
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
        fetch(`${this.$config.API_STRAPI_ENDPOINT}service-addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              address: payload.address,
              neighborhood: payload.neighborhood.id,
              service: payload.service.id
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
        fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${payload.serviceId}`, {
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
              // commit('setAuxPlan', { client: client.data, index: payload.index, plan: payload.plan })
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
        'services',
        'services.monthlybills',
        'services.city',
        'services.clienttype',
        'normalized_client'
      ]
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}normalized-clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(({ data: clients }) => {
            resolve(clients)
            commit('getByDni', clients)
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
        fetch(`${this.$config.API_STRAPI_ENDPOINT}editserviceplan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          },
          body: JSON.stringify({
            data: {
              id: payload.serviceId,
              plan: payload.newPlan.id,
              isRx: payload.isRx,
              kick: payload.kick,
              operator: payload.operator
            }
          })
        }).then((input) => {
          if (input.status === 200) {
            if (payload.isOfferChange) {
              // commit('setPlanFromModal', payload)
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
          throw new Error(`EDIT SERVICE PLAN ACTION ${error}`)
        })
      })
    } catch (error) {
      throw new Error(`EDIT SERVICE PLAN ACTION ${error}`)
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
  async updateOfferForService ({ commit }, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${payload.service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            offer: payload.service.offer.id
          }
        })
      })
        .then(res => res.json())
        .then((_) => {
          this.$toast.info('Oferta del servicio actualizados con exito', { duration: 4000, position: 'bottom-center' })
        })
    } catch (error) {
      this.$toast.error('Error al actualizar oferta. Verifica tu conexion o reportalo a nico', { position: 'bottom-center' })
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
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}normalized-clients/${payload.client.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      body: JSON.stringify({
        data: {
          name: payload.client.name,
          dni: payload.client.dni,
          phone: payload.client.phone,
          email: payload.client.email
        }
      })
    }).then((input) => {
      if (input.status === 200) {
        // commit('updateClient', { service: payload.service, index: payload.index })
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`UPDATE USER ACTION ${error}`)
    })
  },
  async updateService ({ commit }, payload) {
    delete payload.service.active
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${payload.service.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      body: JSON.stringify({
        data: payload.service
      })
    }).then((input) => {
      if (input.status === 200) {
        // commit('updateClient', { service: payload.service, index: payload.index })
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
      fetch(`${this.$config.API_STRAPI_ENDPOINT}services/${payload.service.id}`, {
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
        throw new Error(`UPDATE DEBT SERVICE ACTION ${error}`)
      })
    })
  },
  updateClientPhone ({ commit }, { phone, client, token }) {
    // eslint-disable-next-line no-unreachable
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}normalized-clients/${client.id}`, {
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
  updateClientCommentOnMikrotik (_, { client, token }) {
    return new Promise((resolve, reject) => {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}clientcomment`, {
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
          resolve(true)
          this.$toast.success('Comentario actualizado', { duration: 1000 })
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
        throw new Error(`UPDATE USER COMMENT ON MIKROTIK ACTION ${error}`)
      })
    })
  },
  updateClientDevices ({ commit }, { device, index }) {
    commit('updateClientDevices', { device, index })
  }
}
