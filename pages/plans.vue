<template>
  <div>
    <v-btn
      @click="sendTest"
    >
      Enviar
    </v-btn>
  </div>
</template>
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
      fetch('https://platform.clickatell.com/v1/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'e4owbqK9TWWnlNcI68psjQ=='
        },
        body: JSON.stringify(
          {
            messages: [
              {
                to: '573192941553',
                channel: 'whatsapp',
                template: {
                  templateName: 'internet_account',
                  body: {
                    parameters: {
                      1: '15 de octubre'
                    }
                  }
                }
              }
            ]
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
