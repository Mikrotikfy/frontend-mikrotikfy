<template>
  <div>
    <v-btn
      @click="sendTest"
    >
      Enviar
    </v-btn>
  </div>
</template>
  <!-- eslint-disable quote-props -->
<script>
export default {
  data () {
    return {
      clients: []
    }
  },
  methods: {
    async getClientsByCity () {
      this.clients = await this.$store.dispatch('cuts/getClientsByCity', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city
      })
    },
    sendTest () {
      fetch('https://graph.facebook.com/v14.0/100480202798133/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer EAALYQ6KEsR8BANjdnm4WPd7KKpHyWYghZBiaqMPXP80WcTnRSgrnA6rhYzKiUN2h9HHR6JJUy5BX1lDnnzAXFDLZBvAqcsIMGkFLDpJ4kUZAnZCo44W0iiRa2r8AUPjaZARaCIQ2qZCzV2hCUHIEcifk4uMmnisInbJNWmx1vYyjeYLox6LRUdne1ZByjhNi7rHCEpCYmZAfegZDZD'
        },
        body: JSON.stringify(
          {
            messaging_product: 'whatsapp',
            to: '573024493001',
            type: 'template',
            template: {
              'name': 'internet_account_dynamic',
              'language': {
                'code': 'es'
              },
              'components': [
                {
                  'type': 'body',
                  'parameters': [
                    {
                      'type': 'text',
                      'text': '15 de octubre'
                    }
                  ]
                },
                {
                  'type': 'button',
                  'sub_type': 'url',
                  'index': '0',
                  'parameters': [
                    {
                      'type': 'text',
                      'text': '1110601254'
                    }
                  ]
                }
              ]
            }
          }
        )
      })
        .then(res => res.json())
        .then((res) => {
          console.log(res)
        })
    }
  }
}
</script>
