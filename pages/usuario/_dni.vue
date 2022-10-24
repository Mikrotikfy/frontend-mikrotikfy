<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="5">
        <v-card>
          <MainLogo />
          <v-card-title class="text-center justify-center">
            Consulta tu estado de cuenta
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="dni"
              label="Ingresu tu cedula"
              outlined
              prominent
            />
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="primary"
              l-large
              @click="getAccount"
            >
              Consultar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="clients">
      <v-col>
        <v-card>
          <v-card-text v-for="client in clients" :key="client.id">
            <div v-if="client.monthlybills.length > 0">
              <p>{{ client.name }}</p>
              <p>{{ client.addresses ? client.addresses.at(-1).address + ' ' + client.addresses.at(-1).neighborhood.name : client.addresss }}</p>
              <a
                v-for="bill in client.monthlybills"
                :key="bill.id"
                :href="`https://admin.arnoproducciones.com/${bill.path}`"
              >Ver tu factura</a>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'ConsultBill',
  layout: 'outuser',
  data () {
    return {
      clients: null
    }
  },
  computed: {
    dni () {
      return this.$route.params.dni
    }
  },
  methods: {
    async getAccount () {
      this.clients = await this.$store.dispatch('client/getByDni', {
        dni: this.dni
      })
      const date = Date.now()
      const month = new Date(date).getMonth()
      const year = new Date(date).getFullYear()
      console.log(date, month + 2, year)
    }
  },
  head () {
    return {
      title: 'Consulta estado de cuenta'
    }
  }
}
</script>
