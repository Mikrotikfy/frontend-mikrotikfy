<template>
  <div>
    <div class="d-flex">
      <v-text-field
        v-model="phone"
        :rules="phoneRules"
        label="Ingrese numero telefonico del cliente"
        class="mt-1"
        style="border-radius: 0px 0px 0px 0px;"
        outlined
        hide-details="auto"
      />
      <v-btn
        color="primary"
        class="mt-1"
        style="border-radius: 0px 10px 10px 0px; height:56px;"
        :disabled="!phone"
        :loading="loading"
        x-large
        @click.enter="sendCode"
      >
        <v-icon>
          mdi-send
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    phone: '',
    loading: false,
    phoneRules: [
      v => !!v || 'El numero telefonico es requerido',
      v => v.length === 10 || 'El numero telefonico debe tener 10 digitos'
    ],
    res: null,
    randomNumber: null
  }),
  mounted () {
    this.randomNumber = this.random6Digits()
  },
  methods: {
    async sendCode () {
      if (typeof this.phoneRules[0](this.phone) !== 'boolean' || typeof this.phoneRules[1](this.phone) !== 'boolean') {
        this.$toast.error('El numero telefonico es invalido', { duration: 3000 })
        return
      }
      this.loading = true
      if (this.$store.state.create.hasWhatsapp) {
        this.res = await this.sendWhatsappCode()
      }
      this.$store.commit('create/randomNumber', this.randomNumber)
      this.$store.commit('create/setClientNumber', this.phone)
      this.$store.commit('create/sete1', 4)
      this.loading = false
    },
    random6Digits () {
      return Math.floor(100000 + Math.random() * 900000)
    },
    sendWhatsappCode () {
      return new Promise((resolve, reject) => {
        fetch(this.$config.META_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$config.META_TOKEN}`
          },
          body: JSON.stringify(
            {
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: `57${this.phone}`,
              type: 'template',
              template: {
                name: 'verification_arnop_v2',
                language: {
                  code: 'es'
                },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      {
                        type: 'text',
                        text: '123456'
                      }
                    ]
                  },
                  {
                    type: 'button',
                    sub_type: 'url',
                    index: '0',
                    parameters: [
                      {
                        type: 'text',
                        text: '<ONE-TIME PASSWORD>'
                      }
                    ]
                  }
                ]
              }
            }
          )
        })
          .then(res => res.json())
          .then((res) => {
            resolve(res)
          })
      })
    }
  }
}
</script>
