export default (_, inject) => {
  inject('fetch', (resource, options) => fetchWithTimeout(resource, options))
}

async function fetchWithTimeout (resource, options = {}) {
  const { timeout = 6000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  })
  clearTimeout(id)

  return response
}
