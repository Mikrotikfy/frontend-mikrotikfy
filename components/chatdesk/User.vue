<template>
  <div ref="scroll" style="overflow-y:scroll;height: calc(95vh - 200px);" @scroll="scroll($event)">
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
            <v-list-item-subtitle v-text="item.lastwhatsapp ? getMessage(item.lastwhatsapp) : ''" />
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-action-text class="d-flex mt-4 align-center">
              <v-icon
                v-if="!item.read"
                color="green lighten-1"
              >
                mdi-circle
              </v-icon>
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>
<script>
export default {
  data: () => ({
    selectedItem: null,
    initialCount: null,
    header: 'Conversaciones recientes',
    pagination: {
      page: 1,
      pageSize: 100
    }
  }),
  computed: {
    whatsappContacts () {
      return this.$store.state.whatsapp.whatsappContacts
    }
  },
  watch: {
    '$route.query.phone' () {
      this.getWhatsappMessages()
    }
  },
  mounted () {
    this.getWhatsappContacts()
    this.setIntervalToGetWhatsappMessages()
    this.updateWhatsappMessagesCount()
  },
  methods: {
    async scroll (e) {
      const bottomOfWindow = this.$refs.scroll.scrollTop + this.$refs.scroll.clientHeight + 1 >= this.$refs.scroll.scrollHeight

      if (bottomOfWindow) {
        await this.$store.dispatch('whatsapp/getMoreWhatsappContacts', {
          city: this.$route.query.city,
          token: this.$store.state.auth.token,
          pagination: {
            page: this.pagination.page + 1,
            pageSize: this.pagination.pageSize
          }
        })
      }
    },
    setIntervalToGetWhatsappMessages () {
      setInterval(() => {
        this.getWhatsappMessagesCount()
      }, 1000)
    },
    async getWhatsappMessagesCount () {
      const count = await this.$store.dispatch('whatsapp/getWhatsappMessagesCount', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
      if (count > this.initialCount) {
        this.getWhatsappContacts()
        this.updateWhatsappMessagesCount()
      }
    },
    async updateWhatsappMessagesCount () {
      this.initialCount = await this.$store.dispatch('whatsapp/getWhatsappMessagesCount', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
    },
    async getWhatsappContacts () {
      await this.$store.dispatch('whatsapp/getWhatsappContacts', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token,
        pagination: this.pagination
      })
      this.isAnySelected()
    },
    isAnySelected () {
      if (this.$route.query.phone) {
        const f = c => c.phone === this.$route.query.phone
        this.selectedItem = this.whatsappContacts.findIndex(f)
        this.getWhatsappMessages()
      }
    },
    getWhatsappMessages () {
      this.$store.dispatch('whatsapp/getWhatsappMessages', {
        phone: this.$route.query.phone,
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
    },
    async openChat (item) {
      this.$router.push({ path: `/chatdesk?phone=${item.phone}&city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}` })
      if (!item.read) {
        await this.setReadToTrue(item)
        this.getWhatsappContacts()
      }
    },
    async setReadToTrue (item) {
      await this.$store.dispatch('whatsapp/setReadToTrue', {
        id: item.id,
        token: this.$store.state.auth.token
      })
    },
    getUnixTimeFromString (dateStr) {
      const date = new Date(dateStr)
      const unixTimestamp = Math.floor(date.getTime() / 1000)
      return unixTimestamp
    },
    getMessage (message) {
      const type = message.payload.entry[0].changes[0].value.messages[0].type

      if (type === 'text') {
        return message.payload.entry[0].changes[0].value.messages[0].text.body
      }
      if (type === 'image') {
        return '*Envió una imagen'
      }
      if (type === 'audio') {
        return '*Envió un audio'
      }
      if (type === 'reaction') {
        return '*Envió una reaccion'
      }
      if (type === 'video') {
        return '*Envió un video'
      }
      return 'Otro'
    }
  }
}
</script>
