export const state = () => ({
  clients: [],
  clienttypes: [],
  headers: null
})
export const mutations = {
  setActiveFromModal (state, payload) {
    state.clients[payload.index].active = payload.active
  },
  calculateClientStatus (state, newState) {
    state.clients = newState
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
  // getClientTypesFromDatabase (state, clienttypesList) {
  //   try {
  //     state.clienttypes = clienttypesList
  //   } catch (error) {
  //     throw new Error(`MUTATE CLIENT TYPES${error}`)
  //   }
  // },
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
      state.clients[index] = client
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
  }
}
export const actions = {
  async clearClientsFromDatatable ({ commit }) {
    try {
      await commit('clearClientsFromDatatable', true)
    } catch (error) {
      throw new Error(`CLEAR CLIENT ACTION ${error}`)
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
  async calculateClientStatus ({ state, commit }, payload) {
    const shallowState = JSON.parse(JSON.stringify(state.clients))
    const newState = await shallowState.map((client) => {
      // eslint-disable-next-line eqeqeq
      const ac = payload.find(c => c == client.code)
      if (ac) {
        client.status = 'green'
        return client
      } else {
        // eslint-disable-next-line eqeqeq
        const ac2 = payload.find(c => c == client.dni)
        if (ac2) {
          client.status = 'green'
          return client
        } else {
          client.status = 'red'
          return client
        }
      }
    })
    commit('calculateClientStatus', newState)
  },
  async getClientTypesFromDatabase (_, token) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clienttypes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((clienttypes) => {
          localStorage.setItem('clienttypes', JSON.stringify(clienttypes.data))
        })
    } catch (error) {
      throw new Error(`ACTION ${error}`)
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
  updateFromModal ({ commit }, client) {
    try {
      commit('updateFromModal', client)
    } catch (error) {
      throw new Error(`MUTATE ${error}`)
    }
  },
  async setPlanFromModal (_, payload) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}editclientplan`, {
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
            operator: payload.operator
          }
        })
      }).then((input) => {
        if (input.status === 200) {
          this.$toast.info('Plan actualizado actualizado con exito', { duration: 4000, position: 'top-center' })
          return true
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
        throw new Error(`EDIT CLIENT PLAN ACTION ${error}`)
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
        this.$toast.info('Cliente actualizado con exito', { duration: 4000, position: 'top-center' })
      })
  },
  async adminCreate ({ commit }, { client, index, token, operator }) {
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}admincreate`, {
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
  async updateClient ({ commit }, { client, index, operator, token }) {
    delete client.active
    await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${client.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        data: { operator, ...client }
      })
    }).then((input) => {
      if (input.status === 200) {
        commit('updateClient', { client, index })
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw new Error(`UPDATE USER ACTION ${error}`)
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
      { text: 'Tecnologia', value: 'technology.name', sortable: false },
      { text: 'Tipo', value: 'newModel', sortable: false },
      { text: 'Activo', value: 'active', sortable: false },
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
      { text: '', value: 'actions', sortable: false }
    ]

    if (clienttype === 'INTERNET') {
      commit('getHeadersByClientType', internet)
    } else if (clienttype === 'TELEVISION') {
      commit('getHeadersByClientType', television)
    }
  }
}
