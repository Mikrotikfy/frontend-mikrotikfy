<template>
  <v-container>
    <v-card class="rounded-xl">
      <v-card-title class="text-center d-flex align-center justify-center">
        Inventario de materiales
      </v-card-title>
      <v-card-text class="d-flex justify-center">
        <v-tabs
          v-model="tab"
          grow
          align-with-title
        >
          <v-tabs-slider />

          <v-tab
            v-for="item in items"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-card-text>
      <v-card-text>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <InventoryList />
          </v-tab-item>
          <v-tab-item>
            <InventoryHistory />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      tab: null,
      items: [
        'Inventario', 'Historial'
      ]
    }
  },
  methods: {
  },
  head () {
    return {
      title: 'Inventario - API ARNOP'
    }
  }
}
</script>
