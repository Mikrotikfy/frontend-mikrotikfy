<template>
  <v-container fluid class="no-printme">
    <v-row>
      <v-col
        cols="12"
      >
        <v-card
          fluid
          class="rounded-lg elevation-0"
        >
          <v-card-text
            class="pa-1 d-flex"
          >
            <v-slide-group>
              <v-slide-item
                v-if="!$store.state.isDesktop"
              >
                <div>
                  <v-btn
                    class="my-2 ml-2 mr-1"
                    color="white black--text"
                    dark
                    rounded
                    small
                    :disabled="initialLoading"
                    :loading="initialLoading"
                    @click="initIntervalAndGetTickets()"
                  >
                    <v-icon>mdi-reload</v-icon>
                  </v-btn>
                </div>
              </v-slide-item>
              <v-slide-item
                v-if="!$store.state.isDesktop"
              >
                <div>
                  <MiscPrintTicket
                    v-if="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && $store.state.isDesktop"
                    :tickets="selected"
                  />
                </div>
              </v-slide-item>
              <v-slide-item
                v-if="!$store.state.isDesktop"
              >
                <div>
                  <MiscPrintOrder
                    v-if="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && $store.state.isDesktop"
                    :tickets="selected"
                  />
                </div>
              </v-slide-item>
              <v-slide-item
                v-if="!$store.state.isDesktop"
              >
                <div>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="white black--text"
                        dark
                        small
                        class="my-2 mr-1 rounded-xl"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon class="black--text">
                          mdi-list-status
                        </v-icon>
                        {{ $store.state.isDesktop ? 'Filtros' : '' }}
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-checkbox
                          v-model="showClosedValue"
                          class="mr-4"
                          label="Mostrar cerrados"
                          @change="initIntervalAndGetTickets()"
                        />
                      </v-list-item>
                      <v-list-item>
                        <v-checkbox
                          v-model="showRetired"
                          class="mr-4"
                          label="Mostrar retiros"
                          @change="initIntervalAndGetTickets()"
                        />
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </v-slide-item>
              <v-slide-item
                v-for="type in types"
                :key="type"
              >
                <v-btn
                  class="black--text rounded-xl ml-2 mr-1 my-2 elevation-0"
                  :class="type === $route.query.view ? 'white black--text' : $vuetify.theme.dark ? 'grey darken-1' : 'grey lighten-2'"
                  small
                  @click="changeView(type)"
                >
                  {{ calculateQuantity(type) }} {{ type }}
                </v-btn>
              </v-slide-item>
            </v-slide-group>
            <v-spacer v-if="$store.state.isDesktop" />
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="$store.state.isDesktop"
                  v-bind="attrs"
                  class="my-2 ml-1 mr-1"
                  color="white black--text"
                  dark
                  rounded
                  small
                  :disabled="initialLoading"
                  :loading="initialLoading"
                  v-on="on"
                  @click="initIntervalAndGetTickets()"
                >
                  <v-icon>mdi-reload</v-icon>
                </v-btn>
              </template>
              <span>Refrescar Tickets</span>
            </v-tooltip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-0 pt-0">
      <v-col>
        <client-only>
          <v-data-table
            :key="key"
            v-model="selected"
            :show-select="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && $store.state.isDesktop ? true : false"
            :headers="getHeadersByClienttype"
            :items="ticketList"
            :search="search"
            :items-per-page="itemsPerPage"
            :page.sync="page"
            :loading="initialLoading"
            :class="$store.state.isDesktop ? 'rounded-lg' : 'transparent'"
            :caption="$route.query.clienttype === 'INTERNET' ? 'DX INTERNET' : 'DX TELEVISION'"
            sort-by="createdAt"
            calculate-widths
            sort-desc
            dense
            no-data-text="No hay Tickets abiertos aún..."
            loading-text="Cargando información de tickets..."
            hide-default-footer
            mobile-breakpoint="100"
            @page-count="pageCount = $event"
            @click:row="showTicketInfo({ item: $event, index: ticketList.indexOf($event) })"
          >
            <template v-slot:[`item.active`]="props">
              <v-chip
                small
                label
                :color="getColor(props.item.active, props.item.answered, props.item.escalated, props.item.escalatedoffice)"
              >
                <h5>
                  {{ getState(props.item.active, props.item.answered, props.item.escalated, props.item.escalatedoffice) }}
                </h5>
              </v-chip>
            </template>
            <template v-slot:[`item.tickettype.name`]="props">
              <v-edit-dialog
                v-if="$isAdmin() || $isBiller()"
                ref="dialog"
                large
                cancel-text="Cancelar"
                save-text="Guardar"
                class="w-100"
                @save="saveTickettypeFromModal(props.item.id, props.item.tickettype.id, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
              >
                <v-chip
                  small
                  label
                  :color="getTicketTypeColor(props.item.tickettype.name)"
                  style="width: 100%;justify-content:center;"
                >
                  <h5>
                    {{ props.item.tickettype.name }}
                  </h5>
                </v-chip>
                <template v-slot:input>
                  <v-select
                    :value="props.item.tickettype"
                    item-text="name"
                    item-value="id"
                    :items="tickettypes"
                    return-object
                    single-line
                    label="Establecer tipo"
                    outlined
                    dense
                    @change="updateTickettypeFromModal(props.item.id, $event, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
                  />
                </template>
              </v-edit-dialog>
              <v-chip v-else small label :color="getTicketTypeColor(props.item.tickettype.name)" class="white--text">
                <h5>
                  {{ props.item.tickettype.name }}
                </h5>
              </v-chip>
            </template>
            <template v-slot:[`item.technician`]="props">
              <v-edit-dialog
                v-if="$isAdmin() || $isBiller()"
                ref="dialog"
                large
                cancel-text="Cancelar"
                save-text="Guardar"
                @save="saveAssignatedFromModal(props.item, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
              >
                <v-chip
                  small
                  label
                  color="white black--text"
                >
                  <h5>
                    {{ props.item.technician ? ucfirst(props.item.technician.username) : 'No Asignado' }}
                  </h5>
                </v-chip>
                <template v-slot:input>
                  <v-autocomplete
                    v-model="currentTechnician"
                    :value="props.item.technician"
                    item-text="username"
                    item-value="id"
                    :items="technicians"
                    return-object
                    auto-select-first
                    single-line
                    outlined
                    label="Asignar a Tecnico"
                    dense
                    @change="updateAssignatedFromModal(props.item.id, $event, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
                  />
                </template>
              </v-edit-dialog>
              <v-chip
                v-else
                small
                color="white black--text"
              >
                <h5>
                  {{ props.item.technician ? ucfirst(props.item.technician.username) : 'No Asignado' }}
                </h5>
              </v-chip>
            </template>
            <template v-slot:[`item.time`]="props">
              <v-edit-dialog
                v-if="$isAdmin() || $isBiller()"
                ref="dialogTime"
                large
                cancel-text="Cancelar"
                save-text="Guardar"
                @save="saveAssignatedFromModal(props.item, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
              >
                <v-chip
                  small
                  :color="props.item.technician ? props.item.technician.username === 'sistema' ? $vuetify.theme.dark ? 'green darken-2' : 'green darken-2 white--text' : 'primary' : $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1 black--text'"
                >
                  <h5>
                    {{ props.item.technician ? ucfirst(props.item.technician.username) : 'No Asignado' }}
                  </h5>
                </v-chip>
                <template v-slot:input>
                  <v-autocomplete
                    v-model="currentTechnician"
                    :value="props.item.technician"
                    item-text="username"
                    item-value="id"
                    :items="technicians"
                    return-object
                    auto-select-first
                    single-line
                    outlined
                    label="Asignar a Tecnico"
                    dense
                    @change="updateAssignatedFromModal(props.item.id, $event, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
                  />
                </template>
              </v-edit-dialog>
              <v-chip
                v-else
                small
                :color="props.item.technician ? props.item.technician.username === 'sistema' ? $vuetify.theme.dark ? 'green darken-2' : 'green darken-2 white--text' : 'primary' : $vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1 black--text'"
              >
                <h5>
                  {{ props.item.technician ? ucfirst(props.item.technician.username) : 'No Asignado' }}
                </h5>
              </v-chip>
            </template>
            <template v-slot:[`item.details`]="{ item }">
              <v-tooltip bottom max-width="400">
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    :class="$store.state.isDesktop ? 'text-truncate' : ''"
                    :style="$store.state.isDesktop ? 'width:100px;' : ''"
                    v-on="on"
                  >
                    {{ item.details }}
                  </div>
                </template>
                <span>{{ item.details }}</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.client.address`]="{ item }">
              <v-tooltip
                bottom
              >
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    style="max-width:180px;"
                    class="text-truncate"
                    v-on="on"
                  >
                    {{ processAddresses(item) }}
                  </div>
                </template>
                <span>{{ processAddresses(item) }}</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.client.neighborhood.name`]="{ item }">
              <strong>{{ processAddressesNeighborhood(item) }}</strong>
            </template>
            <template v-slot:[`item.client.code`]="props">
              <nuxt-link :to="`/clients/${props.item.client.code === 'C' ? props.item.client.id : props.item.client.code}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`" class="blue--text">
                <v-chip label outlined small>
                  {{ props.item.client.code }}
                </v-chip>
              </nuxt-link>
            </template>
            <template v-slot:[`item.client.balance`]="props">
              <v-chip
                v-if="props.item.client && props.item.client.offer && props.item.client.offer.price"
                small
                label
                outlined
                :to="`/billing/${props.item.client.code}?selected=${props.item.client.id}&city=${$route.query.city}&clienttype=${$route.query.clienttype}`"
              >
                ${{ Number(props.item.client.balance).toLocaleString('es') }}
              </v-chip>
              <v-chip
                v-else
                small
                label
              >
                {{ 'No definido' }}
              </v-chip>
            </template>
            <template v-slot:[`item.assignated.username`]="{ item }">
              <strong style="max-width:50px;"> {{ ucfirst(item.assignated.username) }}</strong>
            </template>
            <template v-slot:[`item.client.technology.name`]="props">
              {{ props.item.client.technology !== null ? props.item.client.technology.name : 'No reg.' }}
            </template>
            <template v-if="$store.state.isDesktop" v-slot:[`item.actions`]="{ item, index }">
              <div class="d-flex">
                <v-tooltip v-if="$isAdmin() || $isBiller()" top>
                  <template v-slot:activator="{ on: tooltip }">
                    <nuxt-link
                      :to="`/billing/${item.client.code}?selected=${item.client.id}&city=${$route.query.city}&clienttype=${$route.query.clienttype}`"
                    >
                      <v-btn
                        v-bind="attrs"
                        x-small
                        text
                        :color="$vuetify.theme.dark ? 'white' : 'primary'"
                        class="rounded-xl"
                        v-on="tooltip"
                      >
                        <v-icon>mdi-file-document-plus-outline</v-icon>
                      </v-btn>
                    </nuxt-link>
                  </template>
                  <span>Estado de cuenta</span>
                </v-tooltip>
                <CreateTicketAdvancev2
                  :ticket="item"
                  :ticketindex="index"
                  @updateTicketStatus="updateTicketStatus($event)"
                  @refreshTickets="initIntervalAndGetTickets()"
                />
                <MainClientStatus
                  v-if="clienttype === 'INTERNET'"
                  :name="item.client.name"
                  :clientid="item.client.id"
                  :code="item.client.code"
                  :role="$store.state.auth.allowed_components"
                />
                <MiscTicketHistory
                  :clientid="item.client.id"
                  :name="item.client.name"
                />
                <MiscTicketAdvanceHistory
                  :ticketid="item.id"
                  :name="item.client.name"
                />
                <MiscPhotoGallery :ticket="item" />
              </div>
            </template>
            <template v-slot:[`item.createdAt`]="{ item }">
              <div style="display:flex!important;flex-direction:column;">
                <span class="text-caption" style="white-space:nowrap;">
                  {{ getDate(item.createdAt) }}
                </span>
                <span style="line-height:1rem;" class="text-caption text--secondary">
                  {{ getHour(item.createdAt) }}
                </span>
              </div>
            </template>
          </v-data-table>
        </client-only>
      </v-col>
    </v-row>
    <v-row v-if="pageCount > 1">
      <v-col>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount" />
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-if="!$store.state.isDesktop"
      v-model="infoModal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title class="text-caption">
          Desconexion para cliente {{ editModalData.id }}
          <v-spacer />
          <v-btn icon @click="infoModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text
          class="d-flex flex-column px-2"
          style="height:calc(100vh - 128px);"
        >
          <div>
            <div
              class="elevation-5 rounded-xl py-2 px-4"
              :class="{ 'grey darken-3': isDarkTheme, 'white': !isDarkTheme }"
            >
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Tipo Ticket: </strong>{{ getTicketTypeName() }}
              </p>
              <nuxt-link :to="`/clients/${editModalData.client ? editModalData.client.code : ''}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`" class="blue--text">
                <strong>
                  <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold"><strong>Código: </strong>{{ getClientCode() }}</p>
                </strong>
              </nuxt-link>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Cliente: </strong>{{ getClientName() }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Direccion: </strong>{{ processAddresses(editModalData) }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Barrio: </strong>{{ processAddressesNeighborhood(editModalData) }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Celular: </strong><a :href="getClientPhoneLink()"><strong>{{ getClientPhone() }}</strong></a>
              </p>
              <p v-if="isInternetClient" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Tecnología: </strong>{{ getClientTechnologyName() }}
              </p>
              <p v-if="isInternetClient" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Nap: </strong>
                <v-chip label color="green">
                  {{ getClientNapCode() }}
                </v-chip>
              </p>
              <p v-if="isInternetClient" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Potencia Óptica: </strong>{{ getClientOpticalPower() }}
              </p>
              <p v-if="isTelevisionClient" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                TV: {{ getTvSpecProperty('tvs') }}
              </p>
              <p v-if="isTelevisionClient" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                Altos: {{ getTvSpecProperty('high') }}
              </p>
              <p v-if="isTelevisionClient" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                Bajos: {{ getTvSpecProperty('down') }}
              </p>
              <p v-if="isTelevisionClient" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                Calidad: {{ getTvSpecTypeName() }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Avance: </strong><code>{{ editModalData ? editModalData.details : '' }}</code>
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                <strong>Creado por: </strong>{{ getAssignatedUsername() }}
              </p>
              <span class="pb-0 mb-0 text-subtitle-1 font-weigth-bold">
                {{ getDate(editModalData ? editModalData.createdAt : '') }}
              </span>
              <span class="pb-0 mb-0 text-subtitle-1 font-weigth-bold text--secondary">
                {{ getHour(editModalData ? editModalData.createdAt : '') }}
              </span>
            </div>
          </div>
          <div
            v-if="editModalData.client !== undefined"
            style="
              display:grid;
              grid-template-rows: 1fr 1fr 1fr 1fr;
              row-gap: 10px;
            "
            class="mt-2"
          >
            <DxOperations
              :type="'DX REALIZADA'"
            />
            <DxOperations
              :type="'DX POSTPUESTA'"
            />
            <DxOperations
              :type="'PAGO EN OFICINA'"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Tickets',
  data () {
    return {
      key: 0,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      alertBox: false,
      dialog: false,
      dialogEdit: false,
      initialLoading: false,
      showClosedValue: false,
      showRetired: false,
      refreshLoading: false,
      isDesktop: false,
      editModalData: {},
      infoModal: false,
      singleExpand: true,
      selected: [],
      interval: null,
      currentTechnician: null,
      view: 'TODOS',
      types: ['TODOS', 'RV', 'CX', 'TR', 'DX']
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.auth.cities ? this.$store.state.auth.cities.find(c => c.id == this.$route.query.city) : ''
    },
    tickets () {
      return this.$store.state.ticket.tickets.filter(t => t.client !== null)
    },
    expanded () {
      return this.$store.state.ticket.tickets.filter(t => t.client !== null)
    },
    ticketList () {
      return this.$store.state.ticket.ticketList.filter(t => t.client !== null)
    },
    headers () {
      return this.$store.state.ticket.headers
    },
    clienttype () {
      return this.$route.query.clienttype
    },
    tickettypes () {
      return this.$store.state.ticket.tickettypes
    },
    technicians () {
      return this.$store.state.operator.operators
    },
    clientWidth () {
      return this.$store.state.clientWidth
    },
    isInternetClient () {
      return this.$route.query.clienttype === 'INTERNET'
    },
    isTelevisionClient () {
      return this.$route.query.clienttype === 'TELEVISION'
    },
    isDarkTheme () {
      return this.$vuetify.theme.dark
    },
    getHeadersByClienttype () {
      return this.$route.query.clienttype === 'INTERNET' ? this.$store.state.isDesktop ? [
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name', width: 80 },
        { text: 'Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Barrio', sortable: false, value: 'client.neighborhood.name' },
        { text: 'Dirección', sortable: false, value: 'client.address', width: 180 },
        { text: 'Código', sortable: false, value: 'client.code', width: 50 },
        { text: 'Cliente', sortable: false, value: 'client.name', width: 200 },
        { text: 'Celular', sortable: false, value: 'client.phone', width: 80 },
        { text: 'Saldo', sortable: false, value: 'client.balance', width: 80 },
        { text: 'Tec.', sortable: false, value: 'client.technology.name', width: 50 },
        { text: 'Por', sortable: false, value: 'assignated.username', width: 40 },
        { text: 'Creación', sortable: false, value: 'createdAt', width: 100 },
        { text: 'Acciones', sortable: false, value: 'actions' }
      ] : [
        { text: 'Cliente', sortable: false, value: 'client.name' },
        { text: 'Estado', sortable: false, value: 'active', width: '5%', hide: 'd-none d-lg-table-cell' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name', width: 100 },
        { text: 'Barrio', sortable: false, value: 'client.neighborhood.name', width: 150 },
        { text: 'Dirección', sortable: false, value: 'client.address', width: 180 }
      ] : this.$store.state.isDesktop ? [
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name', width: 80 },
        { text: 'Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Barrio', sortable: false, value: 'client.neighborhood.name', width: 150 },
        { text: 'Dirección', sortable: false, value: 'client.address', width: 150 },
        { text: 'Codigo', sortable: false, value: 'client.code', width: 60 },
        { text: 'Cliente', sortable: false, value: 'client.name' },
        { text: 'Celular', sortable: false, value: 'client.phone' },
        { text: 'Saldo', sortable: false, value: 'client.balance', width: 80 },
        { text: 'Por', sortable: false, value: 'assignated.username' },
        { text: 'Creado el', sortable: false, value: 'createdAt' },
        { text: 'Acciones', sortable: false, value: 'actions' }
      ] : [
        { text: 'Cliente', sortable: false, value: 'client.name' },
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name' },
        { text: 'Barrio', sortable: false, value: 'client.neighborhood.name' },
        { text: 'Dirección', sortable: false, value: 'client.address', width: 180 }
      ]
    }
  },
  watch: {
    $route () {
      this.initIntervalAndGetTickets()
      this.getTickettypes()
    }
  },
  mounted () {
    this.getTickettypes()
    this.getTechnicians()
    this.initIntervalAndGetTickets()
  },
  destroyed () {
    this.removeOldIntervalIfExists()
  },
  methods: {
    async initIntervalAndGetTickets () {
      this.removeOldIntervalIfExists()
      this.setGetTicketsInterval()
      this.resetSelected()
      await this.refreshTickets()
      this.getViewFromLocalStorage()
    },
    removeOldIntervalIfExists () {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    setGetTicketsInterval () {
      this.interval = setInterval(async () => {
        this.resetSelected()
        await this.refreshTickets()
        this.getViewFromLocalStorage()
      }, 60000)
    },
    async refreshTickets () {
      this.initialLoading = true
      await this.$store.dispatch('ticket/getTicketsFromDatabase', { city: this.$route.query.city, clienttype: this.clienttype, token: this.$store.state.auth.token, active: this.showClosedValue, retired: this.showRetired })
      this.initialLoading = false
    },
    getViewFromLocalStorage () {
      const view = window.localStorage.getItem('view')
      if (view) {
        this.changeView(view)
      } else {
        this.changeView('TODOS')
      }
    },
    changeView (view) {
      window.localStorage.setItem('view', view)
      this.$router.push({ query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype, view } })
      this.$store.commit('ticket/changeView', view)
    },
    calculateQuantity (type) {
      switch (type) {
        case 'RV':
          return this.tickets.filter(ticket => ticket.tickettype.name !== 'CONEXION NUEVA' && ticket.tickettype.name !== 'DERIVADO' && ticket.tickettype.name !== 'RECONEXION' && ticket.tickettype.name !== 'REINSTALACION' && ticket.tickettype.name !== 'TRASLADO' && ticket.tickettype.name !== 'CAMBIO DE ACOMETIDA' && ticket.tickettype.name !== 'DX VOLUNTARIA' && ticket.tickettype.name !== 'DX POR MORA').length
        case 'TR':
          return this.tickets.filter(ticket => ticket.tickettype.name === 'TRASLADO' || ticket.tickettype.name === 'CAMBIO DE LUGAR DE ACOMETIDA' || ticket.tickettype.name === 'CAMBIO DE LUGAR PUNTO DE TV' || ticket.tickettype.name === 'CAMBIO DE LUGAR ROUTER' || ticket.tickettype.name === 'CAMBIO DE LUGAR EQUIPO').length
        case 'CX':
          return this.tickets.filter(ticket => ticket.tickettype.name === 'CONEXION NUEVA' || ticket.tickettype.name === 'RECONEXION' || ticket.tickettype.name === 'REINSTALACION' || ticket.tickettype.name === 'DERIVADO' || ticket.tickettype.name === 'CONEXION NUEVA' || ticket.tickettype.name === 'CAMBIO DE ACOMETIDA').length
        case 'DX':
          return this.tickets.filter(ticket => ticket.tickettype.name === 'DX POR MORA' || ticket.tickettype.name === 'DX VOLUNTARIA').length
        case 'TODOS':
          return this.tickets.filter(ticket => ticket.tickettype.name !== 'DX POR MORA' && ticket.tickettype.name !== 'DX VOLUNTARIA').length
        default:
          return 0
      }
    },
    testPlanDx (client) {
      return client.indebt || !client.active
    },
    updateTickettypeFromModal (id, tickettype, index) {
      this.$store.commit('ticket/updateTickettype', { id, tickettype, index })
    },
    saveTickettypeFromModal (ticketid, tickettypeid, index) {
      this.$store.dispatch('ticket/saveTickettype', { ticketid, tickettypeid, index, token: this.$store.state.auth.token })
    },
    updateAssignatedFromModal (id, technician, index) {
      if (this.currentTechnician.telegramchatid) {
        this.$store.commit('ticket/updateAssignated', { id, technician, index })
      }
    },
    saveAssignatedFromModal (ticket, index) {
      if (this.currentTechnician.telegramchatid && this.currentTechnician.phone) {
        this.$store.dispatch('ticket/saveAssignated', {
          ticketid: ticket.id,
          technicianid: this.currentTechnician,
          index,
          token: this.$store.state.auth.token
        })
        // this.$simpleTelegramSendToChat({
        //   client: ticket.client,
        //   tickettype: ticket.tickettype.name,
        //   details: ticket.details,
        //   neighborhood: ticket.client.neighborhood,
        //   operator: this.$store.state.auth.username,
        //   user: this.currentTechnician,
        //   telegramBots: this.telegramBots
        // })
        this.$simpleWhatsappSendToChat({
          tickettype: ticket.tickettype.name,
          client: ticket.client,
          user: this.currentTechnician,
          token: this.$config.META_TOKEN
        })
        this.currentTechnician = {}
      } else {
        this.$toast.error('El técnico no tiene un chat de telegram asociado o un numero de telefono de whatsapp valido', { duration: 5000 })
      }
    },
    getTickettypes () {
      this.$store.dispatch('ticket/getTickettypes', {
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        token: this.$store.state.auth.token
      })
    },
    async getTechnicians () {
      await this.$store.dispatch('operator/getOperatorList', {
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        token: this.$store.state.auth.token
      })
    },
    resetSelected () {
      this.selected = []
    },
    updateTicketStatus ({ editindex, closeTicket }) {
      this.$store.commit('ticket/updateTicketStatus', { editindex, closeTicket })
      this.refreshTickets()
      this.infoModal = false
    },
    copyToClipboard (component, text) {
      navigator.clipboard.writeText(text)
      this.$toast.info(`${component} Copiado al portapapeles!`, { duration: 2000 })
    },
    showOnlyNameAndSecondName (name) {
      const nameArray = name.split(' ')
      if (nameArray.length > 3) {
        return nameArray[0] + ' ' + nameArray[2] + ' ' + nameArray[3]
      } else {
        return name
      }
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      return humanDateFormat
    },
    getHour (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true })
      return humanDateFormat
    },
    getTicketTypeColor (tickettype) {
      if (tickettype === 'SIN SERVICIO' || tickettype === 'SIN SEÑAL' || tickettype === 'DX POR MORA') {
        return 'red white--text'
      } else if (tickettype === 'SERVICIO LENTO' || tickettype === 'SEÑAL LLUVIOSA' || tickettype === 'TV DESPROGRAMADO' || tickettype === 'DX VOLUNTARIA') {
        return 'orange darken-2'
      } else if (tickettype === 'INTERMITENCIA') {
        return 'orange darken-4'
      } else if (tickettype === 'CONEXION NUEVA') {
        return 'green darken-2'
      } else {
        return 'primary'
      }
    },
    processAddresses ({ client }) {
      if (!client) { return 'Sin Direccion' }
      const address = client?.address
      const addresses = client?.addresses
      if (!address && !addresses) { return 'Sin Dirección' }
      if (address && !addresses) { return client.address }
      if (address && addresses.length > 0) { return addresses.at(-1).address }
      if (!address && addresses.length > 0) { return addresses.at(-1).address }
    },
    processAddressesNeighborhood ({ client }) {
      if (!client) { return 'Sin Barrio' }
      const addresses = client.addresses
      const neighborhood = client.neighborhood
      if (!neighborhood && !addresses) { return 'Sin Barrio' }
      if (neighborhood && !addresses) { return neighborhood.name }
      if (neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
      if (!neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (!neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
    },
    getTicketTypeName () {
      return this.editModalData.tickettype ? this.editModalData.tickettype.name : ''
    },
    getClientCode () {
      return this.editModalData.client ? this.editModalData.client.code : ''
    },
    getClientName () {
      return this.editModalData.client ? this.editModalData.client.name : ''
    },
    getClientPhone () {
      return this.editModalData.client ? this.editModalData.client.phone : ''
    },
    getClientPhoneLink () {
      return `tel:${this.getClientPhone()}`
    },
    getClientTechnologyName () {
      return this.editModalData.client && this.editModalData.client.technology ? this.editModalData.client.technology.name : 'No Reg.'
    },
    getClientNapCode () {
      return this.editModalData.client && this.editModalData.client.naps.length > 0 ? this.editModalData.client.naps[0].code : 'No Reg.'
    },
    getClientOpticalPower () {
      return this.editModalData.client && this.editModalData.client.opticalpower ? this.editModalData.client.opticalpower : 'No reg.'
    },
    getTvSpecProperty (prop) {
      return this.editModalData.client && this.editModalData.client.tvspec ? this.editModalData.client.tvspec[prop] : 'No reg.'
    },
    getTvSpecTypeName () {
      return this.editModalData.client && this.editModalData.client.tvspec && this.editModalData.client.tvspec.tvspectype ? this.editModalData.client.tvspec.tvspectype.name : ''
    },
    getAssignatedUsername () {
      return this.editModalData.assignated ? this.ucfirst(this.editModalData.assignated.username) : ''
    },
    getColor (state, answered, escalated, escalatedoffice) {
      if (state && !answered) {
        return 'blue darken-4'
      } else if (answered && state && !escalated && !escalatedoffice) {
        return 'orange darken-4'
      } else if (answered && state && escalated) {
        return 'purple darken-4'
      } else if (answered && state && !escalated && escalatedoffice) {
        return 'green darken-4'
      } else {
        return 'red'
      }
    },
    getState (state, answered, escalated, escalatedoffice) {
      if (state && !answered) {
        return 'ABIERTO'
      } else if (answered && state && !escalated && !escalatedoffice) {
        return 'RESPOND.'
      } else if (answered && state && escalated) {
        return 'ESCALADO'
      } else if (answered && state && !escalated && escalatedoffice) {
        return 'OFICINA'
      } else {
        return 'CERRADO'
      }
    },
    showTicketInfo (event) {
      event.item.editindex = event.index
      Object.assign(this.editModalData, event.item)
      this.infoModal = true
    },
    comprobeCity () {
      const recordedCity = localStorage.getItem('currentCity')
      const currentCity = this.$route.query.city
      if (currentCity !== recordedCity) {
        this.$store.dispatch('refreshTickets', { city: currentCity, limit: 50 })
      }
    },
    ucfirst (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>

<style>
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
    font-size: 12px;
  }
  a {
    text-decoration: none;
  }
  @media print {
  .no-printme {
    display: none !important;
  }
  .printme {
    display: block;
  }
  .ticket-row {
    background-color: red;
  }
}
.theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:last-child, .theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:last-child {
    border-bottom: none !important;
}
.v-small-dialog__activator__content {
  width: 100% !important;;
}
.parent-with-gallery-desktop {
  display: grid;
  grid-template-columns: auto auto minmax(400px, 2fr);
  grid-gap: 10px;
  place-items: start;
  align-items: center;
}
.parent-with-gallery-mobile {
  display: grid;
  grid-template-columns: auto auto minmax(50px, 2fr);
  grid-gap: 10px;
  place-items: start;
  align-items: center;
}
.parent-no-gallery {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  place-items: start;
  align-items: center;
}
</style>
