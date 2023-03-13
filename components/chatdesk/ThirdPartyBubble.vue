<template>
  <span
    class="green darken-4 darken-4 rounded-lg pa-2 text-subtitle-1"
    style="height:fit-content;width:fit-content;min-width: 150px;max-width:50%;overflow-wrap:anywhere;position:relative;"
  >
    <ChatdeskMessageText
      v-if="payload.entry[0].changes[0].value.messages[0].type === 'text'"
      :payload="payload"
    />
    <ChatdeskMessageMedia
      v-if="payload.entry[0].changes[0].value.messages[0].type === 'image' || payload.entry[0].changes[0].value.messages[0].type === 'video'"
      :payload="payload"
    />
    <ChatdeskMessageContact
      v-if="payload.entry[0].changes[0].value.messages[0].type === 'contacts'"
      :payload="payload"
    />
    <ChatdeskMessageReaction
      v-if="payload.entry[0].changes[0].value.messages[0].type === 'reaction'"
      :payload="payload"
    />
    <ChatdeskMessageAudio
      v-if="payload.entry[0].changes[0].value.messages[0].type === 'audio'"
      :payload="payload"
    />
  </span>
</template>
<script>
export default {
  name: 'ChatdeskThirdPartyBubble',
  props: {
    payload: {
      type: Object,
      required: true
    }
  }
}
</script>
