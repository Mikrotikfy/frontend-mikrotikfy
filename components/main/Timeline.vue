<template>
  <v-container fluid>
    <v-card class="elevation-0 transparent">
      <v-card-text class="transparent px-0 mx-0">
        <v-row>
          <v-tooltip top>
            <!-- eslint-disable -->
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                class="mt-4 mx-4"
                color="white black--text"
                dark
                rounded
                :disabled="loading"
                :loading="loading"
                v-on="on"
                @click="getTimeline()"
              >
              <v-icon>mdi-reload</v-icon>
              </v-btn>
            </template>
          <span>Refrescar Tickets</span>
        </v-tooltip>
        <v-checkbox
          v-model="closed"
          class="mr-4"
          label="Mostrar cerrados"
          @change="getTimeline()"
        />
        <v-checkbox
          v-model="retired"
          class="mr-4"
          label="Mostrar retiros"
          @change="getTimeline()"
        />
        <h3 v-if="!closed" class="align-self-center">
          {{ timeline.length }}
          {{ timeline.length === 1 ? 'Ticket activo' : 'Tickets activos' }}
        </h3>
        </v-row>
        <v-row class="mx-0 px-0 align-center">
          <TimelineItem
            v-for="item in timeline"
            :key="item.id"
            :editindex="timeline.indexOf(item)"
            :timeline-item="item"
            @sortByNeighborhood="sortByNeighborhood()"
          />
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: 'Timeline',
  data () {
    return {
      infoModal: false,
      closed: false,
      retired: false,
      loading: false,
      sortToggle: false,
      sort: ''
    }
  },
  computed: {
    timeline () {
      return this.$store.state.timeline.timeline
    }
  },
  mounted () {
    this.getTimeline()
  },
  methods: {
    async getTimeline () {
      this.loading = true
      await this.$store.dispatch('timeline/getTickets', {
        city: this.$route.query.city,
        token: this.$store.state.auth.token,
        clienttype: this.$route.query.clienttype,
        sort: this.sort,
        active: this.closed,
        retired: this.retired
      })
      this.loading = false
    },
    sortByNeighborhood () {
      this.sortToggle = !this.sortToggle
      if (this.sortToggle) {
        this.sort = 'client.neighborhood.name:desc'
      } else {
        this.sort = ''
      }
      this.getTimeline()
    },
    closeModal () {
      this.infoModal = false
    }
  }
}
</script>
<style>
.vertical{
    writing-mode: vertical-lr;
}
</style>
