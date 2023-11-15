<template>
  <v-container fluid class="pb-0">
    <div
      v-if="!$store.state.isDesktop"
      class="d-flex"
    >
      <div>
        <v-select
          v-model="selectedCity"
          :items="cities"
          label="Ciudad"
          item-value="id"
          item-text="name"
          return-object
          filled
          dense
          rounded
          hide-details="auto"
          class="elevation-0"
          style="border-radius: 30px 0 0 30px;height:48px;"
          @change="changeCity(selectedCity)"
        >
          <template v-slot:selection="{ item }">
            {{ item.name }}
          </template>
        </v-select>
      </div>
      <div>
        <v-select
          v-model="selectedClienttype"
          :items="clienttypes"
          label="Tipo"
          item-value="id"
          item-text="name"
          return-object
          filled
          dense
          rounded
          hide-details="auto"
          class="elevation-0"
          style="border-radius: 0 30px 30px 0;height:48px;"
          @change="changeType(selectedClienttype)"
        >
          <template v-slot:selection="{ item }">
            {{ item.name }}
          </template>
        </v-select>
      </div>
    </div>
    <div
      :class="$store.state.isDesktop ? 'mt-0' : 'mt-4'"
      class="justify-center d-flex"
    >
      <v-select
        v-if="$store.state.isDesktop"
        v-model="selectedCity"
        :items="cities"
        label="Ciudad"
        item-value="id"
        item-text="name"
        return-object
        solo
        rounded
        hide-details="auto"
        class="elevation-0 mr-1"
        style="max-width:180px;border-radius: 30px 0 0 30px;height:48px;"
        @change="changeCity(selectedCity)"
      >
        <template v-slot:selection="{ item }">
          {{ item.name }}
        </template>
      </v-select>
      <v-select
        v-if="$store.state.isDesktop"
        v-model="selectedClienttype"
        :items="clienttypes"
        label="Tipo"
        item-value="id"
        item-text="name"
        return-object
        solo
        rounded
        hide-details="auto"
        class="elevation-0 mr-1"
        style="max-width:180px;border-radius: 0;height:48px;"
        @change="changeType(selectedClienttype)"
      >
        <template v-slot:selection="{ item }">
          {{ item.name }}
        </template>
      </v-select>
      <v-text-field
        v-model="search"
        :label="loadingDataTable ? 'Cargando... Por favor espere.' : 'Buscar codigo, cedula, nombre, telefono o direccion'"
        :loading="loadingDataTable"
        :disabled="loadingDataTable"
        hide-details
        return-object
        chips
        solo
        rounded
        class="white--text"
        style="width:100px;max-width: 1100px;"
        :style="$store.state.isDesktop ? 'border-radius: 0;' : 'border-radius: 30px 0 0 30px;'"
        @keyup.enter="searchServices"
      />
      <v-tooltip>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="grey lighten-4 black--text elevation-0"
            dark
            :loading="loadingDataTable"
            tile
            style="border-radius: 0;padding:5px;border-radius: 0 30px 30px 0;height:48px;"
            v-bind="attrs"
            v-on="on"
            @click="searchServices"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <span>Busqueda</span>
      </v-tooltip>
    </div>
  </v-container>
</template>
<script>
export default {
  name: 'BillingSearchBox',
  data () {
    return {
      search: '',
      selectedCity: null,
      selectedClienttype: null,
      searchResults: null,
      loadingDataTable: false,
      preventWatchRedirect: false
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.auth.cities ? this.$store.state.auth.cities.find(c => c.id == this.$route.query.city) : ''
    },
    cities () {
      return this.$store.state.auth.cities
    },
    clienttypes () {
      return this.$store.state.auth.clienttypes
    }
  },
  mounted () {
    this.setSelectedCity()
    this.setSelectedClienttype()
    this.setSearch()
    if (this.$route.params.search && this.$route.path.includes('address')) {
      this.search = this.$route.params.search
    }
  },
  methods: {
    text: item => `${item.code} - ${item.dni} - ${item.name} - ${item.phone}`,
    searchServices () {
      this.$router.push({ path: '/billing', query: { search: this.search, city: this.$route.query.city, clienttype: this.$route.query.clienttype } })
    },
    changeCity (city) {
      this.$router.push({
        query: this.search ? {
          search: this.search,
          city: city.name,
          clienttype: this.$route.query.clienttype
        } : {
          city: city.name,
          clienttype: this.$route.query.clienttype
        }
      })
    },
    changeType (clienttype) {
      this.$router.push({
        query: this.search ? {
          search: this.search,
          city: this.$route.query.city,
          clienttype: clienttype.name
        } : {
          city: this.$route.query.city,
          clienttype: clienttype.name
        }
      })
    },
    setSelectedCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    setSelectedClienttype () {
      if (this.$route.query.clienttype) {
        this.selectedClienttype = this.$store.state.auth.clienttypes.find(c => c.name === this.$route.query.clienttype)
      }
    },
    setSearch () {
      if (this.$route.query.search) {
        this.search = this.$route.query.search
      }
    }
  }
}
</script>
