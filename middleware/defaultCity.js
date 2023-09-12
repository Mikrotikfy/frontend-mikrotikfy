export default function ({ route, redirect, store }) {
  const { query, path, name } = route
  const { clienttype, referer, fuzzy } = query
  const auth = store.state.auth
  const userHasPreferredCity = auth && auth.preferredcity
  let userPreferredCity = null
  if (userHasPreferredCity) {
    userPreferredCity = auth.preferredcity.name
  }
  const newQuery = {
    city: userPreferredCity || 'MARIQUITA',
    clienttype: clienttype || 'INTERNET',
    referer: referer || 'none'
  }
  const newQueryTickets = {
    city: userPreferredCity || 'MARIQUITA',
    clienttype: clienttype || 'INTERNET',
    view: 'TODOS'
  }
  const newQueryClients = {
    city: userPreferredCity || 'MARIQUITA',
    clienttype: clienttype || 'INTERNET',
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
