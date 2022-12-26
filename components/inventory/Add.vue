<template>
  <div>
    <v-btn
      rounded
      class="ml-2 elevation-0"
      color="primary"
      @click="modal = true"
    >
      <v-icon>mdi-import</v-icon>
      <span>Ingresar</span>
    </v-btn>
    <v-dialog
      v-model="modal"
      max-width="590"
    >
      <v-card class="elevation-0">
        <v-card-title>
          Agregar Material
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="8">
              <v-autocomplete
                v-model="add.material"
                item-text="name"
                item-value="id"
                :items="materialList"
                return-object
                label="Material a agregar"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model.number="add.quantity"
                min="1"
                label="Cantidad"
                type="number"
                outlined
                dense
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model.number="add.materialtype"
                label="Tipo"
                item-text="name"
                item-value="id"
                return-object
                :items="materialTypes"
                type="number"
                outlined
                dense
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="blue darken-4"
                class="elevation-0"
                rounded
                :loading="loading"
                :disabled="loading"
                @click="addMaterial()"
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
  props: {
    type: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      modal: false,
      add: {
        material: null,
        materialtype: 1,
        quantity: 1
      },
      loading: false
    }
  },
  computed: {
    materialList () {
      return this.$store.state.inventory.materials
    },
    materialTypes () {
      return this.$store.state.inventory.materialTypes
    },
    currentCity () {
      return this.$store.state.cities.find(city => city.name === this.$route.query.city)
    }
  },
  methods: {
    async getMaterialList () {
      await this.$store.dispatch('inventory/getMaterialList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageSize: 24 } })
    },
    async addMaterial () {
      this.loading = !this.loading
      if (!this.add.material || !this.add.quantity) {
        this.$toast.error('Rellena todos los campos antes de continuar', { position: 'bottom-center' })
        this.loading = !this.loading
        return
      }
      const hasQuantities = this.add.material.materialquantities.length > 0
      const availableQuantity = this.add.material.materialquantities.filter(q => q.materialtype.name === this.add.materialtype.name)
      if (hasQuantities && availableQuantity.length > 0) {
        this.$toast.success('Cantidad actualizada... ', { duration: 1000, position: 'bottom-center' })
        await this.$store.dispatch('inventory/updateCurrentMaterialQuantity', {
          material: {
            details: this.add.material
          },
          availableQuantity,
          token: this.$store.state.auth.token,
          city: this.$route.query.city,
          newQuantity: this.add,
          action: 'return'
        })
      } else {
        this.$toast.info('Cantidad creada... ', { duration: 1000, position: 'bottom-center' })
        await this.$store.dispatch('inventory/createMaterialQuantity', { token: this.$store.state.auth.token, city: this.$route.query.city, data: this.add, action: 'return' })
      }
      this.getMaterialList()
      this.resetFields()
      this.loading = !this.loading
    },
    resetFields () {
      this.add.material = null
      this.add.quantity = 0
    }
  }
}
</script>
