<template>
  <v-row>
    <v-col
      v-for="mikrotik in data"
      :key="mikrotik.name"
      cols="12"
      xl="6"
      lg="6"
      md="6"
      sm="12"
      sx="12"
    >
      <v-card
        elevation="5"
        max-width="95%"
        class="my-5 mx-auto"
        shaped
      >
        <v-card-title>
          {{ mikrotik.name }}
        </v-card-title>
        <v-card-subtitle>
          Detalles de la Mikrotik
        </v-card-subtitle>
        <v-card-text>
          <v-list two-line>
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ mikrotik.cpu }}%</v-list-item-title>
                    <v-list-item-subtitle>Uso de CPU</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ formatBytes(mikrotik.memory) }}</v-list-item-title>
                    <v-list-item-subtitle>Memoria Libre</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ formatBytes(mikrotik.freehddspace) }}</v-list-item-title>
                    <v-list-item-subtitle>Espacio libre del disco</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ mikrotik.version }}</v-list-item-title>
                    <v-list-item-subtitle>Versión de RouterOS</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ mikrotik.buildtime }}</v-list-item-title>
                    <v-list-item-subtitle>Fecha de compilación</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ mikrotik.factorysoftware }}</v-list-item-title>
                    <v-list-item-subtitle>Version del OS de fabrica</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ formatBytes(mikrotik.totalmemory) }}</v-list-item-title>
                    <v-list-item-subtitle>Memoria Total</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ mikrotik.cpucount }}</v-list-item-title>
                    <v-list-item-subtitle>Núcleos de la CPU</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ mikrotik.cpufrequency }}</v-list-item-title>
                    <v-list-item-subtitle>Frecuencia de la CPU</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ formatBytes(mikrotik.totalhddspace) }}</v-list-item-title>
                    <v-list-item-subtitle>Espacio total del disco</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ mikrotik.architecturename }}</v-list-item-title>
                    <v-list-item-subtitle>Arquitectura del Procesador</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">
                      mdi-star
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ mikrotik.boardname }}</v-list-item-title>
                    <v-list-item-subtitle>Nombre de la Board</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Mikrotik',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatBytes (bytes, decimals = 2) {
      if (bytes === 0) { return '0 Bytes' }

      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
  }
}
</script>
