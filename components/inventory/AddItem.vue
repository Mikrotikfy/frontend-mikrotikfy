<template>
  <div>
    <v-btn
      rounded
      class="ml-2 elevation-0"
      color="green darken-4"
      @click="modal = true"
    >
      <v-icon>mdi-plus</v-icon>
      <span>Añadir Nuevo</span>
    </v-btn>
    <v-dialog
      v-model="modal"
      max-width="590"
    >
      <v-card class="elevation-0">
        <v-card-title>
          Agregar Item
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols>
              <v-text-field
                v-model="item.name"
                label="Item"
                outlined
                dense
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="success darken-4"
                class="elevation-0"
                rounded
                :loading="loading"
                :disabled="loading"
                @click="addItem()"
              >
                Agregar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      item: {
        name: null
      },
      loading: false,
      modal: false
    }
  },
  computed: {
    materialList () {
      return this.$store.state.inventory.materialList
    },
    currentCity () {
      return this.$store.state.cities.find(city => city.name === this.$route.query.city)
    }
  },
  mounted () {
    this.getMaterialList()
  },
  methods: {
    getMaterialList () {
      this.$store.dispatch('inventory/getMaterialList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageSize: 1000 } })
    },
    async addItem () {
      this.loading = !this.loading
      if (!this.item.name) {
        this.$toast.error('Rellena todos los campos antes de continuar', { position: 'top-center' })
        this.loading = !this.loading
        return
      }
      await this.$store.dispatch('inventory/createItem', { token: this.$store.state.auth.token, city: this.currentCity, data: this.item })
      this.getMaterialList()
      this.resetFields()
      this.loading = !this.loading
    },
    resetFields () {
      this.item.name = null
      this.item.quantity = 0
      this.item.materialtype = null
    }
  }
}
</script>
