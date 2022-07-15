<template>
  <div style="width:100%;height:100vh;display:grid;place-items:center;">
    <p v-for="ipBody in db" :key="ipBody.client">
      CIDR: {{ ipBody.cidr }} <br>
      network: {{ ipBody.network }}<br>
      gateway: {{ ipBody.gateway }}<br>
      host: {{ ipBody.host }}<br>
      broadcast: {{ ipBody.broadcast }}<br><br>
    </p>
    <v-btn @click="generateIpBodyFromLastClient">
      Process
    </v-btn>
  </div>
</template>

<script>
import ipaddr from 'ipaddr.js'
export default {
  data () {
    return {
      ip: '10.66.1.1/30',
      result: 'ninguno',
      db: [
        {
          client: 1,
          cidr: '10.66.1.1/30',
          network: '10.66.1.0',
          gateway: '10.66.1.1',
          host: '10.66.1.2',
          broadcast: '10.66.1.3'
        }
      ]
    }
  },
  methods: {
    generateNextValidIp () {
      const lastClient = this.db[this.db.length - 1]
      const lastClientBroadcastIp = ipaddr.IPv4.broadcastAddressFromCIDR(lastClient.cidr)
      lastClientBroadcastIp.octets[3] = lastClientBroadcastIp.octets[3] + 2
      const nextValidIp = lastClientBroadcastIp
      return nextValidIp
    },
    generateIpBodyFromLastClient () {
      const nextValidIp = this.generateNextValidIp()
      const cidr = nextValidIp + '/30'
      const network = ipaddr.IPv4.networkAddressFromCIDR(cidr)
      const gateway = `${network.octets[0]}.${network.octets[1]}.${network.octets[2]}.${network.octets[3] + 1}`
      const host = `${network.octets[0]}.${network.octets[1]}.${network.octets[2]}.${network.octets[3] + 2}`
      const broadcast = ipaddr.IPv4.broadcastAddressFromCIDR(cidr)
      const newIpObj = {
        client: this.db.length + 1,
        cidr,
        network: network.toString(),
        gateway,
        host,
        broadcast: broadcast.toString()
      }
      this.db.push(newIpObj)
    }
  }
}
</script>
