<template>
  <v-card class="rounded-xl">
    <v-card-title>
      <v-icon class="mr-2">
        mdi-account
      </v-icon>
      Crear Cliente de {{ clienttype.name }} en {{ currentCity.name }}
    </v-card-title>
    <v-divider class="mb-5" />
    <v-card-text>
      <v-alert
        v-if="alertBox"
        type="info"
        :class="alertBoxColor"
        tile
        dismissible
      >
        {{ createdMessage }}
      </v-alert>
      <v-form v-model="valid">
        <v-row>
          <v-col>
            <v-text-field
              ref="code"
              v-model="Client.code"
              type="number"
              :label="codeSuccess ? 'Código correcto' : 'Código'"
              required
              outlined
              dense
              :error="codeError"
              :success="codeSuccess"
              :hint="d00pHint"
              :hide-details="hideD00pHint"
              :persistent-hint="!hideD00pHint"
              @change="testCodeForDuplicated(Client.code)"
              @keyup="codeSuccess = false, codeError = false, hideD00pHint = true"
            />
          </v-col>
          <v-col>
            <v-text-field
              ref="dni"
              v-model="Client.dni"
              type="number"
              label="Cedula"
              :rules="valid_dni"
              autocomplete="off"
              required
              :valid="true"
              outlined
              dense
              :hide-details="$refs.dni ? $refs.dni.valid ? true : $refs.dni.isFocused ? $refs.dni.badInput ? false : true : $refs.dni.badInput ? false : true : false"
              @keyup="calculateSsid"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              :value="Client.name.toUpperCase()"
              label="Nombre Completo"
              required
              outlined
              dense
              hide-details
              @keyup="clienttype.name === 'INTERNET' ? calculateSsid() : null"
              @input="Client.name = $event.toUpperCase()"
            />
          </v-col>
        </v-row>
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
              placeholder="5, 10, etc..."
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
              placeholder="01 - 23"
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
              v-model="Client.neighborhood"
              item-text="name"
              item-value="id"
              return-object
              :items="neighborhoods"
              label="Barrio"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col>
            <v-select
              v-model="Client.city"
              item-text="name"
              item-value="id"
              :items="cities"
              label="Ciudad"
              disabled
              outlined
              dense
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="Client.phone"
              label="Telefono"
              required
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col v-if="clienttype.name === 'INTERNET'">
            <v-select
              v-model="Client.offer"
              item-text="name"
              item-value="id"
              :items="offers"
              label="Oferta"
              return-object
              outlined
              dense
              hide-details
            />
          </v-col>
        </v-row>
        <v-row v-if="clienttype.name === 'INTERNET'">
          <v-col>
            <v-text-field
              v-model="Client.wifi_ssid"
              label="Nombre de Red"
              required
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="Client.wifi_password"
              label="Clave de Red"
              required
              outlined
              dense
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              ref="email"
              v-model="Client.email"
              label="Correo Electronico"
              required
              :rules="email"
              outlined
              dense
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row v-if="clienttype.name === 'INTERNET'">
          <v-col>
            <v-select
              v-model="Client.newModel"
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
        </v-row>
        <v-row v-if="clienttype.name === 'INTERNET'">
          <v-col>
            <v-select
              v-model="Client.technology"
              :items="technologies"
              item-text="name"
              item-value="id"
              mandatory
              label="Tecnología"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col>
            <v-select
              v-model="Client.ipmodel"
              :items="ipmodelItems"
              item-text="name"
              item-value="id"
              mandatory
              label="Tipo de IP para cliente"
              outlined
              dense
              hide-details
            />
          </v-col>
        </v-row>
        <v-btn
          class="mr-4 mt-4"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          @click="createClient"
        >
          Crear Cliente de {{ clienttype.name }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CreateForm',
  data: () => {
    return {
      valid: false,
      offers: null,
      Client: {
        code: '',
        name: '',
        dni: '',
        address: '',
        neighborhood: null,
        city: '',
        phone: '',
        plan: null,
        offer: null,
        wifi_ssid: '',
        wifi_password: '',
        mac_address: '',
        technology: { id: 2, name: 'FTTH' },
        comment: '',
        email: null,
        electronicbill: true,
        newModel: 1,
        nap_onu_address: '',
        opticalPower: '',
        ipmodel: 0
      },
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
      alertBox: false,
      alertBoxColor: '',
      createdMessage: '',
      isSubmitting: false,
      email: [
        v => !!v || 'El correo es requerido',
        v => /\S+@\S+\.\S+/.test(v) || 'El correo no es valido'
      ],
      idwith: [
        { id: 0, name: 'Cedula' },
        { id: 1, name: 'Codigo' }
      ],
      ipmodelItems: [
        { id: 0, name: 'PPPoE' },
        { id: 1, name: 'IP ESTATICA' }
      ],
      valid_dni: [
        (value) => {
          const pattern = /^[A-Za-z0-9]+$/
          return pattern.test(value) || 'La Cédula/NIT no debe llevar guiónes.'
        }
      ],
      codeError: false,
      hideHint: true,
      hideD00pHint: true,
      d00pHint: '',
      codeSuccess: null
    }
  },
  computed: {
    cities () {
      return this.$store.state.cities
    },
    city () {
      return this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
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
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    },
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.name == this.$route.query.city) : ''
    },
    clienttype () {
      return this.$store.state.clienttypes.find(ct => ct.name === this.$route.query.clienttype)
    }
  },
  mounted () {
    if (this.$route.query.city) {
      const city = this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
      this.Client.city = city.id
    }
    this.getOffers()
  },
  methods: {
    async createDebtMovement (client) {
      await this.$store.dispatch('offer/setNewDebt', {
        token: this.$store.state.auth.token,
        city: this.city,
        isindebt: false,
        client,
        technician: this.$store.state.auth
      })
    },
    async createOfferMovement (client, offer) {
      await this.$store.dispatch('offer/setNewOffer', {
        token: this.$store.state.auth.token,
        client,
        offer,
        technician: this.$store.state.auth
      })
      await this.$store.dispatch('client/setAuxPlan', {
        token: this.$store.state.auth.token,
        clientId: client.id,
        plan: offer.plan,
        index: this.index
      })
    },
    async testCodeForDuplicated (code) {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          code: {
            $eq: code
          },
          city: {
            name: {
              $eq: this.$route.query.city
            }
          }
        }
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then((clients) => {
          if (clients.data.length > 0) {
            this.codeError = true
            this.d00pHint = 'Error. El codigo ya existe.'
            this.hideD00pHint = false
          } else {
            this.codeError = false
            this.d00pHint = ''
            this.hideD00pHint = true
            this.codeSuccess = true
          }
        })
    },
    async createClient () {
      if (this.Client.code === '' || this.Client.offer === null || this.Client.name === '' || this.Client.dni === '' || this.Client.neighborhood === null || this.Client.city === '' || this.Client.phone === '' || this.Client.email === null) {
        this.$toast.error('Por favor, complete todos los campos.')
        return
      }
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: { ...this.Client, active: true, neighborhood: this.Client.neighborhood.id, operator: this.$store.state.auth.id, clienttype: [this.clienttype.id] }
        })
      })
        .then(res => res.json())
        .then((client) => {
          this.$emit('createClientDialog', false)
          this.$emit('createClientSnack', true)
          this.createOfferMovement(client.data, this.Client.offer)
          this.createDebtMovement(client.data)
          this.$store.dispatch('client/createTicketForNewClient', {
            city: this.Client.city,
            client: client.data,
            neighborhood: this.Client.neighborhood,
            token: this.$store.state.auth.token
          })
          this.$store.dispatch('client/adminCreate', {
            client: {
              ...this.Client,
              id: client.data.id
            },
            city: this.city,
            token: this.$store.state.auth.token,
            operator: this.$store.state.auth.username
          })
          this.$simpleTelegramCreate({ client: this.Client, operator: this.$store.state.auth.username, telegramBots: this.telegramBots })
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    },
    genAddress () {
      this.Client.address = `${this.dir1} ${this.dir2} ${this.dir3} ${this.dir4}`
    },
    async getOffers () {
      this.offers = await this.$store.dispatch('offer/getOffers', {
        token: this.$store.state.auth.token
      })
    },
    calculateSsid () {
      const name = this.Client.name.split(' ')
      const length = name.length
      // eslint-disable-next-line no-var
      var lastNameLowerCase = ''
      switch (length) {
        case 1:
          break
        case 2:
          lastNameLowerCase = name[1].toLowerCase()
          break
        case 3:
          lastNameLowerCase = name[1].toLowerCase()
          break
        case 4:
          lastNameLowerCase = name[2].toLowerCase()
          break
        default:
          lastNameLowerCase = ''
          break
      }
      const nombreLowerCase = name[0].toLowerCase()
      const processedName = nombreLowerCase.charAt(0).toUpperCase() + nombreLowerCase.slice(1)
      this.Client.wifi_password = processedName + this.Client.code
      this.Client.wifi_ssid = `ARNOP${lastNameLowerCase.charAt(0).toUpperCase() + lastNameLowerCase.slice(1)}`
    }
  }
}
</script>

<style>

</style>
