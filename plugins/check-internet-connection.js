export default (_, inject) => {
  inject('checkInternetConnection', input => checkInternetConnection(input))
}
async function checkInternetConnection () {
  try {
    const response = await fetch('https://admin.arnoproducciones.com/_health', {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.ok
  } catch (error) {
    return false
  }
}
