<template>
  <v-container>
    <v-card>
      <v-card-title>Registro de usuarios en Mikrotik</v-card-title>
      <v-data-table
        :headers="headers"
        :items="parts"
        :items-per-page="10"
        :max-items="100"
        mobile-breakpoint="100"
        sort-by="createdAt"
        sort-desc
      >
        <template v-slot:[`item.createdAt`]="props">
          {{ getDate(props.item.createdAt) }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      parts: [],
      headers: [
        { text: 'Secreto', sortable: false, value: 'secret' },
        { text: 'Detalles', value: 'details', sortable: false },
        { text: 'Mikrotik', value: 'mikrotik', sortable: false },
        { text: 'Fecha', value: 'createdAt', sortable: false }
      ]
    }
  },
  mounted () {
    this.getLogs()
  },
  methods: {
    getLogs () {
      setInterval(async () => {
        const res = await fetch('https://log.arnoproducciones.com/pppoe,ppp,info.log')
        const text = await res.text()
        const parts = text.split('\n')
        const data = parts.map((part, index) => {
          // eslint-disable-next-line no-unused-vars
          const [createdAt, hostname, rule, mikrotik, secret, details] = part.split(' ')
          return {
            index,
            hostname,
            rule,
            createdAt,
            mikrotik,
            secret,
            details
          }
        })
        this.parts = data
      }, 1000)
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { hour: 'numeric', minute: 'numeric', weekday: 'long', day: 'numeric', month: 'long' })
      return humanDateFormat
    }
  }
}
</script>
