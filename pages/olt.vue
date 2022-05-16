<template>
  <v-card>
    <v-card-title>Buscar Rutas MAC {{ cityName }}</v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step
              :complete="e1 > 1"
              step="1"
            >
              Ingresar Macs
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="e1 > 2"
              step="2"
            >
              Revisar
            </v-stepper-step>

            <v-divider />
            <v-stepper-step step="3">
              Operaciones
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-textarea
                v-model="input"
                outlined
                class="mt-4"
                label="00:00:00:00:00:00"
              />

              <v-btn
                color="blue darken-4"
                @click="searchInDatabaseFromMikrotik()"
              >
                Preparar Clientes
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-chip
                color="info darken-4"
              >
                Encontrados: {{ foundCount }}
              </v-chip>
              <v-chip
                color="red darken-4"
              >
                No entontrado: {{ errorCount }}
              </v-chip>
              <v-btn
                color="blue darken-4"
                :loading="loading"
                :disabled="loading"
                @click="setBrand()"
              >
                Asignar Marca
              </v-btn>
              <client-only>
                <v-data-table
                  no-data-text="Aun no MAC para buscar"
                  :items="discoveredClients"
                  :headers="headers"
                  :loading="loading"
                  class="mt-3 mb-3"
                />
              </client-only>

              <v-btn
                color="primary"
                @click="e1 = 3, fixmac()"
              >
                Continuar
              </v-btn>

              <v-btn text @click="e1 = 1, discoveredClients = [], foundCount = 0, errorCount = 0, clientCount = 0">
                Volver
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-chip
                color="cyan darken-4"
              >
                Macs Preparadas: {{ fixmacList.length }}
              </v-chip>
              <v-btn
                color="cyan darken-4"
                :loading="loading"
                :disabled="loading"
                @click="executeFixMac()"
              >
                Ejecutar Arreglo
              </v-btn>
              <v-chip
                color="cyan darken-4"
              >
                Dispositivos Agregados: {{ successfulDevices }}
              </v-chip>
              <v-btn text @click="e1 = 1, discoveredClients = [], fixmacList = [], foundCount = 0, errorCount = 0, clientCount = 0">
                Cancelar
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  // apollo: {
  //   plans () {
  //     return {
  //       query: gqlt`
  //       query{
  //         plans{
  //           _id
  //           name
  //           mikrotik_name
  //         }
  //       }
  //     `
  //     }
  //   }
  // },
  components: {
  },
  middleware: ['defaultCity', 'authenticated'],
  data () {
    return {
      e1: 1,
      cityName: 'default',
      title: 'Rutas OLT ',
      page: 1,
      pageCount: 0,
      itemsPerPage: 50,
      search: '',
      errorCount: 0,
      foundCount: 0,
      clientCount: 0,
      secretList: [],
      discoveredClients: [],
      dataTable: [],
      fixmacList: [],
      successfulDevices: 0,
      devicebrands: [],
      input: '',
      headers: [
        { text: 'MAC', sortable: true, value: 'searchedMac' },
        { text: 'Nombre', sortable: true, value: 'name' },
        { text: 'Code', sortable: true, value: 'code' },
        { text: 'Tec.', sortable: true, value: 'technology.name' },
        { text: 'Barrio', sortable: true, value: 'neighborhood.name' },
        { text: 'Direccion', sortable: true, value: 'address' },
        { text: 'Marca', sortable: true, value: 'brand.name' },
        { text: 'Aciones', value: 'actions', sortable: false }
      ],
      loading: false
    }
  },
  mounted () {
    this.getSecretsFromMikrotik()
    this.getDatabaseClients()
    this.getDeviceBrands()
  },
  // methods: {
  //   setBrand () {
  //     this.loading = true
  //     for (let i = 0; i < this.discoveredClients.length; i++) {
  //       const mac = this.discoveredClients[i].searchedMac.split(':')
  //       const macPart = mac[0] + mac[1] + mac[2]
  //       this.$strapi.find('devicebrandparts', { mac_part: macPart }).then((response) => {
  //         const brand = response[0].devicebrand
  //         if (response.length > 0) {
  //           this.$set(this.discoveredClients[i], 'brand', brand)
  //         } else {
  //           const brand = {
  //             name: 'No reg.'
  //           }
  //           this.$set(this.discoveredClients[i], 'brand', brand)
  //         }
  //       })
  //     }
  //     this.loading = false
  //   },
  //   fixmac () {
  //     this.loading = true
  //     this.discoveredClients.forEach((client) => {
  //       const newMacClients = {}
  //       newMacClients.id = client._id
  //       newMacClients.mac_address = client.searchedMac
  //       this.fixmacList.push(newMacClients)
  //     })
  //     this.loading = false
  //   },
  //   executeFixMac () {
  //     const fixedmacList = this.fixmacList
  //     fixedmacList.forEach(async (fixedmac) => {
  //       const device = await this.$strapi.create('devices', { mac_address: fixedmac.mac_address, clients: [fixedmac.id] })
  //       if (device.id) {
  //         this.successfulDevices++
  //       }
  //     })
  //     this.loading = false
  //   },
  //   getSecretsFromMikrotik () {
  //     this.secretList = []
  //     this.$apollo.query({
  //       query: gqlt`
  //       query($city: String) {
  //         getClientSecrets(city: $city){
  //           name
  //           mac_address
  //         }
  //       }
  //     `,
  //       variables: {
  //         city: this.$route.query.city
  //       }
  //     }).then((input) => {
  //       this.secretList = input.data.getClientSecrets
  //       this.loading = false
  //     }).catch((error) => {
  //       // eslint-disable-next-line no-console
  //       console.error(error)
  //       this.initialLoading = false
  //     })
  //   },
  //   async getDeviceBrands () {
  //     this.devicebrands = await this.$strapi.graphql({
  //       query: `query {
  //         devicebrands{
  //           id
  //           name
  //           devicebrandparts{
  //             mac_part
  //           }
  //         }
  //       }`
  //     })
  //   },
  //   getDatabaseClients () {
  //     this.initialLoading = true
  //     this.dataTable = []
  //     this.$apollo.query({
  //       query: gqlt`
  //       query($city: ID!) {
  //         city(id: $city){
  //           name
  //           clients{
  //             _id
  //             code
  //             name
  //             address
  //             neighborhood{
  //               name
  //             }
  //             city{
  //               name
  //             }
  //             technology{
  //               id
  //               name
  //             }
  //             mac_addresses{
  //               mac_address
  //             }
  //           }
  //         }
  //       }
  //     `,
  //       variables: {
  //         city: this.$route.query.city
  //       }
  //     }).then((input) => {
  //       this.cityName = input.data.city.name
  //       for (let i = 0; i < input.data.city.clients.length; i++) {
  //         const dataTable = {}
  //         dataTable._id = input.data.city.clients[i]._id
  //         dataTable.status = '#777'
  //         dataTable.code = input.data.city.clients[i].code
  //         dataTable.name = input.data.city.clients[i].name
  //         dataTable.address = input.data.city.clients[i].address
  //         dataTable.neighborhood = input.data.city.clients[i].neighborhood
  //         dataTable.city = input.data.city.clients[i].city
  //         dataTable.technology = input.data.city.clients[i].technology
  //         this.dataTable.push(dataTable)
  //       }
  //       this.initialLoading = false
  //     }).catch((error) => {
  //       // eslint-disable-next-line no-console
  //       console.error(error)
  //       this.initialLoading = false
  //     })
  //   },
  //   searchInDatabaseFromMikrotik () {
  //     const input = this.input.split('\n')
  //     for (let i = 0; i < input.length; i++) {
  //       // eslint-disable-next-line eqeqeq
  //       const search = this.secretList.filter(c => c.mac_address == input[i])
  //       if (search.length > 0) {
  //         const macSearch = search[0].name
  //         // eslint-disable-next-line eqeqeq
  //         const clientDatabaseSearch = this.dataTable.filter(c => c.code == macSearch)
  //         if (clientDatabaseSearch < 1) {
  //           // eslint-disable-next-line eqeqeq
  //           const clientDatabaseSearch2 = this.dataTable.filter(c => c.dni == macSearch)
  //           if (clientDatabaseSearch2 < 1) {
  //             // no existe como DNI
  //             this.errorCount++
  //           } else { // existe como DNI
  //             clientDatabaseSearch2[0].searchedMac = input[i]
  //             this.discoveredClients.push(clientDatabaseSearch2[0])
  //             this.foundCount++
  //           }
  //         } else {
  //           // existe como CODIGO
  //           clientDatabaseSearch[0].searchedMac = input[i]
  //           this.discoveredClients.push(clientDatabaseSearch[0])
  //           this.foundCount++
  //         }
  //       } else { // no existe como CODIGO
  //         this.errorCount++
  //       }
  //     }
  //     if (input.length > 0) {
  //       this.e1 = 2
  //     }
  //   }
  // },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'language', name: 'language', content: 'es' },
        { hid: 'audience', name: 'audience', content: 'all' },
        { hid: 'rating', name: 'rating', content: 'general' },
        { hid: 'distribution', name: 'distribution', content: 'global' },
        { hid: 'document-type', name: 'document-type', content: 'Public' },
        { hid: 'MSSmartTagsPreventParsing', name: 'MSSmartTagsPreventParsing', content: 'true' },
        { hid: 'robots', name: 'robots', content: 'all' },
        { hid: 'robots', name: 'robots', content: 'all, index, follow' },
        { hid: 'googlebot', name: 'googlebot', content: 'all, index, follow' },
        { hid: 'yahoo-slurp', name: 'yahoo-slurp', content: 'all, index, follow' },
        { hid: 'msnbot', name: 'msnbot', content: 'index, follow' },
        { hid: 'googlebot-image', name: 'googlebot-image', content: 'all' },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: 'ARNOProducciones - Base de datos interactiva' },
        { hid: 'author', name: 'author', content: 'Nicolas Echeverry' }
      ]
    }
  }
}
</script>
