<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="materialList"
            :page.sync="pagination.page"
            :items-per-page="pagination.pageSize"
            :sort-by.sync="sort.sortBy"
            :sort-desc.sync="sort.sortDesc"
            no-data-text="No hay nada para mostrar aún..."
            loading-text="Cargando información de inventario..."
            dense
            hide-default-footer
            @page-count="pagination.pageCount = $event"
          >
            <template v-slot:top>
              <div class="d-flex">
                <InventoryAddItem />
                <InventoryAdd />
                <InventoryWithdrawTemplate />
                <v-spacer />
                <v-text-field
                  v-model="search"
                  outlined
                  dense
                  label="Busqueda de Material"
                  class="mx-4"
                  prepend-icon="mdi-magnify"
                  @keyup.enter="getMaterialList(true)"
                />
              </div>
            </template>
            <template v-slot:[`item.materialquantities`]="{ item, index }">
              <div class="d-flex">
                <v-chip
                  small
                  class="blue darken-4 white--text mr-4"
                >
                  Total: {{ item.materialquantities.reduce((total, materialquantity) => total + materialquantity.quantity, 0) }}
                </v-chip>

                <v-edit-dialog
                  v-for="(materialquantity, i) in item.materialquantities"
                  :key="i"
                  :return-value.sync="materialquantity.quantity"
                  save-text="Guardar"
                  cancel-text="Cancelar"
                  large
                  @save="updateQuantity(materialquantity)"
                  @open="setCurrentQuantityHelper(materialquantity.quantity, index)"
                >
                  <v-chip
                    small
                    :class="materialquantity.quantity < 1 ? 'red darken-4 white--text mr-4' : 'white black--text mr-4'"
                  >
                    {{ materialquantity.materialtype.name + ' ' }}: <strong>{{ materialquantity.quantity }}</strong>
                  </v-chip>
                  <template v-slot:input>
                    <div class="mt-4 text-h6">
                      Cambiar Cantidad
                    </div>
                    <v-text-field
                      ref="edit"
                      v-model.number="changeQuantity"
                      single-line
                      outlined
                      autofocus
                      dense
                      onclick="this.select()"
                    />
                  </template>
                </v-edit-dialog>
              </div>
            </template>
            <template v-slot:[`item.createdAt`]="{ item }">
              <span>
                {{ getDate(item.createdAt) }}
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
      changeQuantity: null,
      search: null,
      sort: {
        sortBy: 'id',
        sortDesc: true
      },
      pagination: {
        page: 1,
        pageCount: 1,
        pageSize: 24
      },
      headers: [
        { text: '#', value: 'id', sortable: true },
        { text: 'Material', value: 'name', sortable: true },
        { text: 'Inventario Disponible', value: 'materialquantities', sortable: true }
      ]
    }
  },
  computed: {
    materialList () {
      return this.$store.state.inventory.materialList
    },
    materialTypes () {
      return this.$store.state.inventory.materialTypes
    }
  },
  watch: {
    'pagination.page': {
      handler () {
        this.getMaterialList()
      },
      deep: false
    },
    'sort.sortBy': {
      handler () {
        this.getMaterialList()
      },
      deep: false
    }
  },
  mounted () {
    this.getMaterialList()
    this.getMaterialTypes()
    this.getMaterialHistoryTypeList()
    this.getOperatorList()
  },
  methods: {
    setCurrentQuantityHelper (e, i) {
      this.changeQuantity = e
      setTimeout(() => {
        this.$refs.edit[i].$refs.input.select()
      }, 300)
    },
    async updateQuantity ({ id }) {
      await this.$store.dispatch('inventory/setMaterialQuantity', {
        id,
        quantity: this.changeQuantity,
        token: this.$store.state.auth.token
      })
      this.getMaterialList()
    },
    getMaterialTypes () {
      this.$store.dispatch('inventory/getMaterialTypes', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageSize: 1000 } })
    },
    getMaterialList (haveSearch = false) {
      if (haveSearch) {
        this.pagination.page = 1
      }
      this.$store.dispatch('inventory/getMaterialList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: this.pagination, sort: this.sort, search: this.search }).then(() => {
        this.pagination = { ...this.$store.state.inventory.paginationMaterialList }
      })
    },
    getOperatorList () {
      this.$store.dispatch('inventory/getOperatorList', { token: this.$store.state.auth.token, city: this.$route.query.city })
    },
    async getMaterialHistory () {
      await this.$store.dispatch('inventory/getMaterialHistoryList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageCount: 1, pageSize: 24 } })
    },
    getMaterialHistoryTypeList () {
      this.$store.dispatch('inventory/getMaterialHistoryTypeList', { token: this.$store.state.auth.token, city: this.$route.query.city })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
