<template>
  <div>
    <span class="px-2 mb-3 mr-8">
      <v-img
        :src="imgBlob"
        max-width="350px"
        height="auto"
        contain
        @click="imageZoom = true"
      />
    </span>
    <span class="text-caption" style="right:10px;bottom:0;position:absolute;">
      {{
        getDateFromUnixTime(payload.entry[0].changes[0].value.messages[0].timestamp)
      }}
    </span>
    <v-dialog
      v-model="imageZoom"
      width="auto"
    >
      <v-img
        :src="imgBlob"
        height="auto"
        contain
      />
    </v-dialog>
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
      imgBlob: null,
      imageZoom: false
    }
  },
  mounted () {
    this.getMediaById()
  },
  methods: {
    async getMediaById () {
      const mediaInDatabase = await this.$store.dispatch('whatsapp/getMediaById', {
        id: this.payload.entry[0].changes[0].value.messages[0].image.id,
        token: this.$store.state.auth.token
      })
      if (mediaInDatabase.length > 0) {
        this.imgBlob = `${this.$config.CDN_STRAPI_ENDPOINT}${mediaInDatabase[0].url}`
      } else {
        const media = await this.$store.dispatch('whatsapp/getImgByMediaId', {
          id: this.payload.entry[0].changes[0].value.messages[0].image.id,
          token: this.$store.state.auth.token
        })
        const form = new FormData()
        form.append('files', await media.blob(), `${this.payload.entry[0].changes[0].value.messages[0].image.id}.${media.type === 'image/jpeg' ? 'jpg' : 'png'}`)
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}upload`, {
          method: 'post',
          headers: {
            Authorization: `Bearer ${this.$store.state.auth.token}`
          },
          body: form
        })
          .then(res => res.json())
          .then((res) => {
            this.createMediaEntry(res[0], this.payload.entry[0].changes[0].value.messages[0].image.id)
            this.imgBlob = `${this.$config.CDN_STRAPI_ENDPOINT}${res[0].url}`
          })
      }
    },
    createMediaEntry (img = { url: 'upload/default.jpg' }, mediaid = 'default') {
      this.$store.dispatch('whatsapp/createMediaEntry', {
        mediaid,
        img,
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
