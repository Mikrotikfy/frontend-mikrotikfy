export const state = () => ({
  serviceAddresses: []
})
export const mutations = {
  getAddressByServiceId (state, addressList) {
    try {
      state.serviceAddresses = addressList
    } catch (error) {
      throw new Error(`ADDRESSES MUTATE ${error}`)
    }
  }
}
export const actions = {
  addAddress ({ commit }, payload) {
    try {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}service-addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            address: payload.address,
            service: payload.service.id,
            neighborhood: payload.neighborhood.id
          }
        })
      })
        .then((res) => {
          if (res.status === 200) {
            this.$toast.success('Direccion actualizada con éxito', { duration: 4000, position: 'bottom-center' })
          } else {
            this.$toast.error('Error al actualizar la direccion', { position: 'bottom-center' })
          }
        })
    } catch (error) {
      throw new Error(`ADDRESSES ACTION ${error}`)
    }
  },
  getAddressByServiceId ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        service: {
          id: payload.serviceId
        }
      },
      populate: ['neighborhood'],
      pagination: {
        pageSize: 100
      }
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}service-addresses?${query}`, {
          type: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: addresses }) => {
            console.log('addresses', addresses)
            commit('getAddressByServiceId', addresses)
            resolve(addresses)
          })
      })
    } catch (error) {
      throw new Error(`ADDRESSES ACTION ${error}`)
    }
  }
}
