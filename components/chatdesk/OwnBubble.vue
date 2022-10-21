<template>
  <span
    class="ma-2 grey darken-3 rounded-lg pa-2 text-subtitle-1"
    style="height:fit-content;width:fit-content;max-width:50%;overflow-wrap:break-word;position:relative;"
  >
    <ChatdeskOwnMessageText
      v-if="payload.type === 'text'"
      :payload="payload"
      :createdat="createdat"
    />
    <ChatdeskOwnMessageReaction
      v-if="payload.type === 'reaction'"
      :payload="payload"
      :createdat="createdat"
    />
    <ChatdeskOwnMessageMedia
      v-if="payload.type === 'image'"
      :payload="payload"
      :createdat="createdat"
    />
  </span>
</template>
<script>
export default {
  name: 'ChatdeskOwnBubble',
  props: {
    payload: {
      type: Object,
      required: true
    },
    createdat: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    getDateFromUnixTime (unixTime) {
      const date = new Date(unixTime * 1000)
      return `${date.getHours()}:${date.getMinutes()}`
    }
  }
}
</script>
