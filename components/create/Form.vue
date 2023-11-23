<template>
  <v-card class="rounded-xl">
    <v-card-title>
      <v-icon class="mr-2">
        mdi-account
      </v-icon>
      Crear Cliente
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
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              :value="Client.name ? Client.name.toUpperCase() : ''"
              label="Nombre Completo"
              required
              outlined
              dense
              hide-details
              @input="Client.name = $event.toUpperCase()"
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
        <v-btn
          class="mr-4 mt-4"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          @click="createClient"
        >
          Crear Cliente
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
        name: '',
        dni: '',
        phone: '',
        email: null
      },
      alertBox: false,
      alertBoxColor: '',
      createdMessage: '',
      isSubmitting: false,
      email: [
        v => !!v || 'El correo es requerido',
        v => /\S+@\S+\.\S+/.test(v) || 'El correo no es valido'
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
  mounted () {
    this.Client.phone = this.clientnumber
  },
  methods: {
    duplicateDni (dni) {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          dni: {
            $eq: dni
          }
        }
      },
      {
        encodeValuesOnly: true
      })
      return new Promise((resolve, reject) => {
        fetch(`${this.$config.API_STRAPI_ENDPOINT}normalized-clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: client }) => {
            if (client.length > 0) {
              resolve(true)
            } else {
              resolve(false)
            }
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
          })
      })
    },
    async createClient () {
      this.isSubmitting = true
      if (await this.duplicateDni(this.Client.dni)) {
        this.$toast.error('Ya existe un cliente con esta cedula.', { duration: 5000 })
        this.isSubmitting = false
        return
      }
      if (
        this.Client.name === '' || this.Client.dni === '' || this.Client.phone === '' || this.Client.email === null
      ) {
        this.$toast.error('Por favor, complete todos los campos.')
        this.isSubmitting = false
        return
      }
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}normalized-clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: { ...this.Client }
        })
      })
        .then(res => res.json())
        .then(({ data: client }) => {
          this.isSubmitting = false
          this.$router.push({ path: `/client/${client.id}` })
          this.$store.commit('create/sete1', 1)
        }).catch((error) => {
          this.$toast.error(`Ha ocurrido un error ${error}`, { duration: 5000 })
          this.isSubmitting = false
        })
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
