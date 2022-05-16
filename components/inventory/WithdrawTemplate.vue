<template>
  <div>
    <v-btn
      rounded
      class="ml-2 elevation-0"
      color="red darken-4"
      @click="modal = true"
    >
      <v-icon>mdi-export-variant</v-icon>
      <span>Entregar {{ template.name }}</span>
    </v-btn>
    <v-dialog
      v-model="modal"
      max-width="990"
    >
      <v-card class="elevation-0">
        <v-card-title>
          Entregar {{ template.name }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-autocomplete
                v-model="dispense.technician"
                item-text="username"
                item-value="id"
                :items="operatorList"
                label="Entregar a"
                outlined
                dense
                hide-details
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                class="elevation-0"
                color="blue darken-4"
                @click="addItem"
              >
                <v-icon>mdi-arrow-down</v-icon>
                <span>Agregar</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider class="mb-5" />
        <v-card-text>
          <v-row>
            <v-col>
              <p v-if="materials.length < 1" class="text-center">
                Agrega un elemento para continuar
              </p>
              <InventoryTemplateItem
                v-for="(material, index) in materials"
                :key="index"
                :index="index"
                :material="{...material}"
                :materials="materials"
                :materiallist="materialList"
                @update="updateItem"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="red darken-4"
            text
            :loading="loading"
            :disabled="loading"
            @click="dispenseMaterial"
          >
            Entregar
          </v-btn>
          <v-btn
            text
            @click="modal = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'InventoryWithdrawTemplate',
  props: {
    template: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dispense: {
        operator: this.$store.state.auth.id,
        technician: null
      },
      materials: [],
      loading: false,
      modal: false
    }
  },
  computed: {
    operatorList () {
      return this.$store.state.inventory.operatorList
    },
    materialList () {
      return this.$store.state.inventory.materialList
    },
    materialTypes () {
      return this.$store.state.inventory.materialTypes
    },
    materialHistoryTypeList () {
      return this.$store.state.inventory.materialHistoryTypeList
    },
    materialHistoryTypeListReturn () {
      return this.$store.state.inventory.materialHistoryTypeListReturn
    }
  },
  mounted () {
    this.getOperatorList()
    this.getMaterialList()
    this.getMaterialHistoryTypeList()
  },
  methods: {
    getOperatorList () {
      this.$store.dispatch('inventory/getOperatorList', { token: this.$store.state.auth.token, city: this.$route.query.city })
    },
    getMaterialList () {
      this.$store.dispatch('inventory/getMaterialList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageSize: 1000 } })
    },
    getMaterialTypes () {
      this.$store.dispatch('inventory/getMaterialTypes', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageSize: 1000 } })
    },
    getMaterialHistoryTypeList () {
      this.$store.dispatch('inventory/getMaterialHistoryTypeList', { token: this.$store.state.auth.token, city: this.$route.query.city })
    },
    async dispenseMaterial (material) {
      this.loading = !this.loading
      if (this.materials.length < 1 || !this.dispense.technician) {
        this.$toast.error('Rellena todos los campos antes de continuar', { position: 'top-center' })
        this.loading = !this.loading
        return
      }
      const currentQuantityOfSelected = material.materialquantities.filter(item => item.materialtype.name === this.dispense.materialtype.name)[0]?.quantity
      if (currentQuantityOfSelected < this.dispense.quantity || !currentQuantityOfSelected || currentQuantityOfSelected.length < 1) {
        this.$toast.error('No hay suficiente material para dispensar', { position: 'top-center' })
        this.loading = !this.loading
        return
      }
      const quantity = this.dispense.material.materialquantities.filter(q => q.materialtype.name === this.dispense.materialtype.name)
      await this.$store.dispatch('inventory/createOperationHistory', { token: this.$store.state.auth.token, city: this.$route.query.city, data: this.dispense })
      await this.$store.dispatch('inventory/updateCurrentMaterialQuantity', {
        quantity,
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        data: this.dispense,
        action: 'add'
      })
      await this.$store.dispatch('inventory/getMaterialHistoryList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageCount: 1, pageSize: 10 } })
      await this.$store.dispatch('inventory/getMaterialList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageCount: 1, pageSize: 24 } })
      this.getMaterialList()
      this.resetFields()
      this.loading = !this.loading
    },
    addItem () {
      this.materials.push({
        id: -1,
        name: '',
        materialtype: {
          id: 1,
          name: 'GENERAL'
        }
      })
    },
    updateItem (data) {
      console.log(data)
      this.materials[data.index] = data.material
    }
  }
}
</script>
