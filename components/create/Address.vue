<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :color="$vuetify.theme.dark ? 'primary' : 'white'"
          v-on="on"
          @click="initComponent"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Añadir Dirección</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="1360"
    >
      <v-card>
        <v-card-title class="headline">
          Ingresa la nueva direccion de {{ service.normalized_client.name }}
        </v-card-title>
        <v-card-text>
          <div class="my-5 parent">
            <v-select
              v-model="dir1"
              :items="dirFragment1"
              label="Dirección"
              autocomplete="off"
              outlined
              dense
              hide-details
            />
            <v-autocomplete
              v-model="dir2"
              label="#"
              placeholder="5, 10, etc..."
              autocomplete="off"
              :items="numbers"
              outlined
              dense
              hide-details
            />
            <v-autocomplete
              v-model="dir3"
              label="Adicional"
              placeholder="BIZ, APTO, etc..."
              autocomplete="off"
              :items="[
                'A',
                'B',
                'C',
                'W',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'BIZ',
                'APTO',
                'CASA',
                'EDIFICIO',
                'TORRE',
                'INTERIOR',
                'OFICINA',
                'LOCAL',
                'PISO',
                'MANZANA',
                'LOTE',
                'KM',
                'VEREDA',
                'FINCA',
                'PARCELA',
                'BODEGA'
              ]"
              outlined
              dense
              hide-details
            />
            <v-select
              v-model="dir4"
              :items="dirFragment2"
              autocomplete="off"
              label="#"
              value="No."
              outlined
              dense
              hide-details
            />
            <v-autocomplete
              v-model="dir5"
              label="#"
              placeholder="5, 10, etc..."
              autocomplete="off"
              :items="numbers"
              outlined
              dense
              hide-details
            />
            <v-autocomplete
              v-model="dir6"
              label="Adicional"
              placeholder="BIZ, APTO, etc..."
              autocomplete="off"
              :items="[
                'A',
                'B',
                'C',
                'W',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'BIZ',
                'APTO',
                'CASA',
                'EDIFICIO',
                'TORRE',
                'INTERIOR',
                'OFICINA',
                'LOCAL',
                'PISO',
                'MANZANA',
                'LOTE',
                'KM',
                'VEREDA',
                'FINCA',
                'PARCELA',
                'BODEGA'
              ]"
              outlined
              dense
              hide-details
            />
            <v-autocomplete
              v-model="dir7"
              label="#"
              placeholder="5, 10, etc..."
              autocomplete="off"
              :items="numbers"
              outlined
              dense
              hide-details
            />
            <v-text-field
              v-model="dir8"
              label="Opcional"
              placeholder="APTO 101, MANZANA 5, etc..."
              autocomplete="off"
              outlined
              dense
              hide-details
            />
          </div>
          <v-row class="align-center">
            <h5 class="ml-4">
              Así va quedando la dirección:
            </h5>
            <h4 class="ml-2 px-3 grey darken-3 text-weight-bold rounded-xl white--text">
              {{ address }}
            </h4>
            <v-btn x-small class="ml-2 red darken-4" @click="resetAddress">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
          <v-row>
            <v-col>
              <v-autocomplete
                v-model="neighborhood"
                :items="neighborhoods"
                return-object
                item-text="name"
                item-value="id"
                label="Barrio"
                :rules="[v => !!v || 'Barrio requerido']"
                required
                outlined
                dense
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="blue darken-4"
            @click="addAddress()"
          >
            Guardar y continuar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    service: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      modal: false,
      neighborhood: null,
      dir1: '',
      dir2: '',
      dir3: '',
      dir4: 'No.',
      dir5: '',
      dir6: '',
      dir7: '',
      dir8: '',
      dir9: '',
      dirFragment1: [
        '(SIN INICIAL)',
        'CARRERA',
        'CALLE',
        'MANZANA',
        'DIAGONAL'
      ],
      dirFragment2: [
        'No.',
        'CASA',
        'DIAGONAL',
        'LOTE',
        'FINCA',
        'KM',
        'VEREDA',
        'PARCELA',
        'BODEGA'
      ]
    }
  },
  computed: {
    neighborhoods () {
      return this.$store.state.neighborhood.Allneighborhoods
    },
    address () {
      return `${this.dir1} ${this.dir2}${this.dir3} ${this.dir4} ${this.dir5}${this.dir6} ${this.dir7 !== '' ? '-' : ''} ${this.dir7} ${this.dir8}`
    },
    numbers () {
      return Array.from({ length: 1200 }, (_, i) => i + 1)
    }
  },
  methods: {
    async initComponent () {
      this.modal = true
      await this.$store.dispatch('neighborhood/getAll', {
        city: this.service.city.name,
        token: this.$store.state.auth.token
      })
    },
    resetAddress () {
      this.dir1 = ''
      this.dir2 = ''
      this.dir3 = ''
      this.dir4 = 'No.'
      this.dir5 = ''
      this.dir6 = ''
      this.dir7 = ''
      this.dir8 = ''
      this.dir9 = ''
    },
    addAddress () {
      if (this.neighborhood === null) {
        this.$toast.error('El barrio es requerido', { duration: 10000 })
        return
      }
      this.$store.dispatch('address/addAddress', {
        service: this.service,
        address: this.address,
        neighborhood: this.neighborhood,
        token: this.$store.state.auth.token
      })
      this.modal = false
      this.$store.commit('client/refresh')
    }
  }
}
</script>
<style scoped>
.parent {
  display:grid;
  grid-template-columns: 2fr 1fr 2fr 1fr 1fr 2fr 1fr 2fr;
  column-gap: 10px;
}
</style>
