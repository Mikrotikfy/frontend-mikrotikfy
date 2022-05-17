<template>
  <div>
    <v-row>
      <v-col cols="6" class="py-1">
        <v-select
          v-model="material.details"
          label="Material"
          item-text="name"
          item-value="id"
          return-object
          :items="materialList"
          outlined
          dense
          hide-details
          @change="updateItem"
        />
      </v-col>
      <v-col cols="4" class="py-1">
        <v-text-field
          v-model.number="material.quantity"
          min="1"
          label="Cantidad"
          type="number"
          outlined
          dense
          @keyup="updateItem"
        />
      </v-col>
      <v-col cols="2" class="py-1">
        <v-select
          v-model="material.materialtype"
          label="Tipo"
          item-text="name"
          item-value="id"
          return-object
          :items="materialTypes"
          outlined
          dense
          @change="updateItem"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'InventoryWithdrawTemplateItem',
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      material: {
        details: null,
        quantity: 1,
        materialtype: {
          id: 1,
          name: 'GENERAL'
        }
      }
    }
  },
  computed: {
    materialTypes () {
      return this.$store.state.inventory.materialTypes
    },
    materialList () {
      return this.$store.state.inventory.materialList
    }
  },
  methods: {
    updateItem ({ index = this.index, material = this.material }) {
      this.$store.commit('inventory/updateWithdrawList', { index, material: { quantity: material.quantity, ...material.details, materialtype: { ...material.materialtype } } })
    }
  }
}
</script>
