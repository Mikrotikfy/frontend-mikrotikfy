<template>
  <div>
    <div class="d-flex">
      <v-radio-group
        v-model="hasWhatsapp"
        row
        label="Usuario tiene WhatsApp?"
      >
        <v-radio
          label="Si"
          color="green"
          :value="true"
        />
        <v-radio
          label="No"
          color="primary"
          :value="false"
        />
      </v-radio-group>
      <v-btn
        color="primary"
        class="mt-1 rounded-xl"
        x-large
        @click.enter="nextE1"
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
    hasWhatsapp: true
  }),
  watch: {
    hasWhatsapp (val) {
      this.$store.commit('create/hasWhatsapp', val)
    }
  },
  methods: {
    nextE1 () {
      this.$store.commit('create/sete1', 2)
    }
  }
}
</script>
