<template>
  <div v-if="Object.keys(napdata).length > 0">
    <v-card-title>
      {{ napServiceList.length }} Servicios en Nap {{ napdata.code }}
    </v-card-title>
    <v-card-text>
      <v-alert
        v-if="alertBox"
        :type="alertBoxColor"
        :class="alertBoxColor"
        tile
        dismissible
      >
        {{ createdMessage }}
      </v-alert>
      <client-only>
        <v-data-table
          :headers="headersNapServiceList"
          :items="napServiceList"
          :page.sync="page"
          class="elevation-1"
          no-data-text="No hay servicios que mostrar"
          mobile-breakpoint="100"
          hide-default-footer
          @page-count="pageCount = $event"
        >
          <template v-slot:[`item.service_addresses.address`]="{ item }">
            <span>
              {{ item.service_addresses.at(-1).address }}
            </span>
          </template>
          <template v-slot:[`item.active`]="{ item }">
            <v-chip
              :color="item.active ? item.indebt ? 'red darken-4' : 'green darken-3' : item.indebt ? 'red darken-4' : 'grey darken-1'"
            >
              {{ item.active ? item.indebt ? 'En Mora' : 'Al Dia' : item.indebt ? 'En Mora' : 'Retirado' }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div style="white-space:nowrap">
              <v-btn
                icon
                small
                @click="removeService(item)"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </client-only>
      <v-pagination
        v-model="page"
        :length="pageCount"
      />
    </v-card-text>
    <v-card-text>
      <v-text-field
        v-model="codeSearch"
        label="Buscar codigo para agregar a Nap"
        prepend-icon="mdi-magnify"
        filled
        rounded
        @keyup.enter="searchService"
      />
      <div v-if="showSearchResult">
        <client-only>
          <v-data-table
            :headers="headersServiceList"
            :items="serviceList"
            :page.sync="page2"
            no-data-text="No han cargando los servicios"
            no-results-text="Error al cargar los servicios"
            mobile-breakpoint="100"
            class="elevation-1"
            hide-default-footer
            @page-count="pageCount2 = $event"
          >
            <template v-slot:[`item.service_addresses.address`]="{ item }">
              <span>
                {{ item.service_addresses.at(-1).address }}
              </span>
            </template>
            <template v-slot:[`item.service_addresses.neighborhood.name`]="{ item }">
              <span>
                {{ item.service_addresses.at(-1).neighborhood.name }}
              </span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <div style="white-space:nowrap">
                <v-btn
                  icon
                  small
                  @click="addService(item)"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
          <v-pagination
            v-model="page2"
            :length="pageCount2"
          />
        </client-only>
      </div>
    </v-card-text>
  </div>
</template>
<script>
export default {
  props: {
    napdata: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      codeSearch: '',
      loading: false,
      napServiceList: [],
      serviceList: [],
      showSearchResult: false,
      page: 0,
      pageCount: 0,
      page2: 0,
      pageCount2: 0,
      headersNapServiceList: [
        { text: 'Codigo', value: 'code' },
        { text: 'Cedula', value: 'normalized_client.dni' },
        { text: 'Nombre', value: 'normalized_client.name' },
        { text: 'Direccion', value: 'service_addresses.address' },
        { text: 'Estado', value: 'active' },
        { text: 'Acciones', value: 'actions' }
      ],
      headersServiceList: [
        { text: 'Codigo', value: 'code' },
        { text: 'Nombre', value: 'normalized_client.name' },
        { text: 'Barrio', value: 'service_addresses.neighborhood.name' },
        { text: 'Direccion', value: 'service_addresses.address' },
        { text: 'Acciones', value: 'actions' }
      ],
      createdMessage: '',
      alertBox: false,
      alertBoxColor: ''
    }
  },
  watch: {
    napdata () {
      this.getNapServices()
    },
    '$route.query.city' () {
      this.napServiceList = []
      this.serviceList = []
    }
  },
  methods: {
    async getNapServices () {
      this.loading = true
      const qs = require('qs')
      const query = qs.stringify({
        populate: ['services', 'services.normalized_client', 'services.service_addresses', 'services.service_addresses.neighborhood']
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}naps/${this.napdata.id}?${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then(({ data: naps }) => {
          this.napServiceList = naps.services
          this.loading = false
        })
    },
    async searchService () {
      this.showSearchResult = true
      this.alertBox = false
      if (this.codeSearch) {
        const qs = require('qs')
        const query = qs.stringify({
          filters: {
            code: this.codeSearch,
            city: {
              name: this.$route.query.city
            }
          },
          populate: ['service_addresses', 'service_addresses.neighborhood', 'normalized_client']
        },
        {
          encodeValuesOnly: true
        })
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}services?${query}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: services }) => {
            this.serviceList = services
          })
      }
    },
    async addService (service) {
      this.loading = true
      const serviceExist = this.napServiceList.find(item => item.id === service.id)
      if (!serviceExist) {
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}naps/${this.napdata.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          },
          body: JSON.stringify({
            data: {
              services: [
                ...this.napServiceList,
                service
              ]
            }
          })
        }).then((input) => {
          if (input.status === 200) {
            this.getNapServices()
            this.napServiceList.push(service)
            this.loading = false
          }
        })
      } else {
        this.loading = false
        this.alertBox = true
        this.alertBoxColor = 'error'
        this.createdMessage = 'El servicio ya existe en el Nap'
      }
    },
    removeService (service) {
      this.loading = true
      fetch(`${this.$config.API_STRAPI_ENDPOINT}naps/${this.napdata.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: {
            services: this.napServiceList.filter(item => item.id !== service.id)
          }
        })
      }).then((input) => {
        if (input.status === 200) {
          this.getNapServices()
          this.loading = false
        }
      })
    }
  }
}

</script>
