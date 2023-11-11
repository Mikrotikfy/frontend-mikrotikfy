<template>
  <v-container>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step
          :complete="e1 > 1"
          step="1"
        >
          Ingresar Macs {{ $route.query.city }}
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
            :loading="!$store.state.olt.secrets.length > 0"
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
          <!-- <v-btn
            color="blue darken-4"
            :loading="loading"
            :disabled="loading"
            @click="setBrand()"
          >
            Asignar Marca
          </v-btn> -->
          <client-only>
            <v-data-table
              no-data-text="Aun no MAC para buscar"
              :items="discoveredClients"
              :headers="headers"
              :loading="loading"
              :sort-by="['neighborhood.name']"
              :sort-desc="false"
              :items-per-page="1000"
              class="mt-3 mb-3"
            />
          </client-only>

          <!-- <v-btn
            color="primary"
            @click="e1 = 3, fixmac()"
          >
            Continuar
          </v-btn> -->

          <v-btn text @click="e1 = 1, discoveredClients = [], foundCount = 0, errorCount = 0, clientCount = 0">
            Volver
          </v-btn>
        </v-stepper-content>

        <!-- <v-stepper-content step="3">
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
        </v-stepper-content> -->
      </v-stepper-items>
    </v-stepper>
  </v-container>
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
      fixmacList: [],
      successfulDevices: 0,
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
      loading: true
    }
  },
  computed: {
    secrets () {
      return this.$store.state.olt.secrets
    },
    clients () {
      return this.$store.state.client.clientsForOlt
    },
    currentCityMikrotiks () {
      return this.$store.state.currentCityMikrotiks
    }
  },
  watch: {
    $route () {
      this.getSecretsFromMikrotik(true)
    }
  },
  async mounted () {
    await this.getSecretsFromMikrotik()
    await this.getDatabaseClients()
    this.loading = false
  },
  methods: {
    // setBrand () {
    //   this.loading = true
    //   for (let i = 0; i < this.discoveredClients.length; i++) {
    //     const mac = this.discoveredClients[i].searchedMac.split(':')
    //     const macPart = mac[0] + mac[1] + mac[2]
    //     this.$strapi.find('devicebrandparts', { mac_part: macPart }).then((response) => {
    //       const brand = response[0].devicebrand
    //       if (response.length > 0) {
    //         this.$set(this.discoveredClients[i], 'brand', brand)
    //       } else {
    //         const brand = {
    //           name: 'No reg.'
    //         }
    //         this.$set(this.discoveredClients[i], 'brand', brand)
    //       }
    //     })
    //   }
    //   this.loading = false
    // },
    // fixmac () {
    //   this.loading = true
    //   this.discoveredClients.forEach((client) => {
    //     const newMacClients = {}
    //     newMacClients.id = client._id
    //     newMacClients.mac_address = client.searchedMac
    //     this.fixmacList.push(newMacClients)
    //   })
    //   this.loading = false
    // },
    // executeFixMac () {
    //   const fixedmacList = this.fixmacList
    //   fixedmacList.forEach(async (fixedmac) => {
    //     const device = await this.$strapi.create('devices', { mac_address: fixedmac.mac_address, clients: [fixedmac.id] })
    //     if (device.id) {
    //       this.successfulDevices++
    //     }
    //   })
    //   this.loading = false
    // },
    async getSecretsFromMikrotik () {
      await this.$store.dispatch('city/getCurrentCityMikrotiks', { city: this.$route.query.city }).then((mikrotiks) => {
        this.$store.dispatch('olt/getSecretsFromMikrotik', { mikrotiks, city: this.$route.query.city, token: this.$store.state.auth.token })
      })
    },
    getDatabaseClients () {
      this.$store.dispatch('client/getUsersFromDatabaseByTypeAndCity', {
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        token: this.$store.state.auth.token,
        pagination: {
          pageSize: 2000
        }
      })
    },
    searchInDatabaseFromMikrotik () {
      const input = this.input.split('\n')
      for (let i = 0; i < input.length; i++) {
        // eslint-disable-next-line eqeqeq
        const search = this.secrets.filter(c => c['last-caller-id'] == input[i])
        if (search.length > 0) {
          const macSearch = search[0].name
          // eslint-disable-next-line eqeqeq
          const clientDatabaseSearch = this.clients.filter(c => c.code == macSearch)
          if (clientDatabaseSearch < 1) {
            // eslint-disable-next-line eqeqeq
            const clientDatabaseSearch2 = this.clients.filter(c => c.dni == macSearch)
            if (clientDatabaseSearch2 < 1) {
              // no existe como DNI
              this.errorCount++
            } else { // existe como DNI
              clientDatabaseSearch2[0].searchedMac = input[i]
              this.discoveredClients.push(clientDatabaseSearch2[0])
              this.foundCount++
            }
          } else {
            // existe como CODIGO
            clientDatabaseSearch[0].searchedMac = input[i]
            this.discoveredClients.push(clientDatabaseSearch[0])
            this.foundCount++
          }
        } else { // no existe como CODIGO
          this.errorCount++
        }
      }
      if (input.length > 0) {
        this.e1 = 2
      }
    }
  },
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
