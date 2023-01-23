
const cookieparser = process.server ? require('cookieparser') : undefined
export const state = () => {
  return {
    auth: {},
    cities: null,
    clienttypes: null,
    telegramBots: null,
    plans: null,
    technologies: null,
    devicebrands: null,
    neighborhoods: null,
    isDesktop: null
  }
}
export const mutations = {
  isDesktop (state, isDesktop) {
    state.isDesktop = isDesktop
  },
  setAuth (state, auth) {
    state.auth = auth
  },
  setLocalStorage (state, { cities, plans, technologies, neighborhoods, deviceBrands, clienttypes, telegramBots }) {
    state.cities = JSON.parse(cities)
    state.plans = JSON.parse(plans)
    state.technologies = JSON.parse(technologies)
    state.neighborhoods = JSON.parse(neighborhoods)
    state.devicebrands = JSON.parse(deviceBrands)
    state.clienttypes = JSON.parse(clienttypes)
    state.telegramBots = JSON.parse(telegramBots)
  },
  setTicketsFromLocalStorage (state, tickets) {
    state.tickets = JSON.parse(tickets)
  },
  refreshTickets (state, ticketList) {
    try {
      state.tickets = ticketList
    } catch (error) {
      throw new Error(`TICKET MUTATE ${error}`)
    }
  },
  updateTicketState (state, { editindex, closeTicket }) {
    state.tickets[editindex].active = !closeTicket
  }
}
export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setAuth', auth)
  },
  loadLocalStorage ({ commit }) {
    const plans = localStorage.getItem('plans')
    const cities = localStorage.getItem('cities')
    const technologies = localStorage.getItem('technologies')
    const deviceBrands = localStorage.getItem('devicebrands')
    const neighborhoods = localStorage.getItem('neighborhoods')
    const telegramBots = localStorage.getItem('telegramBots')
    const clienttypes = localStorage.getItem('clienttypes')
    commit('setLocalStorage', { cities, plans, technologies, neighborhoods, deviceBrands, clienttypes, telegramBots })
  },
  getTicketsFromLocalStorage ({ commit }) {
    const tickets = localStorage.getItem('tickets')
    commit('setTicketsFromLocalStorage', tickets)
  }
}
