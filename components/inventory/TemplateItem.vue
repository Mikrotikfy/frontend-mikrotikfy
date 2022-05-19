<template>
  <div>
    <v-row>
      <v-col cols="3" class="py-1">
        <v-autocomplete
          v-model="material.details"
          label="Material"
          item-text="name"
          item-value="id"
          return-object
          :items="materials"
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
    materials () {
      return this.$store.state.inventory.materials
    }
  },
  methods: {
    update () {
      this.$store.commit('inventory/updateWithdrawList', {
        index: this.index,
        material: this.material
      })
    },
    removeItem () {
      this.$store.commit('inventory/removeWithdrawList', this.index)
    }
  }
}
</script>
