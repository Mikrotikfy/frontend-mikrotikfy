export default function ({ store, route, redirect }) {
  if (!store.state.auth) {
    return redirect('/login')
  }
  if (route.path !== '/inventario' && store.state.auth.role.name === 'inventory') {
    return redirect('/inventario')
  }
}
