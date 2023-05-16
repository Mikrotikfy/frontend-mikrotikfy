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
              v-model="Client.code"
              label="Codigo"
              hide-details="auto"
              required
              outlined
              dense
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
          <v-col>
            <v-select
              v-model="Client.corporate"
              :items="[{ id: 1, name: 'CEDULA', value: false }, { id: 2, name: 'NIT', value: true }]"
              autocomplete="off"
              hide-details="auto"
              required
              item-text="name"
              item-value="value"
              label="Tipo de Documento"
              outlined
              dense
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
          <v-col>
            <v-text-field
              v-model="Client.stratum"
              label="Estrato"
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
  props: {
    clientnumber: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
      valid: false,
      offers: null,
      Client: {
        code: '',
        name: '',
        dni: '',
        corporate: null,
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
        ipmodel: 0,
        stratum: 0
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
    },
    currentClientCode () {
      return this.$store.state.client.currentClientCode
    }
  },
  async mounted () {
    if (this.$route.query.city) {
      const city = this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
      this.Client.city = city.id
    }
    this.Client.phone = this.clientnumber
    this.getOffers()
    await this.getCode()
  },
  methods: {
    async getCode () {
      await this.$store.dispatch('client/getCode', {
        token: this.$store.state.auth.token,
        clienttype: this.$route.query.clienttype,
        city: this.$route.query.city
      })
      if (this.currentClientCode) {
        this.Client.code = (parseInt(this.currentClientCode) + 1).toString()
      } else {
        this.Client.code = '1'
      }
    },
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
    createAddress (client) {
      this.$store.dispatch('client/createAddress', {
        token: this.$store.state.auth.token,
        client,
        address: `${this.dir1} ${this.dir2} ${this.dir3} ${this.dir4}`,
        neighborhood: this.Client.neighborhood
      })
    },
    async createClient () {
      if (
        (
          this.$route.query.clienttype === 'INTERNET' &&
          (
            this.Client.code === '' || this.Client.offer === null || this.Client.name === '' || this.Client.dni === '' || this.Client.corporate === null || this.Client.neighborhood === null || this.Client.city === '' || this.Client.phone === '' || this.Client.email === null
          )
        ) ||
        (
          this.$route.query.clienttype === 'TELEVISION' &&
          (
            this.Client.code === '' || this.Client.name === '' || this.Client.dni === '' || this.Client.corporate === null || this.Client.neighborhood === null || this.Client.city === '' || this.Client.phone === '' || this.Client.email === null
          )
        )
      ) {
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
          if (this.$route.query.clienttype === 'INTERNET') {
            this.createOfferMovement(client.data, this.Client.offer)
          }
          this.createDebtMovement(client.data)
          this.createAddress(client.data)
          this.$store.dispatch('client/createTicketForNewClient', {
            clienttype: this.$store.state.auth.clienttypes.find(ct => ct.name === this.$route.query.clienttype),
            city: this.Client.city,
            client: client.data,
            neighborhood: this.Client.neighborhood,
            token: this.$store.state.auth.token
          })
          if (this.$route.query.clienttype === 'INTERNET') {
            this.$store.dispatch('client/adminCreate', {
              client: {
                ...this.Client,
                id: client.data.id
              },
              city: this.city,
              token: this.$store.state.auth.token,
              operator: this.$store.state.auth.username
            })
          }
          this.$simpleTelegramCreate({ client: this.Client, operator: this.$store.state.auth.username, telegramBots: this.telegramBots })
          this.$router.push({ path: `/clients/${this.Client.code}`, query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype } })
          this.$store.commit('create/sete1', 1)
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
