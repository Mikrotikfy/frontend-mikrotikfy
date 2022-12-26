<template>
  <div>
    <v-btn
      rounded
      class="ml-2 elevation-0"
      color="red darken-4"
      @click="modal = true"
    >
      <v-icon>mdi-export-variant</v-icon>
      <span>Entregar</span>
    </v-btn>
    <v-dialog
      v-model="modal"
      max-width="1090"
    >
      <v-card class="elevation-0">
        <v-card-title>
          Salida de material
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="6">
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
            <v-col cols="12" lg="6">
              <v-autocomplete
                v-model="dispense.materialHistoryType"
                item-text="name"
                item-value="id"
                return-object
                :items="materialHistoryTypeList"
                label="Razon"
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
                @click="addWithdrawItem"
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
              <p v-if="withdrawList.length < 1" class="text-center">
                Agrega un elemento para continuar
              </p>
              <InventoryTemplateItem
                v-for="(material, index) in withdrawList"
                :key="material.count"
                :index="index"
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
            @click="loopMaterialList"
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
  data () {
    return {
      dispense: {
        operator: this.$store.state.auth.id,
        technician: null,
        materialHistoryType: {
          id: 3,
          name: 'SALIDA TECNICO'
        }
      },
      loading: false,
      modal: false,
      countWithdraw: 0
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
    },
    withdrawList () {
      return this.$store.state.inventory.withdrawList
    }
  },
  mounted () {
    this.getMaterials()
  },
  methods: {
    async getMaterials () {
      await this.$store.dispatch('inventory/getMaterials', { token: this.$store.state.auth.token, city: this.$route.query.city })
    },
    async getMaterialList () {
      await this.$store.dispatch('inventory/getMaterialList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageSize: 24 } })
    },
    async getMaterialHistory () {
      await this.$store.dispatch('inventory/getMaterialHistoryList', { token: this.$store.state.auth.token, city: this.$route.query.city, pagination: { page: 1, pageCount: 1, pageSize: 24 } })
    },
    async loopMaterialList () {
      this.loading = true
      if (this.withdrawList.length < 1 || !this.dispense.technician) {
        this.$toast.error('Rellena todos los campos antes de continuar', { position: 'bottom-center' })
        this.loading = !this.loading
        return
      }
      for (const material of this.withdrawList) {
        await this.dispenseMaterial(material)
      }
      this.loading = false
      await this.getMaterials()
      await this.getMaterialList()
      await this.getMaterialHistory()
      await this.$store.commit('inventory/emptyWithdrawList')
      this.countWithdraw = 0
      this.modal = false
    },
    async dispenseMaterial (material) {
      const currentQuantityOfSelected = material.details.materialquantities.filter(item => item.materialtype.name === material.materialtype.name)[0]?.quantity
      if (material.quantity > currentQuantityOfSelected || !currentQuantityOfSelected || currentQuantityOfSelected.length < 1) {
        this.$toast.error(`No hay suficiente material para dispensar ${material.details.name}`, { position: 'bottom-center' })
        this.loading = false
        return
      }
      await this.$store.dispatch('inventory/createOperationHistory', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        material: {
          ...material,
          materialhistorytype: this.dispense.materialHistoryType,
          technician: this.dispense.technician,
          operator: this.dispense.operator
        }
      })
      const availableQuantity = material.details.materialquantities.filter(q => q.materialtype.name === material.materialtype.name)
      await this.$store.dispatch('inventory/updateCurrentMaterialQuantity', {
        material,
        availableQuantity,
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        newQuantity: material,
        action: 'add'
      })
    },
    addWithdrawItem () {
      this.countWithdraw++
      this.$store.commit('inventory/addWithdrawItem', {
        count: this.countWithdraw,
        description: '',
        details: {
          id: this.countWithdraw,
          name: null
        },
        materialtype: {
          id: 1,
          name: 'GENERAL'
        },
        quantity: 0
      })
    }
  }
}
</script>
