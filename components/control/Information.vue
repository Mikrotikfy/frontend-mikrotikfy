<template>
  <v-card v-if="init" class="rounded-xl">
    <v-card-text>
      <v-form ref="editForm" v-model="valid" @focus="resetSaveStatus">
        <v-row>
          <v-col>
            <v-text-field
              v-model="currentEditClient.code"
              type="number"
              label="Codigo"
              autocomplete="off"
              required
              outlined
              dense
              hide-details
              :disabled="!$isAdmin() || loading"
              @blur="updateClient"
              @keyup.enter="$event.target.blur()"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="currentEditClient.dni"
              type="number"
              label="Cedula"
              autocomplete="off"
              required
              outlined
              dense
              hide-details
              :disabled="!$isAdmin() || loading"
              @blur="updateClient"
              @keyup.enter="$event.target.blur()"
            />
          </v-col>
        </v-row>
        <v-text-field
          :value="currentEditClient.name ? currentEditClient.name.toUpperCase() : ''"
          :disabled="!(!$isAdmin() || !$isBiller()) || loading"
          label="Nombre Completo"
          autocomplete="off"
          required
          outlined
          dense
          hide-details
          class="pb-3 mt-3"
          @input="currentEditClient.name = $event.toUpperCase()"
          @blur="updateClient"
          @keyup.enter="$event.target.blur()"
        />
        <v-row>
          <v-col cols="6" lg="6" md="6">
            <v-text-field
              :value="currentEditClient.addresses ? currentEditClient.addresses.at(-1).address : currentEditClient.address"
              disabled
              label="Direccion"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col cols="6" lg="6" md="6" class="d-flex">
            <v-text-field
              :value="currentEditClient.addresses ? currentEditClient.addresses.at(-1).neighborhood.name : currentEditClient.neighborhood.name"
              disabled
              class="mr-3"
              label="Barrio"
              outlined
              dense
              hide-details
            />
            <CreateAddress :client="currentEditClient" @updateClient="emitupdateClient" />
            <MiscAddresses v-if="currentEditClient.addresses" :client="currentEditClient" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="4" md="4">
            <v-text-field
              v-model="currentEditClient.phone"
              label="Telefono"
              required
              outlined
              dense
              hide-details
              :disabled="!(!$isAdmin() || !$isBiller()) || loading"
              @blur="updateClient"
              @keyup.enter="$event.target.blur()"
            />
          </v-col>
          <v-col cols="6" lg="4" md="4">
            <v-text-field
              v-model="currentEditClient.wifi_ssid"
              :disabled="!$isAdmin() || loading"
              label="Nombre de Red"
              autocomplete="off"
              required
              outlined
              dense
              hide-details
              @blur="updateClient"
              @keyup.enter="$event.target.blur()"
            />
          </v-col>
          <v-col cols="6" lg="4" md="4">
            <v-text-field
              v-model="currentEditClient.wifi_password"
              :disabled="!$isAdmin() || loading"
              label="Clave de Red"
              autocomplete="off"
              required
              outlined
              dense
              hide-details
              @blur="updateClient"
              @keyup.enter="$event.target.blur()"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6">
            <v-select
              v-if="clienttype.name === 'INTERNET'"
              v-model="currentEditClient.technology"
              :disabled="!(!$isAdmin() || !$isBiller() || !$isTechnician()) || loading"
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
              @change="updateClient"
            />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6">
            <v-text-field
              v-if="clienttype.name === 'INTERNET'"
              v-model="currentEditClient.email"
              :disabled="!(!$isAdmin() || !$isBiller()) || loading"
              :rules="email"
              label="Correo Electronico"
              autocomplete="off"
              outlined
              dense
              hide-details="auto"
              @blur="updateClient"
              @keyup.enter="$event.target.blur()"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              v-if="clienttype.name === 'INTERNET'"
              v-model="currentEditClient.newModel"
              :disabled="!$isAdmin() || loading"
              :items="idwith"
              item-text="name"
              item-value="id"
              mandatory
              label="Identificar con"
              outlined
              dense
              hide-details
              @change="updateClient"
            />
          </v-col>
          <v-col>
            <v-select
              v-if="clienttype.name === 'INTERNET'"
              v-model="currentEditClient.ipmodel"
              :disabled="!$isAdmin() || loading"
              :items="ipmodelItems"
              item-text="name"
              item-value="id"
              mandatory
              label="Tipo de IP para cliente"
              outlined
              dense
              hide-details
              @change="updateClient"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-text class="d-flex align-center mt-5">
      <caption ref="saveStatusText" class="font-italic">{{ saveStatus }}</caption>
      <v-spacer />
      <div style="display: inline-grid;place-items: end;">
        <caption>Fecha de creacion: {{ getDate(currentEditClient.createdAt) }}</caption>
        <caption>Fecha de ultima modificacion: {{ getDate(currentEditClient.updatedAt) }}</caption>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    client: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      saveStatus: 'No hay cambios pendientes...',
      currentEditClient: {},
      changes: 0,
      init: false,
      valid: false,
      loading: false,
      success: false,
      error: false,
      idwith: [
        { id: 0, name: 'Cedula' },
        { id: 1, name: 'Codigo' }
      ],
      ipmodelItems: [
        { id: 0, name: 'PPPoE' },
        { id: 1, name: 'IP ESTATICA' }
      ],
      email: [
        v => !!v || 'El correo es requerido',
        v => /\S+@\S+\.\S+/.test(v) || 'El correo no es valido'
      ]
    }
  },
  computed: {
    cities () {
      return this.$store.state.cities
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
  mounted () {
    Object.assign(this.currentEditClient, this.client)
    this.init = true
  },
  methods: {
    testChanges () {
      const client = this.currentEditClient
      const oldClient = this.client
      const changes = Object.keys(client).filter(key => client[key] !== oldClient[key])
      return changes.length
    },
    resetSaveStatus () {
      this.saveStatus = 'No hay cambios pendientes...'
    },
    async updateClient () {
      this.$refs.saveStatusText.classList.remove('success--text')
      this.saveStatus = 'No hay cambios pendientes...'
      this.$refs.saveStatusText.classList.add('cyan--text')
      if (this.testChanges() === 0) { return }
      this.loading = true
      const operator = this.$store.state.auth.id
      const client = this.currentEditClient

      this.saveStatus = 'Guardando...'

      await this.$store.dispatch('client/updateClient', { client, index: this.index, operator, token: this.$store.state.auth.token })
      this.$store.dispatch('client/updateClientCommentOnMikrotik', { client, token: this.$store.state.auth.token })
      this.$simpleTelegramUpdate({ client, operator: this.$store.state.auth.username, telegramBots: this.telegramBots })

      this.$refs.saveStatusText.classList.remove('cyan--text')
      this.$refs.saveStatusText.classList.add('success--text')
      this.$refs.saveStatusText.classList.add('font-weight-bold')
      this.saveStatus = 'Guardado'
      setTimeout(() => {
        this.$refs.saveStatusText.classList.remove('success--text')
        this.$refs.saveStatusText.classList.remove('font-weight-bold')
        this.resetSaveStatus()
      }, 5000)
      this.loading = false
    },
    emitupdateClient () {
      this.$emit('updateSuccess')
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
      return humanDateFormat
    }
  }
}
</script>
