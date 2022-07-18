export const state = () => ({})
export const mutations = {}
export const actions = {
  addAddress ({ commit }, payload) {
    try {
      fetch(`${this.$config.API_STRAPI_ENDPOINT}addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`
        },
        body: JSON.stringify({
          data: {
            address: payload.address,
            client: payload.client.id,
            neighborhood: payload.neighborhood.id
          }
        })
      })
        .then((res) => {
          if (res.status === 200) {
            this.$toast.success('Direccion actualizada con éxito', { duration: 4000, position: 'top-center' })
          } else {
            this.$toast.error('Error al actualizar la direccion', { position: 'top-center' })
          }
        })
    } catch (error) {
      throw new Error(`ADDRESSES ACTION ${error}`)
    }
  },
  getAddresByClientId ({ commit }, payload) {
    const qs = require('qs')
    const query = qs.stringify({
      filters: {
        client: {
          id: payload.clientId
        }
      },
      populate: ['neighborhood'],
      pagination: {
        pageSize: 1000
      }
    },
    {
      encodeValuesOnly: true
    })
    try {
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}addresses?${query}`, {
          type: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((addresses) => {
            resolve(addresses.data)
          })
      })
    } catch (error) {
      throw new Error(`ADDRESSES ACTION ${error}`)
    }
  }
}
