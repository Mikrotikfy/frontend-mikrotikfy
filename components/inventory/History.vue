<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          Historial de Movimientos
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items.sync="materialHistoryList"
            :page.sync="pagination.page"
            :items-per-page="pagination.pageSize"
            :sort-by.sync="sort.sortBy"
            :sort-desc.sync="sort.sortDesc"
            no-data-text="No hay nada para mostrar aún..."
            loading-text="Cargando información de historial inventario..."
            dense
            hide-default-footer
            @page-count="pagination.pageCount = $event"
          >
            <template v-slot:top>
              <div class="d-flex">
                <h3>Inventario General</h3>
                <v-spacer />
                <v-text-field
                  v-model="search"
                  outlined
                  dense
                  label="Busqueda de Historial"
                  class="mx-4"
                  prepend-icon="mdi-magnify"
                  @keyup.enter="getMaterialHistoryList(true)"
                />
              </div>
            </template>
            <template v-slot:[`item.material.name`]="{ item }">
              <span>
                {{ item.material.name }}
                <v-tooltip v-if="item.description" right>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      class="red--text darken-4"
                      v-on="on"
                    >*</span>
                  </template>
                  <span>{{ item.description }}</span>
                </v-tooltip>
              </span>
            </template>
            <template v-slot:[`item.createdAt`]="{ item }">
              <span>
                {{ getDate(item.createdAt) }}
              </span>
            </template>
            <template v-slot:[`item.updatedAt`]="{ item }">
              <span>
                {{ getDate(item.updatedAt) }}
              </span>
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination v-model="pagination.page" :length="pagination.pageCount" />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      search: null,
      sort: {
        sortBy: 'createdAt',
        sortDesc: true
      },
      pagination: {
        page: 1,
        pageCount: 1,
        pageSize: 10
      },
      headers: [
        { text: '#', value: 'id', sortable: false },
        { text: 'Material', value: 'material.name', sortable: false },
        { text: 'Salio de', value: 'materialtype.name', sortable: false },
        { text: 'Tipo Operacion', value: 'materialhistorytype.name', sortable: false },
        { text: 'Cantidad', value: 'quantity', sortable: false },
        { text: 'Entrego', value: 'operator.username', sortable: false },
        { text: 'Operario', value: 'technician.username', sortable: false },
        { text: 'Fecha', value: 'createdAt', sortable: false }
      ]
    }
  },
  computed: {
    materialHistoryList () {
      return this.$store.state.inventory.materialHistoryList
    }
  },
  watch: {
    'pagination.page': {
      handler () {
        this.getMaterialHistoryList()
      },
      deep: false
    }
  },
  mounted () {
    this.getMaterialHistoryList()
  },
  methods: {
    getMaterialHistoryList (haveSearch) {
      if (haveSearch) {
        this.pagination.page = 1
      }
      this.$store.dispatch('inventory/getMaterialHistoryList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: this.pagination, sort: this.sort, search: this.search }).then(() => {
        this.pagination = { ...this.$store.state.inventory.paginationMaterialHistoryList }
      })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
