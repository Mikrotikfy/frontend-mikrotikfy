<template>
  <div>
    <v-btn
      x-small
      color="blue darken-4"
      elevation="0"
      @click="dialog = true"
    >
      Historial
      <v-icon>mdi-history</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="550"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Abonos realizados</span>
        </v-card-title>
        <v-card-text>
          <p
            v-for="item in bill.deposits"
            :key="item.id"
          >
            {{ item.amount }} - {{ item.details }} - {{ item.date }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn>
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    bill: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false
    }
  }
}
</script>
