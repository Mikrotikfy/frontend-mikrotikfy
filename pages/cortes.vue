<template>
  <v-card>
    <v-card-title>Desconectar clientes por mora en {{ cityName }}</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            md="6"
          >
            <v-row>
              <v-col>
                <v-btn
                  color="blue darken-4"
                  @click="prepare()"
                >
                  Preparar Clientes
                </v-btn>
                <v-chip
                  color="info darken-4"
                >
                  Pendientes: {{ Object.keys(pendingCuts).length }}
                </v-chip>
                <v-chip
                  color="red darken-4"
                >
                  Errores: {{ errorCount }}
                </v-chip>
                <v-chip
                  color="primary darken-4"
                >
                  Clientes: {{ count }}
                </v-chip>
              </v-col>
            </v-row>
            <v-textarea
              v-model="input"
              outlined
              label="Codigos a desconectar"
              class="mt-4"
            />
          </v-col>
          <v-col
            cols="12"
            lg="6"
            md="6"
          >
            <v-row>
              <v-btn
                color="red darken-4"
                class="mr-4"
                :loading="loading"
                :disabled="loading"
                @click="exec()"
              >
                Ejecutar Cortes
              </v-btn>
              <v-select
                v-model="setPlan"
                :items="plans"
                label="Aplicar Plan"
                item-value="id"
                item-text="name"
                dense
                return-object
                outlined
                width="150px"
                class="mr-4"
              />
              <v-select
                v-model="kickStat"
                :items="kick"
                item-value="id"
                item-text="name"
                return-object
                label="Patear?"
                dense
                outlined
                width="150px"
              />
            </v-row>
            <client-only>
              <v-data-table
                no-data-text="Aun no hay clientes por desconectar"
                :items="pendingCuts"
                :headers="headers"
                :loading="loading"
              />
            </client-only>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-text>
      <v-card-title>Clientes desconectados</v-card-title>
      <client-only>
        <v-data-table
          no-data-text="Aun no hay clientes desconectados en proceso"
          :items="successfulCuts"
          :headers="successfulCutsHeaders"
        />
      </client-only>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  middleware: ['defaultCity', 'authenticated'],
  data () {
    return {
      count: 0,
      cityName: 'default',
      title: 'DX por Mora',
      page: 1,
      pageCount: 0,
      itemsPerPage: 50,
      search: '',
      pendingCuts: [],
      setPlan: { id: 0, name: 'SELEC. PLAN' },
      errorCount: 0,
      clientCount: 0,
      dataTable: [],
      successfulCuts: [],
      input: '',
      headers: [
        { text: 'Codigo', sortable: true, value: 'code' },
        { text: 'Nombre', sortable: true, value: 'name' },
        { text: 'Plan', sortable: true, value: 'plan.name' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      successfulCutsHeaders: [
        { text: 'Codigo', sortable: true, value: 'code' },
        { text: 'Nombre', sortable: true, value: 'name' },
        { text: 'Exitoso', sortable: true, value: 'success' }
      ],
      kickStat: { id: 1, name: 'No patear' },
      kick: [
        { id: 1, name: 'No patear' },
        { id: 2, name: 'Patear' }
      ],
      loading: false
    }
  },
  computed: {
    plans () {
      return this.$store.state.plans
    }
  },
  mounted () {
    this.getInitialData()
  },
  methods: {
    async getInitialData () {
      this.initialLoading = true
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          city: {
            name: this.$route.query.city
          }
        }
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then((clients) => {
          this.count = clients.meta.pagination.total
        })
    },
    async prepare () {
      this.pendingCuts = []
      const input = this.input.trim().split('\n')
      for (let i = 0; i < input.length; i++) {
        const qs = require('qs')
        const query = qs.stringify({
          filters: {
            code: input[i],
            city: {
              name: this.$route.query.city
            },
            clienttype: {
              name: this.$route.query.clienttype
            }
          },
          populate: ['plan', 'technology']
        },
        {
          encodeValuesOnly: true
        })
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          }
        })
          .then(res => res.json())
          .then((client) => {
            if (client.data.length > 0) {
              this.pendingCuts.push(client.data[0])
            } else {
              this.errorCount++
            }
          })
      }
    },
    async exec () {
      this.successfulCuts = []
      this.loading = true
      const city = this.$route.query.city
      const pendingDx = this.pendingCuts
      if (this.setPlan.id === 0 || this.pendingCuts.length < 1) {
        this.$toast.error('Porfavor ingresa datos antes de iniciar.', { position: 'top-center' })
        this.loading = false
      } else {
        this.$toast.success('El proceso ha comenzado...', { duration: 7000, position: 'bottom-center' })
        for (let i = 0; i < pendingDx.length; i++) {
          await fetch(`${this.$config.API_STRAPI_ENDPOINT}dxclient`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$store.state.auth.token}`
            },
            body: JSON.stringify({
              input: {
                dx: pendingDx[i],
                dxPlan: {
                  id: this.setPlan.id,
                  name: this.setPlan.mikrotik_name
                },
                dxKick: this.kickStat.id,
                dxCity: city
              }
            })
          })
            .then((res) => {
              if (res.status === 200) {
                this.successfulCuts.push({ ...pendingDx[i], success: true })
              } else {
                this.errorCount++
                this.$toast.error('Error', { position: 'top-center' })
                this.loading = false
              }
            })
        }
        this.loading = false
      }
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
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

<style>

</style>
