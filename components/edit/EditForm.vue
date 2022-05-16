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
          @click="dialogEdit = true"
        >
          <v-icon>mdi-pencil</v-icon>
          <span v-if="block">
            Editar Cliente
          </span>
        </v-btn>
      </template>
      <span>Editar Cliente</span>
    </v-tooltip>
    <v-dialog v-if="dialogEdit" v-model="dialogEdit" max-width="1100px" :retain-focus="false" :fullscreen="getResolution()">
      <v-card>
        <v-card-title>
          <v-toolbar
            elevation="0"
          >
            <v-btn
              icon
              @click="dialogEdit = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Editar Cliente <span class="text--disabled text-caption"> // ID: {{ editClient ? editClient.id : '' }}</span></v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-alert
              v-if="alertBox"
              type="info"
              :class="alertBoxColor"
              tile
              dismissible
            >
              {{ createdMessage }}
            </v-alert>
            <v-form ref="editForm" v-model="valid">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="editClient.code"
                    :disabled="!$isAdmin()"
                    type="number"
                    label="Codigo"
                    required
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="editClient.dni"
                    :disabled="!$isAdmin()"
                    type="number"
                    label="Cedula"
                    required
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-text-field
                :value="editClient.name ? editClient.name.toUpperCase() : ''"
                :disabled="!(!$isAdmin() || !$isBiller())"
                label="Nombre Completo"
                required
                outlined
                dense
                hide-details
                class="pb-3 mt-3"
                @input="editClient.name = $event.toUpperCase()"
              />
              <v-row>
                <v-col cols="6" lg="3" md="3">
                  <v-text-field
                    :value="editClient.address ? editClient.address.toUpperCase() : ''"
                    :disabled="!(!$isAdmin() || !$isBiller())"
                    label="Direccion"
                    outlined
                    dense
                    hide-details
                    @input="editClient.address = $event.toUpperCase()"
                  />
                </v-col>
                <v-col cols="6" lg="3" md="3">
                  <v-autocomplete
                    v-model="editClient.neighborhood"
                    :disabled="!(!$isAdmin() || !$isBiller())"
                    item-text="name"
                    item-value="id"
                    :items="neighborhoods"
                    return-object
                    label="Barrio"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="6" lg="3" md="3">
                  <v-select
                    v-model="editClient.city"
                    item-text="name"
                    item-value="id"
                    :items="cities"
                    return-object
                    label="Ciudad"
                    disabled
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="6" lg="3" md="3">
                  <v-text-field
                    v-model="editClient.phone"
                    :disabled="!(!$isAdmin() || !$isBiller())"
                    label="Telefono"
                    required
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row v-if="clienttype.name === 'INTERNET'">
                <v-col cols="12" lg="4" md="4">
                  <v-select
                    v-model="editClient.plan"
                    :disabled="!(!$isAdmin() || !$isBiller())"
                    item-text="name"
                    item-value="id"
                    :items="plans"
                    return-object
                    label="Plan"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="6" lg="4" md="4">
                  <v-text-field
                    v-model="editClient.wifi_ssid"
                    :disabled="!$isAdmin()"
                    label="Nombre de Red"
                    required
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="6" lg="4" md="4">
                  <v-text-field
                    v-model="editClient.wifi_password"
                    :disabled="!$isAdmin()"
                    :type="!(!$isAdmin() || !$isBiller()) ? 'password' : 'text'"
                    label="Clave de Red"
                    required
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row v-if="clienttype.name === 'INTERNET'">
                <v-col>
                  <CreateDevice :clientid="editClient.id" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-select
                    v-if="clienttype.name === 'INTERNET'"
                    v-model="editClient.technology"
                    :disabled="!(!$isAdmin() || !$isBiller() || !$isTechnician())"
                    item-text="name"
                    item-value="id"
                    :items="technologies"
                    :rules="[v => !!v || 'Debes especificar la tecnología']"
                    return-object
                    label="Tecnología"
                    outlined
                    dense
                    required
                    hide-details
                  />
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-text-field
                    v-if="clienttype.name === 'INTERNET'"
                    :value="editClient.nap_onu_address ? editClient.nap_onu_address.toUpperCase() : ''"
                    label="Direccion NAP/ONU"
                    outlined
                    dense
                    hide-details
                    @input="editClient.nap_onu_address = $event.toUpperCase()"
                  />
                </v-col>
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-text-field
                    v-if="clienttype.name === 'INTERNET'"
                    v-model="editClient.opticalPower"
                    label="Potencia Óptica (Solo numeros)"
                    outlined
                    dense
                    type="number"
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    :value="getDate(editClient.createdAt)"
                    label="Fecha de Creación"
                    required
                    outlined
                    dense
                    readonly
                    disabled
                    hide-details
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    :value="getDate(editClient.updatedAt)"
                    label="Última actualización"
                    required
                    outlined
                    dense
                    readonly
                    disabled
                    hide-details
                  />
                </v-col>
                <v-col>
                  <v-select
                    v-if="clienttype.name === 'INTERNET'"
                    v-model="editClient.newModel"
                    :disabled="!$isAdmin()"
                    :items="idwith"
                    item-text="name"
                    item-value="id"
                    mandatory
                    label="Identificar con:"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <!-- <v-col>
                  <v-text-field
                    :value="item.operator.username"
                    label="Creado por"
                    required
                    outlined
                    dense
                    readonly
                    disabled
                    hide-details
                  />
                </v-col> -->
              </v-row>
              <!-- <div v-if="can('EditFormComment')">
                <v-textarea
                  :value="editClient.comment"
                  auto-grow
                  persistent-hint
                  outlined
                  label="Comentario Local (Solo API)"
                  dense
                  readonly
                  disabled
                />
              </div> -->
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="mr-4"
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="updateClient(editClient, index)"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
/* eslint-disable vue/prop-name-casing */
export default {
  name: 'EditForm',
  props: {
    client: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    },
    role: {
      type: Array,
      default: () => []
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      addDevice: false,
      device: {},
      valid: false,
      editClient: {},
      pref_mac: '',
      dir1: '',
      dir2: '',
      dir3: '',
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
        'DIAGONAL'
      ],
      dialogEdit: false,
      loading: false,
      alertBox: false,
      alertBoxColor: '',
      createdMessage: '',
      idwith: [
        { id: 0, name: 'Cedula' },
        { id: 1, name: 'Codigo' }
      ],
      valid_mac: [
        value => !!value || 'Debes especificar la Mac',
        (value) => {
          const pattern = /^[A-Fa-f0-9]+$/
          return pattern.test(value) || 'La mac no es válida. No pongas guiones ni dos puntos'
        }
      ],
      success: false,
      error: false,
      commentDisabled: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  computed: {
    cities () {
      return this.$store.state.cities
    },
    plans () {
      return this.$store.state.plans
    },
    neighborhoods () {
      return this.$store.state.neighborhoods
    },
    technologies () {
      return this.$store.state.technologies
    },
    devicebrands () {
      return this.$store.state.devicebrands
    },
    clienttype () {
      return this.$store.state.clienttypes.find(ct => ct.name === this.$route.query.clienttype)
    },
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    }
  },
  watch: {
    client () {
      Object.assign(this.editClient, this.client)
    },
    addDevice () {
      this.device = {}
    }
  },
  mounted () {
    Object.assign(this.editClient, this.client)
  },
  methods: {
    async updateClient (client, index) {
      this.loading = true
      const operator = this.$store.state.auth.id
      if (this.addDevice) {
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}devices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          },
          body: JSON.stringify({
            data: { mac_address: this.device.mac_address, devicebrand: this.device.devicebrand.id, clients: [this.editClient.id] }
          })
        }).then((input) => {
          if (input.status === 200) {
            Promise.resolve(input.json())
              .then((device) => {
                this.$store.dispatch('client/updateClientDevices', { device, index })
                this.$emit('updateSuccess')
                this.device = {}
              })
          } else {
            throw new Error('Error updating client')
          }
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
      }
      await this.$store.dispatch('client/updateClient', { client, index, operator, token: this.$store.state.auth.token })
      await this.$store.dispatch('client/updateClientCommentOnMikrotik', { client, token: this.$store.state.auth.token })
      this.$emit('updateSuccess')
      this.$simpleTelegramUpdate({ client: this.client, operator: this.$store.state.auth.username, telegramBots: this.telegramBots })
      this.loading = false
      this.dialogEdit = false
    },
    genAddress () {
      this.Client.address = `${this.dir1} ${this.dir2} ${this.dir3} ${this.dir4}`
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    getResolution () {
      const res = document.body.clientWidth
      if (res < 800) {
        const isMobile = true
        return isMobile
      } else {
        const isMobile = false
        return isMobile
      }
    }
  }
}
</script>

<style>

</style>
