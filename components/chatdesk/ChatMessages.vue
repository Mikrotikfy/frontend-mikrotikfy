<template>
  <div class="parent-chat-message">
    <ChatdeskThirdPartyBubble
      v-for="message in whatsappMessages"
      :key="message.id"
      :payload="message.payload"
      class="partner-message"
    />
    <ChatdeskOwnBubble
      v-for="message in ownWhatsappMessages"
      :key="message.id"
      :payload="message.payload"
      :createdat="message.createdAt"
      class="own-message"
    />
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
    },
    ownWhatsappMessages () {
      return this.$store.state.whatsapp.ownWhatsappMessages
    }
  }
}
</script>
<style scoped>
  .parent-chat-message {
    display: flex;
    flex-direction: column;
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
