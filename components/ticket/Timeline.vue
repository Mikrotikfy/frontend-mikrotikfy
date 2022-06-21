<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'green darken-3'"
          :class="block ? 'mb-2 rounded-xl elevation-0' : ''"
          v-on="on"
          @click="initComponent"
        >
          <v-icon class="mr-2">mdi-timeline-clock-outline</v-icon>
          <span v-if="block">
            Linea de Tiempo
          </span>
        </v-btn>
      </template>
      <span>Linea de Tiempo</span>
    </v-tooltip>
    <v-dialog
      v-model="dialog"
      :fullscreen="block"
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar>
          Linea de tiempo
          <v-spacer />
          <v-btn
            icon
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-stepper
          v-model="e6"
          vertical
          flat
          tile
          style="background:transparent;"
        >
          <v-stepper-step
            :complete="e6 > 1"
            step="1"
            editable
          >
            Llegada al Domicilio
            <v-icon>mdi-briefcase-clock-outline</v-icon>
          </v-stepper-step>

          <v-stepper-content step="1">
            <span>
              Inicio del Servicio: <v-chip small>{{ getDate(new Date()) }}</v-chip>
            </span>
            <v-btn
              class="mt-5 rounded-xl elevation-0"
              block
              color="green darken-3"
              @click="newTimeline"
            >
              Iniciar Servicio
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :complete="e6 > 2"
            step="2"
            editable
          >
            Diagnostico
            <v-icon>mdi-wrench</v-icon>
            <small
              v-if="initDiagnostic"
              class="green--text"
            >Diagnostico iniciado</small>
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-select
              v-model="timeline.diagnostic"
              :items="diagnosticItems"
              label="Posible razon"
              filled
              item-text="name"
              item-value="id"
            />
            <v-textarea
              v-model="timeline.diagnosticdetails"
              label="Detalles adicionales (Opcional)"
              filled
            />
            <v-btn
              class="mt-5 rounded-xl elevation-0"
              block
              color="green darken-4"
              @click="updateDiagnostic"
            >
              Enviar Avance
            </v-btn>
            <v-btn
              class="mt-5 rounded-xl elevation-0"
              block
              color="yellow darken-4"
              @click="endDiagnostic"
            >
              Finalizar Diagnóstico
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :complete="e6 > 3"
            step="3"
            editable
          >
            Solución
            <v-icon>mdi-flag-outline</v-icon>
            <small
              v-if="initSolution"
              class="green--text"
            >Solucion iniciada</small>
          </v-stepper-step>

          <v-stepper-content step="3">
            <v-select
              v-model="timeline.solution"
              :items="solutionItems"
              label="Solucion para el cliente"
              filled
              item-text="name"
              item-value="id"
            />
            <v-textarea
              v-model="timeline.solutiondetails"
              label="Detalles adicionales (Opcional)"
              filled
            />
            <v-btn
              class="mt-5 rounded-xl elevation-0"
              block
              color="green darken-4"
              @click="updateSolution"
            >
              Enviar Avance
            </v-btn>
            <v-btn
              class="mt-5 rounded-xl elevation-0"
              block
              color="red darken-4"
              @click="endService"
            >
              Finalizar Servicio
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :complete="e6 > 4"
            step="3"
            editable
          >
            Finalizado
            <v-icon>mdi-flag-checkered</v-icon>
            <small
              v-if="initSolution"
              class="green--text"
            >Servicio terminado</small>
          </v-stepper-step>

          <v-stepper-content step="4">
            <span>
              Servicio finalizado el: <v-chip small>{{ timeline.end }}</v-chip>
            </span>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-dialog>
  </span>
