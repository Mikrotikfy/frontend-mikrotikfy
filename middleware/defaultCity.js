export default function ({ route, redirect, store }) {
  const { query, path, name } = route
  const auth = store.state.auth
  const userHasPreferredCity = auth && auth.preferredcity
  let userPreferredCity = null
  if (userHasPreferredCity) {
    userPreferredCity = auth.preferredcity.name
  }
  const newQueryTickets = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
    clienttype: 'INTERNET',
    view: 'TODOS'
  }
  const newQueryNap = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA')
  }
  const newQueryResume = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA')
  }
  const newQueryClient = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA')
  }
  const newQueryBilling = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA')
  }
  const newQueryCuts = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
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
  if ((name === 'nap') && (!query.city)) {
    redirect({ path, query: newQueryNap })
  }
  if ((name === 'billing-resume') && (!query.city)) {
    redirect({ path, query: newQueryResume })
  }
  if ((name === 'cuts') && (!query.city)) {
    redirect({ path, query: newQueryCuts })
  }
  if ((name === 'client' || name === 'client-search') && (!query.city)) {
    redirect({ path, query: newQueryClient })
  }
  if ((name === 'billing' || name === 'billing-search') && (!query.city)) {
    redirect({ path, query: newQueryBilling })
  }
}
