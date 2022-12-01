<template>
  <div>
    <span class="px-2 mb-3 mr-8">
      <audio controls :src="audio" type="audio/ogg" />
    </span>
    <span class="text-caption mt-3" style="right:10px;bottom:0;position:absolute;">
      {{
        getDateFromUnixTime(payload.entry[0].changes[0].value.messages[0].timestamp)
      }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'ChatdeskMessageText',
  props: {
    payload: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      audio: null,
      imageZoom: false
    }
  },
  mounted () {
    this.getMediaById()
  },
  methods: {
    async getMediaById () {
      const audioInDatabase = await this.$store.dispatch('whatsapp/getMediaById', {
        id: this.payload.entry[0].changes[0].value.messages[0].audio.id,
        token: this.$store.state.auth.token
      })
      if (audioInDatabase.length > 0) {
        this.audio = `${this.$config.CDN_STRAPI_ENDPOINT}${audioInDatabase[0].url}`
      } else {
        await this.$store.dispatch('whatsapp/getAudioByMediaId', {
          id: this.payload.entry[0].changes[0].value.messages[0].audio.id,
          token: this.$store.state.auth.token
        }).then(async (media) => {
          const form = new FormData()
          form.append('files', await media.blob(), `${this.payload.entry[0].changes[0].value.messages[0].audio.id}.${media.type === 'audio/ogg; codecs=opus' ? 'ogg' : 'mp3'}`)
          await fetch(`${this.$config.API_STRAPI_ENDPOINT}upload`, {
            method: 'post',
            headers: {
              Authorization: `Bearer ${this.$store.state.auth.token}`
            },
            body: form
          })
            .then(res => res.json())
            .then((res) => {
              this.createAudioEntry(res[0], this.payload.entry[0].changes[0].value.messages[0].audio.id)
              this.audio = `${this.$config.CDN_STRAPI_ENDPOINT}${res[0].url}`
            })
        })
      }
    },
    createAudioEntry (audio = { url: 'upload/default.ogg' }, mediaid = 'default') {
      this.$store.dispatch('whatsapp/createAudioEntry', {
        mediaid,
        audio,
        token: this.$store.state.auth.token
      })
    },
    getDateFromUnixTime (unixTime) {
      const date = new Date(unixTime * 1000)
      return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
  }
}
</script>
