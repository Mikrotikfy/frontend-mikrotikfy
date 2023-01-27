export const state = () => ({
  e1: 1,
  hasWhatsapp: true,
  randomNumber: 0,
  clientNumber: 0
})
export const mutations = {
  sete1 (state, e1) {
    try {
      state.e1 = e1
    } catch (error) {
      throw new Error(`CREATE e1 MUTATE ${error}`)
    }
  },
  hasWhatsapp (state, hasWhatsapp) {
    try {
      state.hasWhatsapp = hasWhatsapp
    } catch (error) {
      throw new Error(`CREATE typeDisponibility MUTATE ${error}`)
    }
  },
  randomNumber (state, randomNumber) {
    try {
      state.randomNumber = randomNumber
    } catch (error) {
      throw new Error(`CREATE RandomNumber MUTATE ${error}`)
    }
  },
  setClientNumber (state, clientNumber) {
    try {
      state.clientNumber = clientNumber
    } catch (error) {
      throw new Error(`CREATE clientNumber MUTATE ${error}`)
    }
  }
}
export const actions = {}
