
const cookieparser = process.server ? require('cookieparser') : undefined
export const state = () => {
  return {
    auth: null,
    localStorageLoaded: false,
    isDesktop: null,
    clientWidth: null,
    clientHeight: null,
    invoicetypes: null,
    redirected: false
  }
}
export const mutations = {
  setRedirected (state, redirected) {
    state.redirected = redirected
  },
  isDesktop (state, isDesktop) {
    state.isDesktop = isDesktop
  },
  clientWidth (state, clientWidth) {
    state.clientWidth = clientWidth
  },
  clientHeight (state, clientHeight) {
    state.clientHeight = clientHeight
  },
  setAuth (state, auth) {
    state.auth = auth
  },
  setLocalStorage (state, authLocal) {
    state.auth = { ...state.auth, ...JSON.parse(authLocal) }
    state.localStorageLoaded = true
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
    const authLocal = localStorage.getItem('auth')
    commit('setLocalStorage', authLocal)
  }
}
