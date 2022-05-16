export const state = () => ({
  telegramBots: []
})
export const mutations = {
  getTelegramBotsFromDatabase (state, telegramBots) {
    try {
      state.telegramBots = telegramBots
    } catch (error) {
      throw new Error(`TELEGRAM BOT MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getTelegramBotsFromDatabase ({ commit }, { token }) {
    try {
      const qs = require('qs')
      const query = qs.stringify({
        populate: ['city']
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}telegrambots?${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((telegramBots) => {
          localStorage.setItem('telegramBots', JSON.stringify(telegramBots.data))
          commit('getTelegramBotsFromDatabase', telegramBots.data)
        })
    } catch (error) {
      throw new Error(`TELEGRAM BOT ACTION ${error}`)
    }
  }
}
