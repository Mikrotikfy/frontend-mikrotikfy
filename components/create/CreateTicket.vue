<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          text
          x-small
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-comment-plus-outline</v-icon>
        </v-btn>
      </template>
      <span>Crear Ticket</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      fullscreen
    >
      <v-card class="ticketCard" width="90%">
        <v-toolbar>
          <v-btn
            icon
            dark
            @click="modal = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row class="mx-0 px-5 mt-10">
          <v-col cols="12" md="6" lg="4">
            <v-card
              :loading="loading"
              class="rounded-xl"
            >
              <v-alert
                v-if="alertBox"
                type="info"
                :class="alertBoxColor"
                tile
                dismissible
              >
                {{ createdMessage }}
              </v-alert>
              <v-card-title>
                Crear Ticket de {{ clienttype.name }} <v-icon class="ml-2">{{ clienttype.icon }}</v-icon>
              </v-card-title>
              <div v-if="!loading">
                <v-card-text>
                  <v-select
                    v-model="ticketPayload.type"
                    :items="tickettypes"
                    item-text="name"
                    item-value="id"
                    label="¿Qué describe mejor el caso?"
                    outlined
                    return-object
                    hide-details="auto"
                    :error="errors.type"
                    @focus="errors.type = false, alertBox = false"
                  />
                </v-card-text>
                <v-card-text v-if="ticketPayload.type.name === 'TRASLADO'">
                  <p>Direccion de desconexion (Autogenerada)</p>
                  <v-row class="mb-2">
                    <v-col cols="6">
                      <v-text-field
                        :value="client.addresses.length > 0 ? client.addresses.at(-1).address : client.address"
                        label="#"
                        outlined
                        dense
                        hide-details
                        disabled
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        :value="client.addresses.length > 0 ? client.addresses.at(-1).neighborhood : client.neighborhood"
                        item-text="name"
                        item-value="id"
                        :items="neighborhoods"
                        label="Barrio"
                        outlined
                        dense
                        disabled
                        hide-details
                        return-object
                      />
                    </v-col>
                  </v-row>
                  <p>Direccion de Traslado</p>
                  <v-row class="mb-2">
                    <v-col cols="6" lg="3" md="3">
                      <v-select
                        v-model="cx.dir1"
                        :items="cx.dirFragment1"
                        label="Dirección"
                        outlined
                        dense
                        hide-details
                        @change="cxGenAddress"
                      />
                    </v-col>
                    <v-col cols="6" lg="3" md="3">
                      <v-text-field
                        v-model="cx.dir2"
                        label="#"
                        outlined
                        dense
                        hide-details
                        @change="cxGenAddress"
                      />
                    </v-col>
                    <v-col cols="6" lg="3" md="3">
                      <v-select
                        v-model="cx.dir3"
                        :items="cx.dirFragment2"
                        label="#"
                        value="#"
                        outlined
                        dense
                        hide-details
                        @change="cxGenAddress"
                      />
                    </v-col>
                    <v-col cols="6" lg="3" md="3">
                      <v-text-field
                        v-model="cx.dir4"
                        label="#"
                        outlined
                        dense
                        hide-details
                        @change="cxGenAddress"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="mb-2">
                    <v-col>
                      <v-autocomplete
                        v-model="cx.neighborhood"
                        item-text="name"
                        item-value="id"
                        :items="neighborhoods"
                        label="Barrio"
                        outlined
                        dense
                        hide-details
                        return-object
                        @change="cxGenAddress"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="phoneUpdate"
                        label="Actualizar celular (Opcional)"
                        outlined
                        dense
                        hide-details
                        :rules="phoneUpdate ? phoneRules : []"
                        prepend-icon="mdi-cellphone"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text v-if="ticketPayload.type.name === 'CAMBIO DE CONTRASEÑA'">
                  <v-text-field
                    v-model="ticketPayload.details"
                    :rules="valid_new_password"
                    label="Ingresa la nueva clave que desea el cliente"
                    :hide-details="hideHint"
                    outlined
                    @keyup="hideHint = false"
                  />
                </v-card-text>
                <v-card-text>
                  <v-textarea
                    v-if="ticketPayload.type.name !== 'TRASLADO' && ticketPayload.type.name !== 'CAMBIO DE CONTRASEÑA'"
                    v-model="ticketPayload.details"
                    outlined
                    label="Detalles del del caso"
                    placeholder="El router se encuentra bloqueado o fuera de linea desde..."
                    :error="errors.details"
                    @focus="errors.details = false, alertBox = false"
                  />
                </v-card-text>
              </div>
              <v-card-actions>
                <v-btn
                  color="blue darken-4"
                  class="rounded-xl"
                  x-large
                  :loading="loading"
                  :disabled="loading"
                  @click="createTicket()"
                >
                  Crear Caso
                </v-btn>
                <v-spacer />

                <v-btn
                  text
                  class="rounded-xl"
                  x-large
                  @click="modal = false"
                >
                  Cancelar el caso
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" lg="8">
            <v-card class="rounded-xl">
              <v-card-title>
                <v-icon class="mr-2">
                  mdi-account-alert-outline
                </v-icon>
                Recomendaciones para la toma de cosas nuevos
              </v-card-title>
              <v-card-text>
                <span class="text-body-1 text-decoration-underline red--text">Preguntas a realizar al ENCONTRARSE FUERA DE LINEA ❌</span><br>
                <span class="text-body-1 ml-2">• ¿Ya realizo un reinicio del router?</span><br>
                <span class="text-body-1 ml-10">• Si no lo ha realizado, pedirle que lo realice. Muchas veces el router se encuentra bloqueado.</span><br>
                <span class="text-body-1 ml-2">• ¿Tiene una luz roja encendida en el router?</span><br>
                <span class="text-body-1 ml-10">• Luz roja indica perdida de potencia óptica. Tomar revisión.</span><br>
                <span class="text-body-1 ml-2">• ¿Le aparece la red WIFI?</span><br>
                <span class="text-body-1 ml-10">• Si no le aparece la red WIFI significa que el router pudo haberse reseteado de fábrica. Tomar Revisión</span><br>
                <span class="text-body-1 ml-2">• ¿Todos los cables se encuentran correctamente conectados?</span><br>
                <span class="text-body-1 ml-10">• El usuario pudo haber manipulado el orden de conexión de los cables de router generando la perdida de señal. Si lo hizo, tomar revisión.</span><br>
                <span class="text-body-1 ml-2">• ¿Esta sobrecalentado el router?</span><br>
                <span class="text-body-1 ml-10">• Si esta sobrecalentado puede presentar problemas de cobertura o navegación. Tomar revisión.</span><br><br>
                <span class="text-body-1 text-decoration-underline green--text">Preguntas a realizar al ENCONTRARSE EN LINEA ✔️: </span><br>
                <span class="text-body-1 ml-2">• ¿En el momento cuenta con navegación?</span><br>
                <span class="text-body-1 ml-10">• Verificar si necesita algún servicio relacionado con cambio de contraseña o nombre de red</span><br>
                <span class="text-body-1 ml-2">• ¿Desde que fecha presenta el inconveniente?</span><br>
                <span class="text-body-1 ml-10">• Asegurarse que la revisión se pide en fechas que no concuerden con caídas de azteca recientes. De ser el caso, explicarle al cliente que se han presentado fallas por parte del proveedor. Si son antes de las fechas de caídas, tomar la revisión.</span><br>
                <span class="text-body-1 ml-2">• ¿Es en todos los dispositivos, o solo en algunos específicos?</span><br>
                <span class="text-body-1 ml-10">• Si los errores de navegación son solo en unos dispositivos en específico, puede ser problemas de canal y banda WIFI. Tomar la revisión</span><br>
                <span class="text-body-1 ml-10">• Si es en todos los dispositivos, puede ser que se haya solicitado un cambio de contraseña recientemente y el usuario no haya realizado el cambio en los dispositivos. Si no se pidió un cambio de contraseña recientemente, Tomar revisión.</span><br>
                <span class="text-body-1 ml-2">• ¿A que red esta conectado en el dispositivo que no le navega?</span><br>
                <span class="text-body-1 ml-10">• El usuario puede no estar conectado a la red WIFI. Preguntar a que red esta conectada y si concuerda con su apellido para descartar este escenario. O puede estar conectado a la red de algún vecino del que tenga la contraseña.</span><br>
                <span class="text-body-1 ml-2">• ¿Ha solicitado un cambio de contraseña recientemente?</span><br>
                <span class="text-body-1 ml-10">• A veces el usuario olvida que pidió un cambio de contraseña y no la agrega a sus dispositivos de nuevo, quedándose sin navegación.</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'CreateTicket',
  props: {
    client: {
      type: Object,
      default: () => {}
    },
    assignated: {
      type: Number,
      default: -1
    },
    role: {
      type: Array,
      default: () => {}
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    modal: false,
    loading: false,
    alertBox: false,
    phoneUpdate: null,
    alertBoxColor: '',
    createdMessage: '',
    errors: {
      type: false,
      details: false
    },
    ticketPayload: {
      client: '',
      type: {},
      details: '',
      city: '',
      assignated: ''
    },
    phoneRules: [
      (value) => {
        const pattern = /^[0-9]+$/
        return pattern.test(value) || 'El celular solo puede contener numeros'
      }
    ],
    cx: {
      neighborhood: {},
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
      ],
      finalAddress: ''
    },
    valid_new_password: [
      value => !!value || 'Debes especificar la nueva contraseña deseada.',
      value => (value || '').length >= 8 || 'La clave debe tener al menos 8 caracteres.',
      (value) => {
        const pattern = /^[A-Za-z0-9]+$/
        return pattern.test(value) || 'La contraseña no puede contener caracteres especiales.'
      }
    ],
    hideHint: true
  }),
  computed: {
    neighborhoods () {
      return this.$store.state.neighborhoods
    },
    clienttype () {
      return this.$store.state.clienttypes.find(ct => ct.name === this.$route.query.clienttype)
    },
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    },
    tickettypes () {
      return this.$store.state.ticket.tickettypes
    }
  },
  methods: {
    isEmpty (obj) {
      return Object.keys(obj).length === 0
    },
    cxGenAddress () {
      this.cx.finalAddress = `${this.cx.dir1} ${this.cx.dir2} ${this.cx.dir3} ${this.cx.dir4} | ${this.cx.neighborhood.name}`
    },
    initComponent () {
      this.modal = true
      this.ticketPayload.client = this.client.id
      this.ticketPayload.city = this.client.city.id
      this.ticketPayload.assignated = this.assignated
    },
    async createTicket () {
      this.loading = true
      if (this.phoneUpdate) {
        const phone = this.phoneUpdate
        const res = await this.$store.dispatch('client/updateClientPhone', {
          token: this.$store.state.auth.token,
          client: this.client,
          phone
        })
        if (res.status === 200) {
          this.$toast.info('El celular del cliente ha sido actualizado', { duration: 5000 })
          this.$store.dispatch('client/getUsersFromDatabaseBySearch', { search: this.$route.params.search, city: this.$route.query.city, clienttype: this.$route.query.clienttype, token: this.$store.state.auth.token, pagination: { page: 1, pageSize: 500 } })
        } else {
          this.$toast.error('Ha ocurrido un error al actualizar el celular del cliente')
        }
      }
      if (this.ticketPayload.type.name === 'TRASLADO') {
        this.ticketPayload.details = `DX: ${this.client.address} ${this.client.neighborhood.name} \n CX: ${this.cx.finalAddress}`
      }
      if (this.isEmpty(this.ticketPayload.type)) {
        this.alertBox = true
        this.alertBoxColor = 'red darken-4'
        this.createdMessage = 'Selecciona un tipo de ticket antes de continuar'
        this.loading = false
        this.errors.type = true
        return
      }
      if (this.ticketPayload.details === '') {
        this.alertBox = true
        this.alertBoxColor = 'red darken-4'
        this.createdMessage = 'Por favor especifica los detalles del ticket antes de continuar'
        this.loading = false
        this.errors.details = true
        return
      }
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: {
            active: true,
            client: this.ticketPayload.client,
            city: this.ticketPayload.city,
            tickettype: this.ticketPayload.type.id,
            clienttype: this.clienttype.id,
            assignated: this.ticketPayload.assignated,
            details: this.ticketPayload.details
          }
        })
      }).then((input) => {
        if (input.status === 200) {
          if (this.ticketPayload.type.name === 'TRASLADO') {
            this.$store.dispatch('address/addAddress', {
              client: this.client,
              address: `${this.cx.dir1} ${this.cx.dir2} ${this.cx.dir3} ${this.cx.dir4}`,
              neighborhood: this.cx.neighborhood,
              token: this.$store.state.auth.token
            })
          }
          this.modal = false
          this.loading = false
          this.$simpleTelegramCreateTicket({ client: this.client, tickettype: this.ticketPayload.type.name, details: this.ticketPayload.details, neighborhood: this.client.neighborhood, operator: this.$store.state.auth.username, telegramBots: this.telegramBots })
        } else {
          this.alertBox = true
          this.alertBoxColor = 'red darken-4'
          this.createdMessage = 'Error al crear el ticket'
          this.loading = false
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
    },
    can (component) {
      // eslint-disable-next-line camelcase
      const allowed_components = this.role
      // eslint-disable-next-line camelcase
      const current_component = component
      return allowed_components.includes(current_component)
    }
  }
}
</script>

<style>
.ticketCard {
  color: rgba(255,255,255,0.65);
  background-color: #24292e;
  background-image: url('/star-bg.svg'),linear-gradient(#191c20, #1e1e1e 50%);
  background-repeat: no-repeat;
  background-position: center 0, 0 0, 0 0;
  background-size: cover;
}
</style>
