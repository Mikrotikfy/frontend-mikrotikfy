<template>
  <div>
    <v-row>
      <v-col cols="3" class="py-1">
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
          @change="update()"
        />
      </v-col>
      <v-col cols="3" class="py-1">
        <v-text-field
          v-model.number="material.quantity"
          min="1"
          label="Cantidad"
          type="number"
          outlined
          dense
          @input="update()"
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
          @change="update()"
        />
      </v-col>
      <v-col cols="3" class="py-1">
        <v-text-field
          v-model.number="material.description"
          label="Comentario (Opcional)"
          outlined
          dense
          @keyup="update()"
        />
      </v-col>
      <v-col cols="1" class="py-1">
        <v-btn
          class="elevation-0"
          color="red darken-4"
          @click="removeItem"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
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
        quantity: null,
        description: '',
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
    update () {
      this.$store.commit('inventory/updateWithdrawList', {
        index: this.index,
        material: this.material
      })
    },
    // updateMaterial (material) {
    //   this.$store.commit('inventory/updateWithdrawListMaterial', {
    //     index: this.index,
    //     material
    //   })
    // },
    // updateQuantity (quantity) {
    //   console.log(quantity)
    //   this.$store.commit('inventory/updateWithdrawListQuantity', {
    //     index: this.index,
    //     quantity: quantity.key
    //   })
    // },
    // updateMaterialType (materialtype) {
    //   console.log(materialtype)
    //   this.$store.commit('inventory/updateWithdrawListMaterialType', {
    //     index: this.index,
    //     materialtype
    //   })
    // },
    // updateDescription (description) {
    //   this.$store.commit('inventory/updateWithdrawListDescription', {
    //     index: this.index,
    //     description: description.key
    //   })
    // },
    removeItem () {
      this.$store.commit('inventory/removeWithdrawList', this.index)
    }
  }
}
</script>
