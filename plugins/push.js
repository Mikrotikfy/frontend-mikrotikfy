export default (_, inject) => {
  inject('pushSend', input => pushSend(input))
}

function pushSend (payload) {
  const fetch = require('node-fetch')
  try {
    const appId = '2b515757-2bd9-49a3-8f7f-81f730c120ca'

    const body = {
      app_id: appId,
      title: payload.title,
      icon: 'https://api.arnoproducciones.com/icon.png',
      badge: 'https://api.arnoproducciones.com/icon.png',
      chrome_web_icon: 'https://api.arnoproducciones.com/icon.png',
      contents: { en: payload.message },
      included_segments: ['All']
    }

    return new Promise((resolve, reject) => {
      fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Basic ODFmMjE5YTItMmRmZi00ODA0LTk4YjEtMWNlYzRkOTlmZjQ1'
        },
        body: JSON.stringify(body)
      })
        .then(async (response) => {
          resolve(await response.json())
        })
    })
  } catch (error) {
    return error
  }
};
