<template>
  <v-container v-if="!done">
    <v-row>
      <v-col class="d-flex justify-center">
        <v-card width="900">
          <v-card-title class="justify-center">
            <div class="c" style="width:100%;display:grid;place-items:center;">
              <div style="width:300px;">
                <MainLogo />
              </div>
            </div>
            Solicitar cambio de clave Wi-Fi
          </v-card-title>
          <v-card-text>
            <span class="text-subtitle-1">
              El plazo para realizar el cambio de clave es de 1 a 2 dias habiles. Se recomienda no compartir la contraseña con nadie ajeno a la vivienda para evitar afectación en la experiencia de navegacion.
            </span>
          </v-card-text>
          <v-card-text>
            <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step
                  :complete="e1 > 1"
                  step="1"
                >
                  Usuario
                </v-stepper-step>

                <v-divider />

                <v-stepper-step
                  :complete="e1 > 2"
                  step="2"
                >
                  Validación
                </v-stepper-step>

                <v-divider />

                <v-stepper-step step="3">
                  Confirmación
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-text-field
                    v-model="dni"
                    outlined
                    :rules="valid_dni"
                    label="Numero de Cedula o NIT del titular"
                    class="mt-2"
                  />
                  <v-btn
                    color="primary"
                    @click="processDni"
                  >
                    Continuar
                  </v-btn>

                  <v-btn href="https://arnoproducciones.com">
                    Cancelar
                  </v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card v-if="foundClient.length > 0" class="my-3">
                    <v-card-title>
                      Lineas encontradas: ({{ foundClient.length }}) <span class="text-subtitle-1 ml-2 green darken-3 rounded-xl px-2">(Selecciona una linea para cambiar la clave)</span>
                    </v-card-title>
                    <v-card-text
                      v-for="client in foundClient"
                      :key="client.id"
                    >
                      <div class="parent">
                        <span>{{ client.name }}</span>
                        <span>{{ client.addresses ? client.addresses.langth > 0 ? client.addresses.at(-1).address + ' ' + client.addresses.at(-1).neighborhood.name : client.address : client.address}}</span>
                        <span class="rounded-xl px-2 text-h6 text-weigth-bold">{{ client.city.name }}</span>
                        <span>
                          <v-btn
                            v-if="!client.hasPendingPasswordChange"
                            color="primary"
                            class="rounded-xl elevation-0"
                            :disabled="client.hasPendingPasswordChange"
                            @click="processSelect(client)"
                          >
                            ¡Quiero cambiar esta!
                          </v-btn>
                          <span
                            v-else
                            class="text-center align-center justify-center red--text lighted-2"
                          >
                            Ya existe una peticion de cambio para esta linea. Debes esperar que se haga efectiva antes de pedir otra.
                          </span>
                        </span>
                      </div>
                    </v-card-text>
                  </v-card>
                  <v-btn text @click="backTo('1')">
                    Regresar y corregir
                  </v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-card v-if="e1 === '3'" class="my-4">
                    <v-card-title>
                      Se ha seleccionado la linea de {{ selected.city.name }} en la dirección {{ selected.addresses ? selected.addresses.length > 0 ? selected.addresses.at(-1).address + ' ' + selected.addresses.at(-1).neighborhood.name : selected.address : selected.address }}
                    </v-card-title>
                    <v-card-text>
                      <v-form v-model="valid" lazy-validation>
                        <v-text-field
                          v-model="new_password"
                          :rules="valid_new_password"
                          label="Ingresa la nueva clave que deseas"
                          :hide-details="hideHint"
                          outlined
                          @keyup="hideHint = false"
                        />
                      </v-form>
                    </v-card-text>
                  </v-card>

                  <v-btn
                    color="primary"
                    @click="openConfirm()"
                  >
                    Continuar
                  </v-btn>

                  <v-btn text @click="backTo('2')">
                    Regresar y corregir
                  </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="confirmation"
      width="500"
    >
      <v-card>
        <v-card-title>
          ¿Deseas continuar?
        </v-card-title>

        <v-card-text>
          Verifica que sea correcta la nueva contraseña que elegiste.
          <p class="mt-4">
            <strong style="font-size:2rem;color:green;">{{ new_password }}</strong>
          </p>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="primary"
            @click.once="sendRequest()"
          >
            Confirmar y Enviar
          </v-btn>
          <v-btn
            color="grey"
            text
            @click="confirmation = false"
          >
            Volver y Corregir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <div v-else>
    <v-row
      justify="center"
    >
      <v-col
        lg="6"
        md="6"
        sm="12"
        xs="12"
      >
        <v-card>
          <v-card-title>ARNOProducciones</v-card-title>
          <v-card-text>
            <v-alert
              border="left"
              colored-border
              type="success"
              elevation="2"
            >
              Petición enviada con éxito.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="success"
              text
              href="https://arnoproducciones.com"
            >
              Terminar y Volver
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'NewPasswordChanger',
  layout: 'outuser',
  data () {
    return {
      e1: '1',
      dni: null,
      done: false,
      selected: null,
      confirmation: false,
      new_password: null,
      valid: false,
      valid_dni: [
        value => !!value || 'Este campo no puede estar vacío'
      ],
      valid_new_password: [
        value => !!value || 'Debes especificar la nueva contraseña deseada.',
        value => (value || '').length >= 8 || 'La clave debe tener al menos 8 caracteres.',
        (value) => {
          const pattern = /^[A-Za-z0-9]+$/
          return pattern.test(value) || 'La contraseña no puede contener caracteres especiales.'
        }
      ],
      hideHint: true,
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Direccion', value: 'address' }
      ]
    }
  },
  computed: {
    foundClient () {
      return this.$store.state.password.foundClient
    }
  },
  methods: {
    sendRequest () {
      if (this.valid) {
        this.$store.dispatch('password/createTicketForPasswordChange', {
          selected: this.selected,
          new_password: this.new_password
        }).then((res) => {
          if (res.status === 200) {
            this.done = true
          }
        })
      }
    },
    openConfirm () {
      if (this.valid) {
        this.confirmation = true
      }
    },
    backTo (e1) {
      this.e1 = e1
      this.selected = null
    },
    processSelect (client) {
      this.selected = client
      this.e1 = '3'
    },
    processDni () {
      if (this.dni === null || this.dni === '') {
        this.$toast.error('Debe especificar la cedula o Nit para continuar.', { duration: 5000, position: 'top-center' })
      }
      this.$store.dispatch('password/searchClientByDni', {
        dni: this.dni
      }).then((res) => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            res[i].tickets.map((ticket) => {
              if (ticket.tickettype?.name === 'CAMBIO DE CONTRASEÑA' && ticket.active) {
                res[i].hasPendingPasswordChange = true
                return ticket
              } else {
                res[i].hasPendingPasswordChange = false
                return ticket
              }
            })
            this.e1 = 2
          }
        } else {
          this.$toast.error('No se ha encontrado ningun usuario con esta informacion. Comunicate al 310 343 25 99 en Mariquita y al 350 810 59 49 en Fresno', { position: 'top-center' })
        }
      })
    }
  },
  head () {
    return {
      title: 'Solicita cambio de tu clave WiFi'
    }
  }
}
</script>
<style scoped>
  .parent {
    padding:10px;
    background-color: rgb(37, 37, 37);
    display: grid;
    place-items:center;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 10px;
  }
  @media only screen and (max-width: 963px) {
    .parent {
      display: flex;
      flex-direction: column;
      background-color: rgb(37, 37, 37);
      padding:10px;
    }
  }
</style>
