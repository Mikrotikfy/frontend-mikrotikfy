<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent"
        >
          <v-icon>mdi-note-plus</v-icon>
          <span v-if="block">
            Ver Estados de Cuenta
          </span>
        </v-btn>
      </template>
      <span>Estados de cuenta</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="1024"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title>
          <v-icon>mdi-bill</v-icon>
          Estados de cuenta para {{ client.name }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <pre>
            {{ client.monthlybills }}
          </pre>
          <v-data-table
            :headers="[
              { text: 'Mes', value: 'month' },
              { text: 'Año', value: 'year' },
              { text: 'Fue enviada en facturacion mensual', value: 'success' },
              { text: 'Acciones', value: 'actions', sortable: false }
            ]"
            :items="client.monthlybills"
            :loading="loading"
            :mobile-breakpoint="0"
            :no-data-text="'No hay datos para mostrar'"
            :no-results-text="'No hay resultados para mostrar'"
            class="elevation-1"
            hide-default-footer
            item-key="id"
            show-expand
          >
            <template v-slot:[`item.success`]="{ item }">
              {{ item.success ? 'Si' : 'No' }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                color="yellow darken-4"
                @click="sendBill(item)"
              >
                <v-icon>mdi-send</v-icon>
                Reenviar Estado de cuenta
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            @click="modal = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'ClientStatus',
  props: {
    client: {
      type: Object,
      default: () => {}
    },
    block: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    modal: false,
    loading: false,
    billData: null
  }),
  methods: {
    initComponent () {
      this.modal = true
    }
  }
}
</script>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  grid-gap: 1rem;
  grid-auto-rows: minmax(100px, auto);
}
.grid-item {
  border-radius: 5px;
  padding: 1rem;
  font-size: 1.2rem;
  text-align: center;
}

</style>
