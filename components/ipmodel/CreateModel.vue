<template>
  <div>
    <v-row>
      <v-col>
        <v-text-field
          v-model="newModel.cidr"
          label="IP Sugerida"
          filled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="newModel.gateaway"
          label="Puerta de enlace"
          readonly
          filled
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="newModel.host"
          label="IP Cliente"
          readonly
          filled
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="newModel.mask"
          label="Mascara de subred"
          readonly
          filled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          @click="generateIpFromCIDR()"
        >
          <v-icon>mdi-wan</v-icon>
          <span>
            Crear Modelo
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import ipaddr from 'ipaddr.js'

export default {
  data () {
    return {
      newModel: {
        cidr: '',
        mask: '',
        netowork: '',
        gateaway: '',
        host: '',
        broadcast: ''
      },
      custom: false
    }
  },
  mounted () {
    this.custom = false
    this.generateNewCIDR()
  },
  methods: {
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
      console.log('generate')
      const network = ipaddr.IPv4.networkAddressFromCIDR(this.newModel.cidr)
      const broadcast = ipaddr.IPv4.broadcastAddressFromCIDR(this.newModel.cidr)
      const gateaway = `${network.octets[0]}.${network.octets[1]}.${network.octets[2]}.${network.octets[3] + 1}`
      const host = `${broadcast.octets[0]}.${broadcast.octets[1]}.${broadcast.octets[2]}.${broadcast.octets[3] - 1}`
      const mask = ipaddr.IPv4.subnetMaskFromPrefixLength(parseInt(this.newModel.cidr.split('/')[1]))
      this.newModel.mask = mask
      this.newModel.network = network.toString()
      this.newModel.gateaway = gateaway
      this.newModel.host = host
      this.newModel.broadcast = broadcast.toString()
    }
  }
}
</script>
