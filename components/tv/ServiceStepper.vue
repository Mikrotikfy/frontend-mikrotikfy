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
          <v-icon>mdi-newspaper-variant-outline</v-icon>
          <span v-if="block">
            Ficha Técnica
          </span>
        </v-btn>
      </template>
      <span>Ficha Técnica</span>
    </v-tooltip>
    <v-dialog
      v-model="dialog"
      width="680px"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Ficha Técnica</v-toolbar-title>
        </v-toolbar>
        <v-stepper
          v-model="e6"
          vertical
        >
          <v-stepper-step
            :complete="e6 > 1"
            step="1"
            editable
          >
            Calidad de señal
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-select
              v-model="specs.quality"
              :items="tvSpecTypes"
              item-text="name"
              item-value="id"
              label="Calidad de señal"
              prepend-icon="mdi-signal"
              class="mb-5"
              outlined
              hide-details
            />
            <v-btn
              color="primary"
              @click="e6 = 2"
            >
              Siguiente
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :complete="e6 > 2"
            step="2"
            editable
          >
            Medida DBs
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-text-field
              v-model="specs.db"
              label="Medida de DBs"
              prepend-icon="mdi-volume-high"
              class="mb-5"
              outlined
              hide-details
            />
            <v-btn
              color="primary"
              @click="e6 = 3"
            >
              Siguiente
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :complete="e6 > 3"
            step="3"
            editable
          >
            Medida Altos
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-text-field
              v-model.number="specs.high"
              label="Altos"
              prepend-icon="mdi-arrow-up-bold-box"
              class="mb-5"
              type="number"
              outlined
              hide-details
            />
            <v-btn
              color="primary"
              @click="e6 = 4"
            >
              Siguiente
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :complete="e6 > 4"
            step="4"
            editable
          >
            Medida Bajos
          </v-stepper-step>
          <v-stepper-content step="4">
            <v-text-field
              v-model.number="specs.down"
              label="Bajos"
              prepend-icon="mdi-arrow-down-bold-box"
              class="mb-5"
              type="number"
              outlined
              hide-details
            />
            <v-btn
              color="primary"
              @click="save()"
            >
              Guardar
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  props: {
    clientid: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: ''
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      e6: 1,
      dialog: false,
      specs: {
        quality: null,
        db: -1,
        high: -1,
        down: -1
      }
    }
  },
  computed: {
    tvSpecTypes () {
      return this.$store.state.tv.spectypes
    }
  },
  mounted () {
    this.getTvSpecTypes()
  },
  methods: {
    initComponent () {
      this.dialog = true
    },
    getTvSpecTypes () {
      this.$store.dispatch('tv/getTvSpecTypes', { token: this.$store.state.auth.token })
    },
    save () {
      if (this.specs.quality === null) {
        this.$toast.error('Seleccione una calidad de señal', { duration: 3000 })
        this.e6 = 1
        return
      }
      if (this.specs.db === -1) {
        this.$toast.error('Ingrese una medida de DBs', {
          duration: 3000
        })
        this.e6 = 2
        return
      }
      if (this.specs.high === -1) {
        this.$toast.error('Ingrese una medida de altos', {
          duration: 3000
        })
        this.e6 = 3
        return
      }
      if (this.specs.down === -1) {
        this.$toast.error('Ingrese una medida de bajos', {
          duration: 3000
        })
        this.e6 = 4
        return
      }
      this.dialog = false
      this.$store.dispatch('tv/saveSpecs', {
        clientid: this.clientid,
        specs: this.specs,
        token: this.$store.state.auth.token
      })
      this.$toast.info('Guardando...', { duration: 2000 })
      this.e6 = 1
    }
  }
}
</script>
