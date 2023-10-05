export default function ({ route, redirect, store }) {
  const { query, path, name } = route
  const { referer, fuzzy } = query
  const newQuery = {
    referer: referer || 'none'
  }
  const newQueryTickets = {
    view: 'TODOS'
  }
  const newQueryClients = {
    fuzzy: fuzzy || 'false'
  }

  if (path === '/') {
    if (!store.state.redirected) {
      store.commit('setRedirected', true)
      redirect({ path: '/tickets', query: newQuery })
    }
  }

  if ((name !== 'tickets' && name !== 'clients' && name !== 'clients-search') && (!query.clienttype || !query.city)) {
    if (!store.state.redirected) {
      store.commit('setRedirected', true)
      redirect({ path, query: newQuery })
    }
  }

  if ((name === 'tickets') && (!query.clienttype || !query.city)) {
    return redirect({ path, query: newQueryTickets })
  }
  if ((name === 'clients-search' || name === 'clients') && (!query.clienttype || !query.city || !query.fuzzy)) {
    return redirect({ path, query: newQueryClients })
  }
}
