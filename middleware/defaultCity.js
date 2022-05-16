export default function ({ route, redirect }) {
  if (!route.query.city) {
    if (route.path === '/') {
      return redirect('/clients?city=MARIQUITA')
    }
    const path = route.path
    return redirect(path + '?city=MARIQUITA')
  }
  if (!route.query.clienttype) {
    if (route.path === '/') {
      return redirect('/clients?city=MARIQUITA&clienttype=INTERNET')
    }
    const path = route.path
    return redirect(path + '?city=MARIQUITA&clienttype=INTERNET')
  }
}
