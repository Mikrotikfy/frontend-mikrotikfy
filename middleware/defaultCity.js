export default function ({ route, redirect, store }) {
  const { query, path, name } = route
  const { clienttype } = query
  const auth = store.state.auth
  const userHasPreferredCity = auth && auth.preferredcity
  let userPreferredCity = null
  if (userHasPreferredCity) {
    userPreferredCity = auth.preferredcity.name
  }

  const newQuery = {
    city: userPreferredCity || 'MARIQUITA',
    clienttype: clienttype || 'INTERNET'
  }
  if (path === '/') {
    redirect({ path: '/clients', query: newQuery })
  }

  if (name === 'tickets' && !query.view) {
    newQuery.view = 'RV'
    return redirect({ path, query: newQuery })
  }
}
