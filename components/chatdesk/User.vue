<template>
  <div ref="scroll" style="overflow-y:scroll;height: calc(95vh - 120px);" @scroll="scroll($event)">
    <v-list two-line>
      <v-list-item-group
        v-model="selectedItem"
      >
        <v-list-item
          v-for="(item, index) in whatsappContacts"
          :key="index"
          class="mb-1 mr-2"
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
            <v-list-item-action-text>
              <span
                :class="item.pendingmessages && !item.read ? 'green--text font-weight-bold lighten-1' : ''"
              >{{ hourMinutes12Hour(item.lastmessage) }}</span>
            </v-list-item-action-text>
            <span
              v-if="item.pendingmessages && !item.read"
              style="background-color: #4caf50; border-radius: 50%; padding: 0px 7px 0 6px; color: black; font-weight: bold;"
            >
              {{ item.pendingmessages }}
            </span>
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
    intervalID: null,
    contactsCount: null,
    debounce: false,
    header: 'Conversaciones recientes',
    pagination: {
      page: 1,
      pageSize: 100
    }
  }),
  computed: {
    whatsappContacts () {
      return this.$store.state.whatsapp.whatsappContacts
    },
    notReadCount () {
      return this.$store.state.whatsapp.whatsappContacts.map(item => item.read).filter(item => item === false).length
    },
    chatdeskMenu () {
      return this.$store.state.menu.menu.filter(item => item.name === 'Escritorio')[0]
    }
  },
  watch: {
    '$route.query.phone' () {
      this.getWhatsappMessages()
    },
    async notReadCount (val) {
      if (val < 1) {
        await this.$store.dispatch('menu/removeAlertOnMenu', {
          token: this.$store.state.auth.token,
          menuId: this.chatdeskMenu.id
        })
        this.getMenu()
      }
    }
  },
  destroyed () {
    clearInterval(this.intervalID)
  },
  mounted () {
    this.getWhatsappContacts()
    this.setIntervalToGetWhatsappMessages()
    this.updateWhatsappMessagesCount()
    this.getWhatsappContactsCount()
  },
  methods: {
    async scroll (e) {
      const bottomOfWindow = this.$refs.scroll.scrollTop + this.$refs.scroll.clientHeight + 1 >= this.$refs.scroll.scrollHeight
      if (bottomOfWindow && this.contactsCount > this.whatsappContacts.length && !this.debounce) {
        this.debounce = true
        await this.$store.dispatch('whatsapp/getMoreWhatsappContacts', {
          city: this.$route.query.city,
          token: this.$store.state.auth.token,
          pagination: {
            page: this.pagination.page + 1,
            pageSize: this.pagination.pageSize
          }
        })
        setTimeout(() => {
          this.debounce = false
        }, 500)
      }
    },
    setIntervalToGetWhatsappMessages () {
      this.intervalID = setInterval(() => {
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
    async getWhatsappContactsCount () {
      this.contactsCount = await this.$store.dispatch('whatsapp/getWhatsappContactsCount', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
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
        await this.setReadToTrueAndResetPendingMessages(item)
        this.getWhatsappContacts()
      }
    },
    async setReadToTrueAndResetPendingMessages (item) {
      await this.$store.dispatch('whatsapp/setReadToTrueAndResetPendingMessages', {
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
      if (message && message.payload && message.payload.entry) {
        // eslint-disable-next-line no-var
        var type = message.payload.entry[0].changes[0].value.messages[0].type
        if (type === 'text') {
          return message.payload.entry[0].changes[0].value.messages[0].text.body
        }
      } else {
        // eslint-disable-next-line no-var
        type = message.payload.type
        if (type === 'text') {
          return message.payload.text.body
        }
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
    },
    async getMenu () {
      await this.$store.dispatch('menu/getMenuFromDatabase', {
        token: this.$store.state.auth.token
      })
    },
    hourMinutes12Hour (dateString) {
      const date = new Date(dateString)
      const hours = date.getHours()
      const suffix = hours < 12 ? 'a.m.' : 'p.m.'
      if (Date.now() - date.getTime() > 24 * 60 * 60 * 1000) {
        const formattedDate = date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'numeric'
        })
        return `${formattedDate}`
      } else {
        const formattedTime = `${(hours % 12) || 12}:${date.getMinutes().toString().padStart(2, '0')} ${suffix}`
        return `${formattedTime}`
      }
    }
  }
}
</script>
<style scoped>
.theme--dark.v-list-item--active::before {
    opacity: 0.24;
    border-radius: 10px;
}
.v-list-item--link:before {
    border-radius: 10px;
}
</style>
