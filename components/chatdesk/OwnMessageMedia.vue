<template>
  <div style="width:350px;">
    <span class="px-2 mb-3">
      <v-img
        :src="payload.image.link"
        height="100%"
        width="100%"
        cover
        @click="imageZoom = true"
      />
    </span>
    <span class="text-caption" style="left:10px;bottom:0;position:absolute;">
      {{
        getDate(createdat)
      }}
    </span>
    <v-dialog
      v-model="imageZoom"
      width="90%"
    >
      <v-img
        :src="payload.image.link"
        width="100%"
        cover
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
    },
    createdat: {
      type: String,
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
    // this.getMediaById()
  },
  methods: {
    // async getMediaById () {
    //   const mediaInDatabase = await this.$store.dispatch('whatsapp/getMediaById', {
    //     id: this.payload.entry[0].changes[0].value.messages[0].image.id,
    //     token: this.$store.state.auth.token
    //   })
    //   if (mediaInDatabase.length > 0) {
    //     this.imgBlob = `${this.$config.CDN_STRAPI_ENDPOINT}${mediaInDatabase[0].url}`
    //   } else {
    //     const media = await this.$store.dispatch('whatsapp/getImgByMediaId', {
    //       id: this.payload.entry[0].changes[0].value.messages[0].image.id,
    //       token: this.$store.state.auth.token
    //     })
    //     const form = new FormData()
    //     form.append('files', await media.blob(), `${this.payload.entry[0].changes[0].value.messages[0].image.id}.${media.type === 'image/jpeg' ? 'jpg' : 'png'}`)
    //     await fetch('http://localhost:1337/api/upload', {
    //       method: 'post',
    //       headers: {
    //         Authorization: `Bearer ${this.$store.state.auth.token}`
    //       },
    //       body: form
    //     })
    //       .then(res => res.json())
    //       .then((res) => {
    //         this.createMediaEntry(res[0], this.payload.entry[0].changes[0].value.messages[0].image.id)
    //         this.imgBlob = 'http://localhost:1337' + res[0].url
    //       })
    //   }
    // },
    // createMediaEntry (img = { url: 'upload/default.jpg' }, mediaid = 'default') {
    //   this.$store.dispatch('whatsapp/createMediaEntry', {
    //     mediaid,
    //     img,
    //     token: this.$store.state.auth.token
    //   })
    // },
    getDate (inputdate) {
      const date = new Date(inputdate)
      return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
  }
}
</script>
