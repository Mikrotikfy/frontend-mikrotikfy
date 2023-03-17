import db from '~/plugins/db'

export const actions = {
  async saveTicketsToIndexedDB ({ commit }, tickets) {
    await db.tickets.clear()
    await db.tickets.bulkAdd(tickets)
    commit('ticket/getTicketsFromDatabase', tickets, { root: true })
  },
  async getTicketsFromIndexedDB ({ commit }) {
    const tickets = await db.tickets.toArray()
    commit('ticket/getTicketsFromDatabase', tickets, { root: true })
  }
}
