<template>
  <v-container fluid>
    <v-card v-if="$route.query.client" class="rounded-xl">
      <v-card-title>
        <v-icon class="mr-2">
          mdi-account
        </v-icon>
        Crear Servicio para {{ $route.query.name }}
      </v-card-title>
      <v-divider class="mb-5" />
      <v-card-text class="d-flex">
        <v-select
          v-model="selectedCity"
          :items="cities"
          item-text="name"
          item-value="id"
          label="Ciudad"
          class="mr-4"
          return-object
          outlined
          dense
          hide-details="auto"
          @change="getOffers"
        />
        <v-select
          v-model="selectedClienttype"
          :items="clienttypes"
          item-text="name"
          item-value="id"
          label="Tipo de Cliente"
          return-object
          outlined
          dense
          hide-details="auto"
          @change="getOffers"
        />
      </v-card-text>
      <v-card-text v-if="selectedCity && selectedClienttype">
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
                @keyup="selectedClienttype.name === 'INTERNET' ? calculateSsid() : null"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="Client.name"
                label="Nombre Completo"
                required
                outlined
                dense
                disabled
                hide-details
              />
            </v-col>
          </v-row>
          <div class="my-5 parent">
            <v-select
              v-model="dir1"
              :items="dirFragment1"
              label="Dirección"
              autocomplete="off"
              outlined
              dense
              hide-details
              @blur="genAddress"
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
              @blur="genAddress"
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
              @blur="genAddress"
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
              @blur="genAddress"
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
              @blur="genAddress"
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
              @blur="genAddress"
            />
            <v-autocomplete
              v-model="dir7"
              label="#"
              placeholder="5, 10, etc..."
              autocomplete="off"
              :items="numbersPad"
              outlined
              dense
              hide-details
              @blur="genAddress"
            />
            <v-text-field
              v-model="dir8"
              label="Opcional"
              placeholder="APTO 101, MANZANA 5, etc..."
              autocomplete="off"
              outlined
              dense
              hide-details
              @blur="genAddress"
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
          </v-row>
          <v-row>
            <v-col>
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
          <v-row v-if="selectedClienttype.name === 'INTERNET'">
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
                v-model="Client.stratum"
                label="Estrato"
                outlined
                dense
                hide-details="auto"
              />
            </v-col>
          </v-row>
          <v-row v-if="selectedClienttype.name === 'INTERNET'">
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
          <v-row v-if="selectedClienttype.name === 'INTERNET'">
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
            Crear Servicio
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <h2 v-else>
      Formulario invalido. Por favor inicie de nuevo el proceso de creacion del servicio
    </h2>
  </v-container>
</template>

