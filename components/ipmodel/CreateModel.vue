<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field
          v-model="newModel.cidr"
          label="IP Sugerida"
          filled
          :success="success"
          :error="error"
          @keyup="newModelBtn = false, saveBtn = true"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="newModel.vlan"
          label="VLAN"
          filled
          item-text="name"
          item-value="vlan"
          return-object
          :items="vlans"
          :success="newModel.vlan !== null"
          :error="newModel.vlan === null"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="newModel.gateway"
          label="Puerta de enlace"
          readonly
          filled
          :success="success"
          :error="error"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="newModel.host"
          label="IP Cliente"
          readonly
          filled
          :success="success"
          :error="error"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="newModel.mask"
          label="Mascara de subred"
          readonly
          filled
          :success="success"
          :error="error"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          :disabled="newModelBtn"
          @click="generateIpFromCIDR()"
        >
          <v-icon>mdi-wan</v-icon>
          <span>
            Crear Modelo
          </span>
        </v-btn>
        <v-btn
          color="primary"
          :disabled="saveBtn"
          @click="saveIpModel()"
        >
          <v-icon>mdi-check</v-icon>
          <span>
            Asignar y continuar
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import ipaddr from 'ipaddr.js'

export default {
  props: {
    client: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      newModel: {
        cidr: '',
        vlan: null,
        mask: '',
        network: '',
        gateway: '',
        host: '',
        broadcast: ''
      },
      custom: false,
      success: false,
      error: false,
      newModelBtn: false,
      saveBtn: true
    }
  },
  computed: {
    vlans () {
      return this.$store.state.vlans.vlans
    }
  },
  mounted () {
    this.custom = false
    this.generateNewCIDR()
    this.getVlans()
  },
  methods: {
    getVlans () {
      this.$store.dispatch('vlans/getVlans', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
    },
    saveIpModel () {
      if (!this.newModel.vlan) {
        this.$toast.error('Debes especificar la VLAN', { position: 'bottom-center' })
        return
      }
      this.$store.dispatch('ipmodel/saveIpModel', {
        data: {
          ...this.newModel,
          city: this.$store.state.auth.cities.find(city => city.name === this.$route.query.city).id,
          client: this.client.id,
          technician: this.$store.state.auth.id
        },
        token: this.$store.state.auth.token
      }).then((response) => {
        if (response.status === 200) {
          this.newModelBtn = true
          this.saveBtn = false
          this.$store.dispatch('ipmodel/getLast', {
            city: this.$route.query.city,
            token: this.$store.state.auth.token
          })
          this.$store.dispatch('ipmodel/sendIpModelToMikrotik', {
            token: this.$store.state.auth.token,
            data: {
              ...this.newModel,
              city: this.$store.state.auth.cities.find(city => city.name === this.$route.query.city).id,
              client: this.client,
              technician: this.$store.state.auth.id
            }
          })
          this.newModel = {
            cidr: '',
            mask: '',
            network: '',
            gateway: '',
            host: '',
            broadcast: ''
          }
          this.$emit('closeModal')
        }
      })
    },
    generateNewCIDR () {
      const nextValidIp = this.generateNextValidIp()
      const cidr = nextValidIp + '/30'
      this.newModel.cidr = cidr
      this.generateIpFromCIDR()
    },
    generateNextValidIp () {
      const lastClient = this.$store.state.ipmodel.lastIpModel
      const lastClientBroadcastIp = ipaddr.IPv4.broadcastAddressFromCIDR(lastClient.cidr)
      lastClientBroadcastIp.octets[3] = lastClientBroadcastIp.octets[3] + 2
      const nextValidIp = lastClientBroadcastIp
      return nextValidIp
    },
    generateIpFromCIDR () {
      this.success = false
      this.error = false
      const isvalid = ipaddr.isValid(this.newModel.cidr.split('/')[0])
      if (isvalid) {
        const network = ipaddr.IPv4.networkAddressFromCIDR(this.newModel.cidr)
        const broadcast = ipaddr.IPv4.broadcastAddressFromCIDR(this.newModel.cidr)
        const gateway = `${network.octets[0]}.${network.octets[1]}.${network.octets[2]}.${network.octets[3] + 1}`
        const host = `${broadcast.octets[0]}.${broadcast.octets[1]}.${broadcast.octets[2]}.${broadcast.octets[3] - 1}`
        const mask = ipaddr.IPv4.subnetMaskFromPrefixLength(parseInt(this.newModel.cidr.split('/')[1]))
        this.newModel.mask = mask.toString()
        this.newModel.network = network.toString()
        this.newModel.gateway = gateway
        this.newModel.host = host
        this.newModel.broadcast = broadcast.toString()
        this.success = true
        this.error = false
        this.newModelBtn = true
        this.saveBtn = false
      } else {
        this.success = false
        this.error = true
      }
    }
  }
}
</script>
