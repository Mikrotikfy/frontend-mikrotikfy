<template>
  <div style="overflow-y: scroll;height: calc(95vh - 200px);">
    <v-list three-line>
      <v-list-item-group
        v-model="selectedItem"
        color="success"
      >
        <v-list-item
          v-for="(item, index) in whatsappContacts"
          :key="index"
          @click="openChat(item)"
        >
          <v-list-item-avatar>
            <v-img :src="item.avatar || 'default-user.png'" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="item.name" />
            <v-list-item-subtitle v-text="item.phone" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>
<script>
export default {
  data: () => ({
    whatsappContacts: [],
    selectedItem: null,
    header: 'Conversaciones recientes'
  }),
  mounted () {
    this.getWhatsappContacts()
  },
  methods: {
    async getWhatsappContacts () {
      this.whatsappContacts = await this.$store.dispatch('whatsapp/getWhatsappContacts', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
      this.isAnySelected()
    },
    isAnySelected () {
      if (this.$route.query.phone) {
        const f = c => c.phone === this.$route.query.phone
        this.selectedItem = this.whatsappContacts.findIndex(f)
        this.openChat(this.whatsappContacts.find(f))
      }
    },
    getWhatsappMessages (item) {
      this.$store.dispatch('whatsapp/getWhatsappMessages', {
        phone: item.phone,
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
    },
    openChat (item) {
      this.$router.push({ path: `/chatdesk?phone=${item.phone}&city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}` })
      this.getWhatsappMessages(item)
    }
  }
}
</script>
