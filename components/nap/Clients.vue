<template>
  <div v-if="Object.keys(napdata).length > 0">
    <v-card-title>
      {{ napClientsList.length }} Clientes en Nap {{ napdata.code }}
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
          :headers="headersNapClientList"
          :items="napClientsList"
          :page.sync="page"
          class="elevation-1"
          no-data-text="No hay clientes que mostrar"
          mobile-breakpoint="100"
          hide-default-footer
          @page-count="pageCount = $event"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <div style="white-space:nowrap">
              <v-btn
                icon
                small
                @click="removeClient(item)"
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
        @keyup.enter="searchClient"
      />
      <div v-if="showSearchResult">
        <client-only>
          <v-data-table
            :headers="headersClientList"
            :items="clientList"
            :page.sync="page2"
            no-data-text="No han cargando los clientes"
            no-results-text="Error al cargar los clientes"
            mobile-breakpoint="100"
            class="elevation-1"
            hide-default-footer
            @page-count="pageCount2 = $event"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <div style="white-space:nowrap">
                <v-btn
                  icon
                  small
                  @click="addClient(item)"
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
      napClientsList: [],
      clientList: [],
      showSearchResult: false,
      page: 0,
      pageCount: 0,
      page2: 0,
      pageCount2: 0,
      headersNapClientList: [
        { text: 'Codigo', value: 'code' },
        { text: 'Cedula', value: 'dni' },
        { text: 'Nombre', value: 'name' },
        { text: 'Direccion', value: 'address' },
        { text: 'Acciones', value: 'actions' }
      ],
      headersClientList: [
        { text: 'Codigo', value: 'code' },
        { text: 'Nombre', value: 'name' },
        { text: 'Barrio', value: 'neighborhood.name' },
        { text: 'Direccion', value: 'address' },
        { text: 'Acciones', value: 'actions' }
      ],
      createdMessage: '',
      alertBox: false,
      alertBoxColor: ''
    }
  },
  watch: {
    napdata () {
      this.getNapClients()
    }
  },
  methods: {
    async getNapClients () {
      this.loading = true
      const qs = require('qs')
      const query = qs.stringify({
        populate: ['clients']
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
        .then((clients) => {
          this.napClientsList = clients.data
          this.loading = false
        })
    },
    async searchClient () {
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
          populate: ['neighborhood']
        },
        {
          encodeValuesOnly: true
        })
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          }
        })
          .then(res => res.json())
          .then((clients) => {
            this.clientList = clients.data
          })
      }
    },
    async addClient (client) {
      this.loading = true
      const clientExist = this.napClientsList.find(item => item.id === client.id)
      if (!clientExist) {
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}naps/${this.napdata.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          },
          body: JSON.stringify({
            data: {
              clients: [
                ...this.napClientsList,
                client
              ]
            }
          })
        }).then((input) => {
          if (input.status === 200) {
            this.getNapClients()
            this.napClientsList.push(client)
            this.loading = false
          }
        })
      } else {
        this.loading = false
        this.alertBox = true
        this.alertBoxColor = 'error'
        this.createdMessage = 'El cliente ya existe en el Nap'
      }
    },
    removeClient (client) {
      this.loading = true
      fetch(`${this.$config.API_STRAPI_ENDPOINT}naps/${this.napdata.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: {
            clients: this.napClientsList.filter(item => item.id !== client.id)
          }
        })
      }).then((input) => {
        if (input.status === 200) {
          this.getNapClients()
          this.loading = false
        }
      })
    }
  }
}

</script>
