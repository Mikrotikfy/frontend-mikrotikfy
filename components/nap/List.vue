<template>
  <form>
    <v-alert
      v-if="alertBox"
      type="info"
      :class="alertBoxColor"
      tile
      dismissible
    >
      {{ createdMessage }}
    </v-alert>
    <v-card-title>
      {{napList.length}} Naps en {{ selectedCity ? selectedCity.name : 'N/A' }}
    </v-card-title>
    <v-card-text class="d-flex">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar Naps"
        single-line
        outlined
        hide-details="auto"
        class="mr-2"
      />
      <v-select
        v-model="selectedCity"
        :items="cities"
        label="Filtrar Ciudad"
        item-value="id"
        item-text="name"
        return-object
        outlined
        hide-details="auto"
        @change="changeCity(selectedCity)"
      >
        <template v-slot:item="{ item }">
          {{ item.name }}
        </template>
      </v-select>
    </v-card-text>
    <v-card-text>
      <client-only>
        <v-data-table
          :headers="headers"
          :items="napList"
          :item-class="itemRowBackground"
          :page.sync="page"
          :search="search"
          sort-by="calories"
          mobile-breakpoint="100"
          class="elevation-1"
          active-class="selected2"
          hide-default-footer
          @page-count="pageCount = $event"
          @click:row="showNapInfo"
        >
          <template v-slot:[`item.ports`]="{ item }">
            <v-edit-dialog
              large
              cancel-text="Cancelar"
              save-text="Guardar"
              @open="initDialogPorts(item)"
              @save="updateNapPorts(item)"
            >
              <v-chip label outlined>
                {{ handlePorts(item.ports) }}
              </v-chip>
              <template v-slot:input>
                <v-text-field
                  ref="ports"
                  v-model="freePorts"
                  label="Puertos Libres"
                  single-line
                  outlined
                  hide-details="auto"
                  type="number"
                  required
                />
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.code`]="{ item }">
            <v-edit-dialog
              large
              cancel-text="Cancelar"
              save-text="Guardar"
              @open="initDialogCode(item)"
              @save="updateNapCode(item)"
            >
              <v-chip label outlined>
                {{ item.code }}
              </v-chip>
              <template v-slot:input>
                <v-text-field
                  ref="code"
                  v-model="newCode"
                  label="Codigo"
                  single-line
                  outlined
                  hide-details="auto"
                  required
                />
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.naptype.name`]="{ item }">
            <v-edit-dialog
              large
              cancel-text="Cancelar"
              save-text="Guardar"
              @open="initDialogType(item)"
              @save="updateNapType(item)"
            >
              <v-chip label outlined>
                {{ item.naptype.name }}
              </v-chip>
              <template v-slot:input>
                <v-autocomplete
                  ref="naptype"
                  v-model="newNapType"
                  :items="napTypes"
                  label="Tipeo de Nap"
                  return-object
                  item-text="name"
                  item-value="id"
                  auto-select-first
                  outlined
                  hide-details="auto"
                />
              </template>
            </v-edit-dialog>
          </template>
        </v-data-table>
      </client-only>
    </v-card-text>
    <v-pagination
      v-model="page"
      :length="pageCount"
    />
  </form>
</template>

<script>
export default {
  name: 'ListNap',
  data: () => ({
    id: 0,
    name: '',
    freePorts: 0,
    newCode: '',
    createdMessage: '',
    alertBox: false,
    selectedCity: null,
    alertBoxColor: '',
    isSubmitting: false,
    page: 0,
    pageCount: 0,
    search: '',
    headers: [
      { text: 'Codigo', value: 'code' },
      { text: 'Puertos Libres', value: 'ports' },
      { text: 'Tipo Nap', value: 'naptype.name' },
      { text: 'Barrio', value: 'neighborhood.name' },
      { text: 'Direccion', value: 'address' }
    ]
  }),
  computed: {
    cities () {
      return this.$store.state.auth.cities
    },
    napList () {
      return this.$store.state.nap.naps
    },
    napTypes () {
      return this.$store.state.nap.napTypes
    }
  },
  watch: {
    '$route.query.city' () {
      this.getNaps()
    }
  },
  mounted () {
    this.setQueryCity()
    this.getNaps()
  },
  methods: {
    handlePorts (ports) {
      if (!ports || ports === undefined) {
        return 'N/A'
      } else {
        return ports
      }
    },
    changeCity (city) {
      this.$router.push({ query: { city: city.name } })
    },
    setQueryCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    getNaps () {
      this.$store.dispatch('nap/getNaps', { city: this.$route.query.city, token: this.$store.state.auth.token })
    },
    updateNapPorts (nap) {
      this.$store.dispatch('nap/updateNap', { nap: { ...nap, ports: this.freePorts }, token: this.$store.state.auth.token })
        .then(() => {
          this.$toast.info('Nap actualiza correctamente', { duration: 3000 })
          this.getNaps()
        })
        .catch(() => {
          this.$toast.error('Error al actualizar nap', { duration: 3000 })
        })
    },
    updateNapCode (nap) {
      this.$store.dispatch('nap/updateNap', { nap: { ...nap, code: this.newCode }, token: this.$store.state.auth.token })
        .then(() => {
          this.$toast.info('Nap actualiza correctamente', { duration: 3000 })
          this.getNaps()
        })
        .catch(() => {
          this.$toast.error('Error al actualizar nap', { duration: 3000 })
        })
    },
    updateNapType (nap) {
      this.$store.dispatch('nap/updateNap', { nap: { ...nap, naptype: this.newNapType.id }, token: this.$store.state.auth.token })
        .then(() => {
          this.$toast.info('Nap actualiza correctamente', { duration: 3000 })
          this.getNaps()
        })
        .catch(() => {
          this.$toast.error('Error al actualizar nap', { duration: 3000 })
        })
    },
    showNapInfo (nap) {
      this.$emit('showNapInfo', nap)
    },
    itemRowBackground () {
      if (this.$vuetify.theme.dark) {
        return 'selected'
      }
    },
    initDialogPorts (nap) {
      this.freePorts = nap.ports
      setTimeout(() => {
        this.$refs.ports.$refs.input.select()
      }, 100)
    },
    initDialogCode (nap) {
      this.newCode = nap.code
      setTimeout(() => {
        this.$refs.code.$refs.input.select()
      }, 100)
    },
    initDialogType (nap) {
      this.newNapType = nap.naptype
      setTimeout(() => {
        this.$refs.code.$refs.input.select()
      }, 100)
    }
  }
}
</script>

<style>
.selected {
  background-color: #1f281f;
  cursor: pointer;
}
</style>
