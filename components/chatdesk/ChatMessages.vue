<template>
  <div class="parent-chat-message">
    <div
      v-for="message in whatsappMessages"
      :key="message.id"
    >
      <ChatdeskThirdPartyBubble
        v-if="message.to === null"
        :payload="message.payload"
        class="partner-message"
      />
      <ChatdeskOwnBubble
        v-if="message.to !== null && message.to !== 'dummy'"
        :to="message.to"
        :payload="message.payload"
        :createdat="message.createdAt"
        class="own-message"
      />
      <span v-if="message.to === 'dummy'" ref="goToScrollItem" style="display:hidden;" />
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  computed: {
    whatsappMessages () {
      return this.$store.state.whatsapp.whatsappMessages
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped>
  .parent-chat-message {
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
    width:100%;
    height: 100%;
    overflow-y: scroll;
    position:relative;
    bottom:0;
  }
  .own-message {
    display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 10px;
    width:100%;
    place-self: end;
  }
  .partner-message {
    display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 10px;
    width:100%;
  }
</style>
