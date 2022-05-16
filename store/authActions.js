export const actions = {
  async checkToken (_, { token }) {
    return await fetch(`${this.$config.API_STRAPI_ENDPOINT}users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  }
}
