<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="dialogEdit = true"
        >
          <v-icon>mdi-account</v-icon>
          <span v-if="block">
            Información de usuario
          </span>
        </v-btn>
      </template>
      <span>Información de usuario</span>
    </v-tooltip>
    <v-dialog v-if="dialogEdit" v-model="dialogEdit" max-width="1100px" :retain-focus="false" fullscreen>
      <v-card>
        <v-container fluid>
          <v-card-title>
            <v-icon class="mr-2">
              mdi-account
            </v-icon>
            Información de usuario {{ client.name }} <span class="caption grey--text ml-3"> // ID Cliente: <strong>{{ client.id }}</strong></span>
            <v-spacer />
            <v-btn icon @click="dialogEdit = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-row>
            <v-col cols="12" xs="12" md="12" lg="12" xl="6">
              <v-row class="flex-column">
                <v-col>
                  <ControlInformation
                    :client="client"
                    :index="index"
                    @updateSuccess="reloadSearch"
                  />
                </v-col>
                <v-col v-if="$route.query.clienttype === 'INTERNET'">
                  <ControlDevices
                    :clientid="client.id"
                    :name="client.name"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" xs="12" md="12" lg="12" xl="6">
              <v-row class="flex-column">
                <v-col v-if="$route.query.clienttype === 'INTERNET'">
                  <ControlNap
                    :isticket="false"
                    :client="client"
                  />
                </v-col>
                <v-col>
                  <MiscTicketHistory
                    :clientid="client.id"
                    :name="client.name"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
/* eslint-disable vue/prop-name-casing */
export default {
  name: 'EditForm',
  props: {
    client: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    },
    role: {
      type: Array,
      default: () => []
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialogEdit: false,
    currentEditClient: {},
    loading: true,
    clientExists: false,
    showCard: false,
    clientData: {},
    modal: false
  }),
  methods: {
    reloadSearch () {
      this.$emit('reloadSearch')
    }
  }
}
</script>

<style>

</style>
