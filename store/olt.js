export const state = () => ({
  secrets: []
})
export const mutations = {
  getSecretsFromMikrotik (state, data) {
    try {
      state.secrets = data.secrets
    } catch (error) {
      throw new Error(`SECRETS MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getSecretsFromMikrotik ({ commit }, payload) {
    const data = []
    for await (const mikrotik of payload.mikrotiks) {
      try {
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}secrets?mikrotikHost=${mikrotik.ip}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${payload.token}`
          }
        })
          .then(res => res.json())
          .then((secrets) => {
            data.push(...secrets)
          })
      } catch (error) {
        throw new Error(`SECRETS ACTION ${error}`)
      }
    }
    commit('getSecretsFromMikrotik', { secrets: data, city: payload.city })
  }
}
