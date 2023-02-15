<template>
  <div>
    <h1>Envio de notis uwu</h1>
    <v-text-field
      v-model="message"
      label="Mensaje"
    />
    <button
      @click="send"
    >
      Enviar notis
    </button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      message: ''
    }
  },
  mounted () {
    // Inside page components
    this.$OneSignal.push(() => {
      this.$OneSignal.isPushNotificationsEnabled((isEnabled) => {
        if (isEnabled) {
          console.log('Push notifications are enabled!')
        } else {
          console.log('Push notifications are not enabled yet.')
        }
      })
    })

    // Using window and array form
    window.$OneSignal.push(['addListenerForNotificationOpened', (data) => {
      console.log('Received NotificationOpened:', data)
    }])
  },
  methods: {
    send () {
      // Reemplaza 'TU_ID_DE_APP' con el ID de tu aplicación de OneSignal
      const appId = '2b515757-2bd9-49a3-8f7f-81f730c120ca'

      // Crea el cuerpo de la solicitud
      const body = {
        app_id: appId,
        contents: { en: this.message },
        included_segments: ['All']
      }

      // Realiza la solicitud utilizando la API Fetch nativa del navegador
      fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Basic ODFmMjE5YTItMmRmZi00ODA0LTk4YjEtMWNlYzRkOTlmZjQ1'
        },
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(data => console.log('Notificación enviada:', data))
        .catch(error => console.error('Error al enviar la notificación:', error))
    }
  }
}
</script>
