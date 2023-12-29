<template>
  <div>
    <span style="display:grid;place-items:center;">
      <v-btn
        v-if="!end"
        color="red darken-4"
        class="mb-5"
        x-large
        :loading="loading"
        @click="makeCuts"
      >
        {{ $store.state.cuts.applyOffer ? 'Iniciar proceso de cambio de tarifas' : 'Iniciar proceso de cortes' }}
      </v-btn>
      <div v-else>
        <p>Proceso finalizado</p>
        <v-btn
          class="mb-5"
          x-large
          @click="$store.commit('cuts/e1', '1')"
        >
          Salir
        </v-btn>
      </div>
    </span>
    <v-card v-if="inprocess">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="cuts"
          :loading="loading"
          :item-class="getcolor"
        >
          <template v-slot:[`item.address`]="{ item }">
            <span>
              {{ item.address }}
            </span>
          </template>
          <template v-slot:[`item.neighborhood`]="{ item }">
            <span>
              {{ item.neighborhood }}
            </span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-card v-if="cutErrors.length > 0">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="cutErrors"
          :loading="loading"
          :item-class="getcolor"
        />
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    e1: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      prepare: false,
      inprocess: false,
      headers: [
        { text: 'Codigo', value: 'code' },
        { text: 'Nombre', value: 'normalized_client.name' },
        { text: 'Direccion', value: 'address' },
        { text: 'Barrio', value: 'neighborhood' },
        { text: 'Telefono', value: 'normalized_client.phone' },
        { text: 'Plan', value: 'plan.name' },
        { text: 'Resultado', value: 'success' }
      ],
      end: false
    }
  },
  computed: {
    validServices () {
      return this.$store.state.cuts.validServices
    },
    cuts () {
      return this.$store.state.cuts.cuts
    },
    cutErrors () {
      return this.$store.state.cuts.cutErrors
    },
    kick () {
      return this.$store.state.cuts.kick
    },
    loading () {
      return this.$store.state.cuts.loading
    },
    telegramBots () {
      return this.$store.state.telegram.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    },
    city () {
      return this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
    }
  },
  mounted () {
    this.$store.dispatch('telegram/getTelegramBotsFromDatabase', { token: this.$store.state.auth.token })
  },
  methods: {
    getMonthName () {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]

      const d = new Date()
      return monthNames[d.getMonth()]
    },
    async makeCuts () {
      this.inprocess = true
      this.$store.commit('cuts/loading', true)
      this.$store.commit('cuts/resetcuts')

      if (this.applyOffer && this.offer) {
        await this.applyOffers()
        this.$store.commit('cuts/loading', false)
      } else {
        await this.addBillingPeriod()
        await this.cutsProcess()
        this.$store.commit('cuts/loading', false)
      }
      this.end = true
    },
    async addBillingPeriod () {
      const lastbillingperiod = await this.$store.dispatch('cuts/getLastBillingPeriod', {
        city: this.city,
        token: this.$store.state.auth.token
      })
      if (lastbillingperiod) {
        if (lastbillingperiod[0].month === new Date().getMonth() + 1 && lastbillingperiod[0].year === new Date().getFullYear()) {
          return
        }
      }
      await this.$store.dispatch('cuts/addBillingPeriod', {
        city: this.city,
        token: this.$store.state.auth.token,
        name: this.getMonthName(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      })
    },
    async applyOffers () {
      for (let i = 0; i < this.validServices.length; i++) {
        const service = this.validServices[i]
        if (service.debtmovement.isindebt) {
          this.$store.commit('cuts/addCutInDebt', {
            service
          })
        } else {
          await this.$store.dispatch('offer/setNewOffer', {
            token: this.$store.state.auth.token,
            service,
            city: this.city,
            offer: this.offer,
            details: 'CAMBIO DE TARIFA EN LOTE',
            isindebt: true,
            isretired: false,
            isBulkDx: true,
            technician: this.$store.state.auth
          }).then(async () => {
            await this.$store.dispatch('client/setPlanFromModal', {
              serviceId: service.id,
              serviceIndex: null,
              isOfferChange: false,
              kick: this.kick,
              isBulkDx: true,
              newPlan: { id: this.offer.plan.id },
              operator: this.$store.state.auth.id,
              token: this.$store.state.auth.token
            }).then((success) => {
              if (success) {
                this.$store.commit('cuts/addCut', {
                  service
                })
              } else {
                this.$store.commit('cuts/addCutError', {
                  service
                })
              }
            })
          })
        }
      }
    },
    async cutsProcess () {
      for (let i = 0; i < this.validServices.length; i++) {
        const service = this.validServices[i]
        this.$simpleTelegramUpdateDebt({ service, operator: this.$store.state.auth.username, indebt: true, active: true, telegramBots: this.telegramBots })
        await this.$store.dispatch('cuts/updateBillingPeriodAndDebt', {
          token: this.$store.state.auth.token,
          service,
          billingmonth: new Date().getMonth() + 1,
          billingyear: new Date().getFullYear(),
          indebt: true
        })
        await this.$store.dispatch('offer/setNewDebt', {
          token: this.$store.state.auth.token,
          city: this.city,
          isindebt: true,
          isretired: false,
          isBulkDx: true,
          service,
          comment: 'CORTE MORA EN LOTE',
          technician: this.$store.state.auth
        })
        await this.$store.dispatch('client/setPlanFromModal', {
          serviceId: service.id,
          serviceIndex: null,
          isOfferChange: false,
          kick: this.kick,
          isBulkDx: true,
          newPlan: { id: 7 },
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        }).then((success) => {
          if (success) {
            this.$store.commit('cuts/addCut', {
              service
            })
          } else {
            this.$store.commit('cuts/addCutError', {
              service
            })
          }
        })
      }
    },
    getcolor (item) {
      if (item.success) {
        return 'success--text'
      } else {
        return 'error--text'
      }
    }
  }
}
</script>
<style>
.ready-list {
  background-color:red;
}
</style>
