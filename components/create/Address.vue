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
      max-width="800"
    >
      <v-card>
        <v-card-title class="headline">
          Ingresa la nueva direccion de {{ client.name }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6" lg="3" md="3">
              <v-select
                v-model="dir1"
                :items="dirFragment1"
                label="Dirección"
                outlined
                dense
                hide-details
                @blur="genAddress"
              />
            </v-col>
            <v-col cols="6" lg="3" md="3">
              <v-text-field
                v-model="dir2"
                label="#"
                outlined
                dense
                hide-details
                @blur="genAddress"
              />
            </v-col>
            <v-col cols="6" lg="3" md="3">
              <v-select
                v-model="dir3"
                :items="dirFragment2"
                label="#"
                value="#"
                outlined
                dense
                hide-details
                @blur="genAddress"
              />
            </v-col>
            <v-col cols="6" lg="3" md="3">
              <v-text-field
                v-model="dir4"
                label="#"
                outlined
                dense
                hide-details
                @blur="genAddress"
              />
            </v-col>
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
    client: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      modal: false,
      address: '',
      neighborhood: null,
      neighborhoods: [],
      dir1: '',
      dir2: '',
      dir3: '#',
      dir4: '',
      dirFragment1: [
        '(SIN INICIAL)',
        'CARRERA',
        'CALLE',
        'MANZANA',
        'DIAGONAL'
      ],
      dirFragment2: [
        '#',
        'CASA',
        'DIAGONAL',
        'LOTE'
      ]
    }
  },
  methods: {
    genAddress () {
      this.address = `${this.dir1} ${this.dir2} ${this.dir3} ${this.dir4}`
    },
    async initComponent () {
      this.modal = true
      this.neighborhoods = await this.$store.dispatch('neighborhood/getAll', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
    },
    addAddress () {
      this.$store.dispatch('address/addAddress', {
        client: this.client,
        address: this.address,
        neighborhood: this.neighborhood,
        token: this.$store.state.auth.token
      })
      this.modal = false
      this.$emit('updateClient')
    }
  }
}
</script>
