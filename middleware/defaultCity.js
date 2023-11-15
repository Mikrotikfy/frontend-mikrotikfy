export default function ({ route, redirect, store }) {
  const { query, path, name } = route
  const auth = store.state.auth
  const userHasPreferredCity = auth && auth.preferredcity
  const userHasPreferredClienttype = auth && auth.preferredclienttype
  let userPreferredCity = null
  let userPreferredClienttype = null
  if (userHasPreferredClienttype) {
    userPreferredClienttype = auth.preferredclienttype.name
  }
  if (userHasPreferredCity) {
    userPreferredCity = auth.preferredcity.name
  }
  const newQueryTickets = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
    clienttype: query.clienttype ? query.clienttype : (userPreferredClienttype || 'INTERNET'),
    view: 'TODOS'
  }
  const newQueryNap = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA')
  }
  const newQueryResume = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
    clienttype: query.clienttype ? query.clienttype : (userPreferredClienttype || 'INTERNET')
  }
  const newQueryClient = query.service ? {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
    clienttype: query.clienttype ? query.clienttype : (userPreferredClienttype || 'INTERNET'),
    service: query.service
  } : {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
    clienttype: query.clienttype ? query.clienttype : (userPreferredClienttype || 'INTERNET')
  }
  const newQueryBilling = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
    clienttype: query.clienttype ? query.clienttype : (userPreferredClienttype || 'INTERNET')
  }
  const newQueryCuts = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
    clienttype: query.clienttype ? query.clienttype : (userPreferredClienttype || 'INTERNET')
  }
  const newQueryNotification = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
    clienttype: query.clienttype ? query.clienttype : (userPreferredClienttype || 'INTERNET')
  }
  const newQueryGenerate = {
    city: query.city ? query.city : (userPreferredCity || 'MARIQUITA'),
    clienttype: query.clienttype ? query.clienttype : (userPreferredClienttype || 'INTERNET')
  }

  if (path === '/') {
    redirect({ path: '/tickets', query: newQueryTickets })
  }

  if ((name === 'tickets') && (!query.clienttype || !query.city || !query.view)) {
    redirect({ path, query: newQueryTickets })
  }
  if ((name === 'nap') && (!query.city)) {
    redirect({ path, query: newQueryNap })
  }
  if ((name === 'notification') && (!query.city || !query.clienttype)) {
    redirect({ path, query: newQueryNotification })
  }
  if ((name === 'billing-resume') && (!query.city || !query.clienttype)) {
    redirect({ path, query: newQueryResume })
  }
  if ((name === 'billing-generate') && (!query.city || !query.clienttype)) {
    redirect({ path, query: newQueryGenerate })
  }
  if ((name === 'cuts') && (!query.city)) {
    redirect({ path, query: newQueryCuts })
  }
  if ((name === 'client' || name === 'client-search') && (!query.city || !query.clienttype)) {
    redirect({ path, query: newQueryClient })
  }
  if ((name === 'billing' || name === 'billing-search') && (!query.city)) {
    redirect({ path, query: newQueryBilling })
  }
}
