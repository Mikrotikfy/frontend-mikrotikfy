function flatten (obj) {
  const flattened = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (key === 'attributes') {
        Object.assign(flattened, flatten(value))
      } else {
        flattened[parent] = flatten(value, key)
      }
    } else if (Array.isArray(value) && key === 'data') {
      value.forEach((item) => {
        Object.assign(flattened, flatten(item))
      })
    } else {
      flattened[key] = value
    }
  })

  return flattened
}
export default (_, inject) => {
  inject('flatten', obj => flatten(obj))
}
