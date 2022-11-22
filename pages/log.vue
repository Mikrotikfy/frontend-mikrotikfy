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
    <v-card>
      <v-card-title>Registro de usuarios en OLT 100, 99 y GPON</v-card-title>
      <v-data-table
        :headers="headersOlt"
        :items="partsOlt"
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
      partsOlt: [],
      headers: [
        { text: 'Secreto', sortable: false, value: 'secret' },
        { text: 'Detalles', value: 'details', sortable: false },
        { text: 'Mikrotik', value: 'mikrotik', sortable: false },
        { text: 'Fecha', value: 'createdAt', sortable: false }
      ],
      headersOlt: [
        { text: '#', sortable: false, value: 'index' },
        { text: 'MAC', value: 'mac', sortable: false },
        { text: 'Estado', value: 'type', sortable: false },
        { text: 'OLT', value: 'hostname', sortable: false },
        { text: 'PUERTO', value: 'ponnumber', sortable: false },
        { text: 'NUMERO ONU', value: 'onunumber', sortable: false },
        { text: 'Fecha', value: 'createdAt', sortable: false }
      ]
    }
  },
  computed: {
    city () {
      return this.$store.state.auth.cities.find(
        city => city.name === this.$route.query.city
      )
    }
  },
  mounted () {
    this.getLogs()
    this.getLogsOlt()
  },
  methods: {
    getLogs () {
      this.parts = []
      for (let i = 0; i < this.city.mikrotiks.length; i++) { // CAMBIA EL FOR ADENTRO DEL SETINTERNAL
        setInterval(async () => {
          const res = await fetch(`https://log.arnoproducciones.com/${this.city.mikrotiks[i].ip}-pppoe,ppp,info.log`)
          const text = await res.text()
          const parts = text.split('\n')
          const uwu = parts.map((part, index) => {
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
          this.parts.push(uwu)
        }, 3000)
      }
    },
    getLogsOlt () {
      for (let i = 0; i < this.city.mikrotiks.length; i++) {
        setInterval(async () => {
          const res = await fetch(`https://log.arnoproducciones.com/${this.city.mikrotiks[i].ip}-auditd.log`)
          const text = await res.text()
          const parts = text.split('\n')
          const data = parts.map((part, index) => {
            const sanPart = part.replace('0/', '').replace('ONU Register', 'Registro').replace('Auth Success', 'Autentico').replace('ONU Finish', 'Finalizo').replace('Dying Gasp', 'Perdida_Potencia').replace('Event Notific', 'N/A').replace('ONU Port Los', 'Perdida_Potencia').replace('ONU Deregister', 'Cayó').replace('ONU AUTH Success', 'Autentico').replace(/ +(?= )/g, '')
            // eslint-disable-next-line no-unused-vars
            const [createdAt, hostname, auditd, type, PON, ponnumber, ONU, onunumber, mac] = sanPart.split(' ')
            return {
              index,
              createdAt,
              type,
              hostname,
              ponnumber,
              onunumber,
              mac
            }
          })
          this.partsOlt = data
        }, 3000)
      }
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { hour: 'numeric', minute: 'numeric', weekday: 'long', day: 'numeric', month: 'long' })
      return humanDateFormat
    }
  }
}
</script>