<script>
export default {
  name: 'CreateForm',
  props: {
    clientnumber: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      selectedCity: null,
      selectedClienttype: null,
      valid: false,
      offers: null,
      Client: {
        code: '',
        name: '',
        address: '',
        neighborhood: null,
        clienttype: null,
        plan: null,
        offer: null,
        wifi_ssid: '',
        wifi_password: '',
        technology: { id: 2, name: 'FTTH' },
        newModel: 1,
        ipmodel: 0,
        stratum: 0
      },
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
      codeError: false,
      hideHint: true,
      hideD00pHint: true,
      d00pHint: '',
      codeSuccess: null
    }
  },
  computed: {
    cities () {
      return this.$store.state.auth.cities
    },
    address () {
      return `${this.dir1} ${this.dir2}${this.dir3} ${this.dir4} ${this.dir5}${this.dir6} ${this.dir7 !== '' ? '-' : ''} ${this.dir7} ${this.dir8}`
    },
    numbers () {
      return Array.from({ length: 1200 }, (_, i) => i + 1)
    },
    numbersPad () {
      return Array.from({ length: 1200 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    },
    neighborhoods () {
      return this.$store.state.neighborhoods
    },
    technologies () {
      return this.$store.state.technology.technologies
    },
    clienttypes () {
      return this.$store.state.auth.clienttypes
    },
    currentClientCode () {
      return this.$store.state.client.currentClientCode
    },
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.selectedCity.name)
    }
  },
  mounted () {
    this.$store.dispatch('telegram/getTelegramBotsFromDatabase', { token: this.$store.state.auth.token })
    this.$store.dispatch('neighborhood/getNeighborhoodsFromDatabase')
    this.$store.dispatch('technology/getTechnologiesFromDatabase')
    this.Client.phone = this.clientnumber
    this.Client.name = this.$route.query.name
  },
  methods: {
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
    async createDebtMovement (service) {
      await this.$store.dispatch('offer/setNewDebt', {
        token: this.$store.state.auth.token,
        city: this.selectedCity,
        isindebt: false,
        service,
        technician: this.$store.state.auth
      })
    },
    async createOfferMovement (service, offer) {
      await this.$store.dispatch('offer/setNewOffer', {
        token: this.$store.state.auth.token,
        service,
        offer,
        technician: this.$store.state.auth
      })
      await this.$store.dispatch('client/setAuxPlan', {
        token: this.$store.state.auth.token,
        serviceId: service.id,
        plan: offer.plan,
        index: this.index
      })
    },
    createAddress (service) {
      this.$store.dispatch('client/createAddress', {
        token: this.$store.state.auth.token,
        service,
        address: this.address,
        neighborhood: this.Client.neighborhood
      })
      this.$store.dispatch('address/updateAddress', {
        service,
        address: this.address,
        neighborhood: this.Client.neighborhood,
        token: this.$store.state.auth.token
      })
    },
    async createClient () {
      if (
        (
          this.selectedClienttype.name === 'INTERNET' &&
          (
            this.Client.code === '' || this.Client.offer === null || this.Client.name === '' || this.Client.neighborhood === null
          )
        ) ||
        (
          this.selectedClienttype.name === 'TELEVISION' &&
          (
            this.Client.code === '' || this.Client.name === '' || this.Client.neighborhood === null
          )
        )
      ) {
        this.$toast.error('Por favor, complete todos los campos.')
        return
      }
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: {
            name: this.selectedClienttype.name,
            code: this.Client.code,
            clienttype: this.selectedClienttype.id,
            offer: this.Client.offer.id,
            technology: this.Client.technology.id || null,
            city: this.selectedCity.id,
            stratum: this.Client.stratum,
            wifi_ssid: this.Client.wifi_ssid,
            wifi_password: this.Client.wifi_password,
            newModel: 1,
            ipmodel: 0,
            active: true,
            indebt: false,
            normalized_client: parseInt(this.$route.query.client),
            client_name: this.$route.query.name,
            dni: this.$route.query.dni,
            phone: this.$route.query.phone
          }
        })
      })
        .then(res => res.json())
        .then(({ data: service }) => {
          if (this.selectedClienttype.name === 'INTERNET') {
            this.createOfferMovement(service, this.Client.offer)
          }
          this.createDebtMovement(service)
          this.createAddress(service)
          this.$store.dispatch('client/createTicketForNewClient', {
            clienttype: this.selectedClienttype,
            city: this.selectedCity,
            service,
            address: this.address,
            neighborhood: this.Client.neighborhood,
            token: this.$store.state.auth.token
          })
          if (this.selectedClienttype.name === 'INTERNET') {
            this.$store.dispatch('client/adminCreate', {
              client: {
                ...this.Client,
                id: service.id
              },
              city: this.selectedCity,
              token: this.$store.state.auth.token,
              operator: this.$store.state.auth.username
            })
          }
          this.$simpleTelegramCreate({ client: this.Client, address: this.address, neighborhood: this.Client.neighborhood, operator: this.$store.state.auth.username, telegramBots: this.telegramBots })
          this.$router.push({ path: `/client?search=${this.$route.query.client}&city=${this.selectedCity.name}&clienttype=${this.selectedClienttype.name}` })
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    },
    genAddress () {
      this.Client.address = this.address
    },
    async getOffers () {
      if (this.selectedCity && this.selectedClienttype) {
        this.offers = await this.$store.dispatch('offer/getOffers', {
          token: this.$store.state.auth.token,
          city: this.selectedCity.name,
          clienttype: this.selectedClienttype.name
        })
      }
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

<style scoped>
.parent {
  display:grid;
  grid-template-columns: 2fr 1fr 2fr 1fr 1fr 2fr 1fr 2fr;
  column-gap: 10px;
}
</style>
