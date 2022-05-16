export const state = () => ({
  technologies: []
})
export const mutations = {
  getTechnologiesFromDatabase (state, technologyList) {
    try {
      state.technologies = technologyList
    } catch (error) {
      throw new Error(`TECHNOLOGY MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getTechnologiesFromDatabase ({ commit }) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}technologies`)
        .then(res => res.json())
        .then((technologies) => {
          localStorage.setItem('technologies', JSON.stringify(technologies.data))
          commit('getTechnologiesFromDatabase', technologies.data)
        })
    } catch (error) {
      throw new Error(`TECHNOLOGY ACTION ${error}`)
    }
  }
}
