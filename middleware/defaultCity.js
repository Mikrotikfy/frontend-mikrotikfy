export default function ({ route, redirect, store }) {
  const { query, path, name } = route
  const auth = store.state.auth
  const userHasPreferredCity = auth && auth.preferredcity
  let userPreferredCity = null
  if (userHasPreferredCity) {
    userPreferredCity = auth.preferredcity.name
  }
  const newQueryTickets = {
    city: userPreferredCity || 'MARIQUITA',
    clienttype: 'INTERNET',
    view: 'TODOS'
  }

  if (path === '/') {
    if (!store.state.redirected) {
      store.commit('setRedirected', true)
      redirect({ path: '/tickets' })
    }
  }

  if ((name === 'tickets') && (!query.clienttype || !query.city || !query.view)) {
    redirect({ path, query: newQueryTickets })
  }
}
