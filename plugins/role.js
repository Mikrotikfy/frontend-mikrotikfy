export default ({ store }, inject) => {
  inject('isAdmin', (_) => {
    return store.state.auth.role.name === 'superadmin' || store.state.auth.role.name === 'admin'
  })
  inject('isBiller', (_) => {
    return store.state.auth.role.name === 'biller'
  })
  inject('isTechnician', (_) => {
    return store.state.auth.role.name === 'technician'
  })
}