</template>
<script>
export default {
  props: {
    clientid: {
      type: Number,
      default: -1
    },
    ticketid: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    },
    role: {
      type: Array,
      default: () => {}
    },
    block: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      clientContextId: null,
      e6: 1,
      timeline: {
        diagnostic: null,
        diagnosticdetails: '',
        solution: null,
        solutiondetails: '',
        start: null,
        end: null,
        technician: null
      },
      dialog: false,
      initDiagnostic: false,
      initSolution: false,
      solutionItems: [
        {
          id: 1,
          name: 'REINICIO DE EQUIPO'
        },
        {
          id: 2,
          name: 'CAMBIO DE CONECTOR'
        },
        {
          id: 3,
          name: 'CAMBIO DE ACOMETIDA'
        },
        {
          id: 4,
          name: 'CAMBIO DE EQUIPO'
        },
        {
          id: 5,
          name: 'CAMBIO DE CONFIGURACION'
        },
        {
          id: 6,
          name: 'CONFIGURACION DE DISPOSITIVOS'
        }
      ],
      diagnosticItems: [
        {
          id: 1,
          name: 'EQUIPO BLOQUEADO'
        },
        {
          id: 2,
          name: 'EQUIPO APAGADO'
        },
        {
          id: 3,
          name: 'CONECTORES DESCONECTADOS'
        },
        {
          id: 4,
          name: 'EQUIPO QUEMADO'
        },
        {
          id: 5,
          name: 'CONECTOR OPTICO PARTIDO'
        },
        {
          id: 6,
          name: 'FIBRA DAÑADA'
        }
      ]
    }
  },
  methods: {
    initComponent () {
      this.dialog = true
      if (localStorage.getItem(this.clientid)) {
        this.getStorageContext()
      } else {
        this.resetLocalContext()
      }
    },
    newTimeline () {
      this.timeline.start = new Date().toISOString()
      this.$store.dispatch('timeline/newTimeline', {
        clientid: this.clientid,
        ticketid: this.ticketid,
        city: this.$route.query.city,
        technician: this.$store.state.auth,
        start: this.timeline.start
      })
      this.initDiagnostic = true
      this.e6 = 2
      this.setStorageContext()
    },
    updateDiagnostic () {
      if (this.ticketdiagnostic === null) {
        this.$toast.error('Selecciona un diagnostico antes de continuar.', { duration: 4000, position: 'top-center' })
        return
      }
      this.setStorageContext()
      this.$toast.success('Avance enviado correctamente', { duration: 4000, position: 'top-center' })
      this.ticketdiagnostic = null
      this.diagnosticDescription = ''
    },
    endDiagnostic () {
      if (this.ticketdiagnostic === null) {
        this.$toast.error('Selecciona un diagnostico antes de continuar.', { duration: 4000, position: 'top-center' })
        return
      }
      this.e6 = 3
      this.initDiagnostic = false
      this.initSolution = true
      this.setStorageContext()
      this.updateDiagnostic()
      this.$toast.success('Diagnostico finalizado correctamente', { duration: 4000, position: 'top-center' })
    },
    updateSolution () {
      this.setStorageContext()
      this.$toast.success('Avance de solucion enviado correctamente', { duration: 4000, position: 'top-center' })
    },
    endService () {
      const end = new Date().toISOString()
      this.timeline.end = end
      this.initSolution = false
      this.e6 = 4
      this.$toast.success('Servicio Finalizado Correctamente', { duration: 4000, position: 'top-center' })
      this.$emit('endService')
      localStorage.removeItem(this.clientid)
      this.dialog = false
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    getStorageContext () {
      const context = JSON.parse(localStorage.getItem(this.clientid))
      if (context) {
        this.clientContextId = context.id
        this.e6 = context.e6
        this.ticketdiagnostic = context.ticketdiagnostic
        this.diagnosticDescription = context.diagnosticDescription
        this.ticketsolution = context.ticketsolution
        this.solutionDescription = context.solutionDescription
        this.initDiagnostic = context.initDiagnostic
        this.initSolution = context.initSolution
        this.start = context.start
        this.end = context.end
        this.technician = context.technician
      } else {
        this.$toast.error('No hay contexto para el servicio. Reporta esto a Nico', { position: 'top-center' })
        this.resetLocalContext()
      }
    },
    setStorageContext () {
      localStorage.setItem(this.clientid, JSON.stringify({
        clientid: this.clientid,
        ticketid: this.ticketid,
        e6: this.e6,
        ticketdiagnostic: this.diagnostic,
        diagnosticDescription: this.diagnosticDescription,
        ticketsolution: this.solution,
        solutionDescription: this.solutionDescription,
        initDiagnostic: this.initDiagnostic,
        initSolution: this.initSolution,
        start: this.start,
        end: null,
        technician: this.$store.state.auth.id
      }))
    },
    resetLocalContext () {
      this.e6 = 1
      this.ticketdiagnostic = null
      this.diagnosticDescription = ''
      this.ticketsolution = null
      this.solutionDescription = ''
      this.initDiagnostic = false
      this.initSolution = false
    }
  }
}
</script>
