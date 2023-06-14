export default function ({ route, redirect, store }) {
  const { query, path, name } = route
  const { clienttype } = query
  const auth = store.state.auth
  const userHasPreferredCity = auth && auth.preferredcity
  let userPreferredCity = null
  console.log(path)
  if (userHasPreferredCity) {
    userPreferredCity = auth.preferredcity.name
  }
  const newQuery = {
    city: userPreferredCity || 'MARIQUITA',
    clienttype: clienttype || 'INTERNET'
  }
  if (path === '/') {
    redirect({ path: '/tickets', query: newQuery })
  }

  if ((name === 'tickets') && (!query.view || !query.clienttype || !query.city)) {
    newQuery.view = 'RV'
    return redirect({ path, query: newQuery })
  }
}
