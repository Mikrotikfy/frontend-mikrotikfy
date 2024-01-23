<template>
  <v-container fluid class="no-printme">
    <v-row>
      <v-col
        cols="12"
      >
        <v-card
          fluid
          class="rounded-lg elevation-0 transparent"
        >
          <v-card-text
            v-if="$store.state.isDesktop"
            class="pa-1 d-flex align-center"
          >
            <v-col cols="auto" class="pa-0">
              <v-select
                v-model="selectedCity"
                :items="cities"
                label="Filtrar Ciudad"
                item-value="id"
                item-text="name"
                return-object
                dense
                solo
                rounded
                hide-details="auto"
                class="mr-2 elevation-0"
                style="width:180px;"
                @change="changeCity(selectedCity)"
              >
                <template v-slot:item="{ item }">
                  {{ item.name }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="auto" class="pa-0">
              <v-select
                v-model="selectedClienttype"
                :items="clienttypes"
                label="Filtrar Servicio"
                item-value="id"
                item-text="name"
                return-object
                dense
                solo
                rounded
                hide-details="auto"
                class="mr-2 elevation-0"
                style="width:180px;"
                @change="changeType(selectedClienttype)"
              >
                <template v-slot:item="{ item }">
                  {{ item.name }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="auto" class="pa-0">
              <v-select
                v-model="selectedType"
                :items="types"
                label="Filtrar por Tickets"
                dense
                solo
                rounded
                hide-details="auto"
                class="mr-2 elevation-0"
                style="width:200px;"
                @change="changeView(selectedType)"
              >
                <template v-slot:item="{ item }">
                  {{ calculateQuantity(item) }} {{ item }}
                </template>
              </v-select>
            </v-col>
            <v-spacer />
            <v-btn
              dark
              icon
              :disabled="initialLoading"
              :loading="initialLoading"
              @click="initIntervalAndGetTickets()"
            >
              <v-icon>mdi-reload</v-icon>
            </v-btn>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    mdi-list-status
                  </v-icon>
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
            <v-tooltip bottom max-width="400">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="copyToClipboard(getTicketTypesAndCountThemByType(ticketList))"
                >
                  <v-icon>mdi-information-outline</v-icon>
                </v-btn>
              </template>
              <span
                v-for="type in getTicketTypesAndCountThemByType(ticketList)"
                :key="type.name"
              >
                {{ type.name }}: {{ type.count }}<br>
              </span>
            </v-tooltip>
            <MiscPrintTicket
              v-if="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && $store.state.isDesktop"
              :tickets="selected"
            />
            <MiscPrintOrder
              v-if="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && $store.state.isDesktop"
              :tickets="selected"
            />
            <MiscCreateBulkTickets v-if="$store.state.isDesktop && selected.length < 1" @endProcess="initIntervalAndGetTickets" />
            <MiscCloseBulkTickets v-if="$store.state.isDesktop && selected.length > 0" :selected="selected" @endProcess="initIntervalAndGetTickets" />
          </v-card-text>
          <v-card-text v-else class="pa-0">
            <v-container>
              <v-row>
                <v-col cols="6" class="pa-0">
                  <v-select
                    v-model="selectedCity"
                    :items="cities"
                    label="Filtrar Ciudad"
                    item-value="id"
                    item-text="name"
                    return-object
                    dense
                    solo
                    rounded
                    hide-details="auto"
                    class="mr-2 elevation-0"
                    @change="changeCity(selectedCity)"
                  >
                    <template v-slot:item="{ item }">
                      {{ item.name }}
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="6" class="pa-0">
                  <v-select
                    v-model="selectedClienttype"
                    :items="clienttypes"
                    label="Filtrar Servicio"
                    item-value="id"
                    item-text="name"
                    return-object
                    dense
                    solo
                    rounded
                    hide-details="auto"
                    class="elevation-0"
                    @change="changeType(selectedClienttype)"
                  >
                    <template v-slot:item="{ item }">
                      {{ item.name }}
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row class="mt-6 justify-center">
                <v-slide-group>
                  <v-slide-item
                    v-for="type in types"
                    :key="type"
                  >
                    <v-btn
                      class="black--text rounded-xl mr-2 elevation-0"
                      :class="type === $route.query.view ? 'white black--text' : $vuetify.theme.dark ? 'grey darken-1' : 'grey lighten-2'"
                      small
                      @click="changeView(type)"
                    >
                      {{ calculateQuantity(type) }} {{ type }}
                    </v-btn>
                  </v-slide-item>
                </v-slide-group>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-0 pt-0">
      <v-col>
        <div v-if="errors > 0" class="d-flex justify-center align-center">
          <p class="mt-5">
            Error al cargar los tickets. Intenta de nuevo.
          </p>
          <v-btn
            dark
            icon
            :disabled="initialLoading"
            :loading="initialLoading"
            @click="initIntervalAndGetTickets()"
          >
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </div>
        <client-only v-else>
          <v-data-table
            :key="key"
            v-model="selected"
            :show-select="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && $store.state.isDesktop ? true : false"
            :headers="getHeadersByClienttype"
            :items="ticketList"
            :search="search"
            :items-per-page="itemsPerPage"
            :expanded="expanded"
            :loading="initialLoading"
            class="rounded-lg"
            :caption="$route.query.clienttype === 'INTERNET' ? 'Tickets de Internet' : 'Tickets de Televisión'"
            sort-by="createdAt"
            calculate-widths
            sort-desc
            no-data-text="No hay Tickets abiertos aún..."
            loading-text="Cargando información de tickets..."
            hide-default-footer
            mobile-breakpoint="100"
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
                @save="saveTickettypeFromModal(props.item.id, props.item.tickettype.id, props.index)"
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
                  <v-autocomplete
                    :value="props.item.tickettype"
                    item-text="name"
                    item-value="id"
                    :items="tickettypes"
                    return-object
                    single-line
                    auto-select-first
                    label="Establecer tipo"
                    outlined
                    dense
                    @change="updateTickettypeFromModal(props.item.id, $event, props.index)"
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
                :id="props.index"
                ref="dialog"
                large
                cancel-text="Cancelar"
                save-text="Guardar"
                @save="saveAssignatedFromModal(props.item, props.index)"
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
                    @change="updateAssignatedFromModal(props.item.id, $event, props.index)"
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
            <template v-slot:[`item.service.neighborhood`]="{ item }">
              <strong>{{ item.service.neighborhood }}</strong>
            </template>
            <template v-slot:[`item.service.code`]="props">
              <nuxt-link :to="`/client/${props.item.service.normalized_client.id}?city=${$route.query.city}&clienttype=${$route.query.clienttype}&service=${props.item.service.id}`" class="blue--text">
                <v-chip label outlined small>
                  {{ props.item.service.code }}
                </v-chip>
              </nuxt-link>
            </template>
            <template v-slot:[`item.service.balance`]="props">
              <v-chip
                v-if="props.item.service && props.item.service.offer && props.item.service.offer.price"
                small
                label
                outlined
                :to="`/billing/${props.item.service.id}`"
              >
                ${{ Number(props.item.service.balance).toLocaleString('es') }}
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
            <template v-slot:expanded-item="{ item }">
              <td
                :colspan="$route.query.clienttype === 'INTERNET' ? '14' : '13'"
                class="mb-4"
              >
                <div v-if="item.media" :class="$store.state.isDesktop ? 'parent-with-gallery-desktop' : 'parent-with-gallery-mobile'">
                  <v-chip small label outlined class="mr-4">
                    Avances
                  </v-chip>
                  <span class="font-weight-bold">
                    {{ item.details }}
                  </span>
                  <MiscPhotoGalleryPreview
                    :ticket="item"
                  />
                </div>
                <div v-else class="parent-no-gallery">
                  <v-chip small label outlined class="mr-4">
                    Avances
                  </v-chip>
                  <span class="font-weight-bold">
                    {{ item.details }}
                  </span>
                </div>
              </td>
            </template>
            <template v-if="$store.state.isDesktop" v-slot:[`item.actions`]="{ item }">
              <div class="d-flex">
                <CreateTicketAdvancev2
                  :ticketid="item.id"
                />
                <MainClientStatus
                  v-if="selectedClienttype.name === 'INTERNET'"
                  :name="item.service.normalized_client.name"
                  :clientid="item.service.id"
                  :code="item.service.code"
                />
                <MiscTicketHistory
                  :service="item.service"
                />
                <MiscTicketAdvanceHistory
                  :ticketid="item.id"
                  :name="item.service.name"
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
    <v-row v-if="pagination.pageCount > 1">
      <v-col>
        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :disabled="initialLoading"
            :length="pagination.pageCount"
            @input="initIntervalAndGetTickets"
          />
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
        <v-card-title>
          Información de Ticket {{ editModalData.id }}
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
              :class="$vuetify.theme.dark ? 'grey darken-3' : 'white'"
            >
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Tipo Ticket: </strong>{{ editModalData.tickettype ? editModalData.tickettype.name : '' }}
              </p>
              <nuxt-link :to="`/client/${editModalData.service ? editModalData.service.normalized_client.id : ''}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`" class="blue--text">
                <strong>
                  <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1"><strong>Código: </strong>{{ editModalData.service ? editModalData.service.code : '' }}</p>
                </strong>
              </nuxt-link>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Cliente: </strong>{{ editModalData.service ? editModalData.service.normalized_client.name : '' }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Direccion: </strong>{{ editModalData.service ? editModalData.service.address : '' }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Barrio: </strong>{{ editModalData.service ? editModalData.service.neighborhood : '' }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Celular: </strong><a :href="`tel:${editModalData.service ? editModalData.service.normalized_client.phone : ''}`"><strong>{{ editModalData.service ? editModalData.service.normalized_client.phone : '' }}</strong></a>
              </p>
              <p v-if="$route.query.clienttype === 'INTERNET'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Tecnología: </strong>{{ editModalData.service ? editModalData.service.technology ? editModalData.service.technology.name : 'No Reg.' : '' }}
              </p>
              <p v-if="$route.query.clienttype === 'INTERNET'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Nap: </strong>
                <v-chip label color="green">
                  {{ editModalData.service ? editModalData.service.naps.length > 0 ? `${editModalData.service.naps[0].code} - ${editModalData.service.naps[0].address}` : 'No Reg.' : '' }}
                </v-chip>
              </p>
              <p v-if="$route.query.clienttype === 'INTERNET'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Potencia Óptica: </strong>{{ editModalData.service && editModalData.service.opticalpower ? editModalData.service.opticalpower : 'No reg.' }}
              </p>

              <p v-if="$route.query.clienttype === 'TELEVISION'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                TV: {{ editModalData.service && editModalData.service.tvspec ? editModalData.service.tvspec.tvs : 'No reg.' }}
              </p>

              <p v-if="$route.query.clienttype === 'TELEVISION'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                Altos: {{ editModalData.service && editModalData.service.tvspec ? editModalData.service.tvspec.high : '' }}
              </p>

              <p v-if="$route.query.clienttype === 'TELEVISION'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                Bajos: {{ editModalData.service && editModalData.service.tvspec ? editModalData.service.tvspec.down : '' }}
              </p>

              <p v-if="$route.query.clienttype === 'TELEVISION'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                Calidad: {{ editModalData.service && editModalData.service.tvspec && editModalData.service.tvspec.tvspectype ? editModalData.service.tvspec.tvspectype.name : '' }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Avance: </strong><code>{{ editModalData ? editModalData.details : '' }}</code>
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Creado por: </strong>{{ editModalData.assignated ? ucfirst(editModalData.assignated.username) : '' }}
              </p>
              <span class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                {{ getDate(editModalData ? editModalData.createdAt : '') }}
              </span>
              <span class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1 text--secondary">
                {{ getHour(editModalData ? editModalData.createdAt : '') }}
              </span>
              <v-expansion-panels v-if="editModalData.signed">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    Firma del Cliente
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="white">
                      {{ `${$config.CDN_STRAPI_ENDPOINT}${editModalData.signature}` }}
                      <v-img
                        :src="`${$config.CDN_STRAPI_ENDPOINT}${editModalData.signature}`"
                        aspect-ratio="1"
                        contain
                        style="transform: rotateZ(-90deg);"
                        :width="clientWidth - 200"
                      />
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <p v-else class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                Ticket no firmado por usuario aun...
              </p>
            </div>
          </div>
          <div
            v-if="editModalData.service !== undefined"
            style="
              display:grid;
              grid-template-rows: 1fr 1fr 1fr 1fr;
              row-gap: 10px;
            "
            class="mt-2"
          >
            <CreateTicketAdvancev2
              :ticketid="editModalData.id"
              :block="true"
            />
            <MainClientStatus
              v-if="$route.query.clienttype === 'INTERNET'"
              :block="true"
              :name="editModalData.service.name"
              :clientid="editModalData.service.id"
              :code="editModalData.service.code"
            />
            <MiscTicketAdvanceHistory
              :block="true"
              :ticketid="editModalData.id"
              :name="editModalData.service.normalized_client.name"
            />
            <MiscTicketHistory
              :service="editModalData.service"
              :name="editModalData.service.name"
              :block="true"
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
      types: ['TODOS', 'RV', 'CX', 'TR', 'DX'],
      selectedType: 'TODOS',
      selectedCity: null,
      selectedClienttype: null
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.auth.cities ? this.$store.state.auth.cities.find(c => c.id == this.$route.query.city) : ''
    },
    errors () {
      return this.$store.state.ticket.errors
    },
    tickets () {
      return this.$store.state.ticket.tickets.filter(t => t.service !== null)
    },
    expanded () {
      return this.$store.state.ticket.tickets.filter(t => t.service !== null)
    },
    ticketList () {
      return this.$store.state.ticket.ticketList.filter(t => t.service !== null)
    },
    headers () {
      return this.$store.state.ticket.headers
    },
    clienttypes () {
      return this.$store.state.auth.clienttypes
    },
    cities () {
      return this.$store.state.auth.cities
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
    pagination () {
      return this.$store.state.ticket.pagination
    },
    getHeadersByClienttype () {
      return this.$route.query.clienttype === 'INTERNET' ? this.$store.state.isDesktop ? [
        { text: '#', sortable: false, value: 'id', width: 50 },
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name', width: 80 },
        { text: 'Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Barrio', sortable: false, value: 'service.neighborhood' },
        { text: 'Dirección', sortable: false, value: 'service.address', width: 180 },
        { text: 'Código', sortable: false, value: 'service.code', width: 50 },
        { text: 'Cliente', sortable: false, value: 'service.normalized_client.name', width: 200 },
        { text: 'Celular', sortable: false, value: 'service.normalized_client.phone', width: 80 },
        { text: 'Por', sortable: false, value: 'assignated.username', width: 40 },
        { text: 'Creación', sortable: false, value: 'createdAt', width: 100 },
        { text: 'Acciones', sortable: false, value: 'actions' }
      ] : [
        { text: 'Estado', sortable: false, value: 'active', width: '5%', hide: 'd-none d-lg-table-cell' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name', width: 100 },
        { text: 'Técnico Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Barrio', sortable: false, value: 'service.neighborhood', width: 150 },
        { text: 'Dirección', sortable: false, value: 'service.address', width: 180 },
        { text: 'Cliente', sortable: false, value: 'service.normalized_client.name' }
      ] : this.$store.state.isDesktop ? [
        { text: '#', sortable: false, value: 'id', width: 50 },
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name', width: 80 },
        { text: 'Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Barrio', sortable: false, value: 'service.neighborhood', width: 150 },
        { text: 'Dirección', sortable: false, value: 'service.address', width: 150 },
        { text: 'Codigo', sortable: false, value: 'service.code', width: 60 },
        { text: 'Cliente', sortable: false, value: 'service.normalized_client.name' },
        { text: 'Celular', sortable: false, value: 'service.normalized_client.phone' },
        { text: 'Por', sortable: false, value: 'assignated.username' },
        { text: 'Creado el', sortable: false, value: 'createdAt' },
        { text: 'Acciones', sortable: false, value: 'actions' }
      ] : [
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name' },
        { text: 'Técnico Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Barrio', sortable: false, value: 'service.neighborhood' },
        { text: 'Dirección', sortable: false, value: 'service.address', width: 180 },
        { text: 'Cliente', sortable: false, value: 'service.normalized_client.name' }
      ]
    }
  },
  watch: {
    page () {
      this.changeView('TODOS')
    },
    $route () {
      this.page = 1
      this.initIntervalAndGetTickets()
      this.getTickettypes()
    },
    '$store.state.ticket.refresh' () {
      this.initIntervalAndGetTickets()
    }
  },
  mounted () {
    this.setQueryCity()
    this.setSelectedClienttype()
    this.getTickettypes()
    this.getTechnicians()
    if (this.$store.state.isDesktop) {
      this.initIntervalAndGetTickets()
    } else {
      this.getTicketsWithoutInterval()
    }
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
    async getTicketsWithoutInterval () {
      this.removeOldIntervalIfExists()
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
      this.interval = setInterval(() => {
        this.resetSelected()
        this.refreshTickets()
        this.getViewFromLocalStorage()
      }, 60000)
    },
    async refreshTickets () {
      this.initialLoading = true
      await this.$store.dispatch('ticket/getTicketsFromDatabase', { tickettype: this.selectedType.name, city: this.selectedCity.name, clienttype: this.selectedClienttype.name, token: this.$store.state.auth.token, active: this.showClosedValue, retired: this.showRetired, page: this.page })
      this.initialLoading = false
    },
    setQueryCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    setSelectedClienttype () {
      if (this.$route.query.clienttype) {
        this.selectedClienttype = this.$store.state.auth.clienttypes.find(c => c.name === this.$route.query.clienttype)
      }
    },
    getViewFromLocalStorage () {
      const view = window.localStorage.getItem('view')
      if (view) {
        this.changeView(view)
      } else {
        this.changeView('TODOS')
      }
    },
    changeCity (city) {
      this.$router.replace({ query: { city: city.name, clienttype: this.$route.query.clienttype, view: this.$route.query.view } })
    },
    changeType (clienttype) {
      this.$router.replace({ query: { city: this.$route.query.city, clienttype: clienttype.name, view: this.$route.query.view } })
    },
    changeView (view) {
      window.localStorage.setItem('view', view)
      this.$router.push({ query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype, view } })
      this.$store.commit('ticket/changeView', view)
      this.selectedType = view
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
    async saveTickettypeFromModal (ticketid, tickettypeid, index) {
      await this.$store.dispatch('ticket/saveTickettype', { ticketid, tickettypeid, index, token: this.$store.state.auth.token })
      this.$store.commit('ticket/refresh')
    },
    updateAssignatedFromModal (id, technician, index) {
      this.$store.commit('ticket/updateAssignated', { id, technician, index })
    },
    saveAssignatedFromModal (ticket, index) {
      if (this.currentTechnician.telegramchatid && this.currentTechnician.phone) {
        this.$store.dispatch('ticket/saveAssignated', {
          ticketid: ticket.id,
          technicianid: this.currentTechnician,
          index,
          token: this.$store.state.auth.token
        })
        this.$simpleWhatsappSendToChat({
          tickettype: ticket.tickettype.name,
          service: ticket.service,
          user: this.currentTechnician,
          token: this.$config.META_TOKEN
        })
        this.currentTechnician = null
        setTimeout(() => {
          this.$store.commit('ticket/refresh')
        }, 500)
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
    copyToClipboard (text) {
      const formated = text.map(item => `${item.name} ${item.count}`).join('\n')
      navigator.clipboard.writeText(formated)
      this.$toast.success('Copiado al portapapeles', { duration: 5000 })
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
    },
    getTicketTypesAndCountThemByType (tickets) {
      const ticketTypes = []
      tickets.forEach((ticket) => {
        ticketTypes.push(ticket.tickettype.name)
      })
      const ticketTypesCounted = ticketTypes.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1
        return acc
      }, {})
      const formatedTicketTypesCounted = []
      for (const [key, value] of Object.entries(ticketTypesCounted)) {
        formatedTicketTypesCounted.push({ name: key, count: value })
      }
      return formatedTicketTypesCounted
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
