<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <v-container
      v-for="(clientInfo, index) in clientsInfo"
      :key="index"
    >
      <v-row>
        <v-col cols="4" class="d-flex justify-start">
          <MainLogoDark />
        </v-col>
        <v-col cols="8" class="d-flex align-end justify-center">
          <h2>ENTREGA DE SERVICIO INTERNET</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-1">
          <table class="tabla">
            <tr>
              <td style="border-right: 1px solid black; border-bottom: 1px solid black;">
                CLIENTE:
              </td>
              <td style="border-bottom: 1px solid black; grid-column: span 6">
                {{ clientInfo.name }}
              </td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black; border-bottom: 1px solid black;">
                DIRECCION:
              </td>
              <td style="border-bottom: 1px solid black; grid-column: span 6">
                {{ clientInfo.addresses.at(-1).address }}
              </td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black; border-bottom: 1px solid black;">
                BARRIO:
              </td>
              <td style="border-bottom: 1px solid black; grid-column: span 6">
                {{ clientInfo.addresses.at(-1).neighborhood.name }}
              </td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black; border-bottom: 1px solid black;">
                CELULAR:
              </td>
              <td style="grid-column: span 6">
                {{ clientInfo.phone }}
              </td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black; border-bottom: 1px solid black;">
                ESTRATO:
              </td>
              <td style="border-top: 1px solid black; border-bottom: 1px solid black;grid-column: span 6;">
                {{ clientInfo.stratum }}
              </td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black; border-bottom: 1px solid black;">
                INTERNET HOGAR:
              </td>
              <td style="border-bottom: 1px solid black; grid-column: span 6;">
                {{ clientInfo.plan.name }}
              </td>
            </tr>
            <tr>
              <td>EQUIPO EN COMODATO</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;">
                TIPO:
              </td>
              <td style="border-top: 1px solid black; border-bottom: 1px solid black; grid-column: span 6;">
                {{ clientInfo.technology.name }}
              </td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black ;padding:5px;">
                IDENTIFICACION MAC
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center py-1 text-center">
          <p>
            Para garantizar la calidad en la prestacion del servicio, es necesario tener en cuenta las siguientes recomendaciones técnicas.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center py-1 text-center">
          <strong>
            RECOMENDACIONES TECNICAS
          </strong>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center py-1 text-start">
          <div>
            <p>
              1. No comparta su contraseña con nadie. (puede ser victima de fraude y/o robo de sus datos personales e informacion)
            </p>
            <p>
              2. Evite desconectar o manipular cables y dispositivos.
            </p>
            <p>
              3. No intente entrar al dispositivo (Router) por medio de la interfaz para cambiar contraseñas o protocolos establecidos por la empresa.
            </p>
            <p>
              4. Desconecte la fuente electrica (cargador) del dispositivo (router) en caso de tormenta, para evitar que descargas electricas dañen el equipo.
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center py-1 text-center">
          <strong>
            SEÑOR USUARIO COMUNIQUESE CON NUESTRA LINEA DE ATENCION Y SOLICITE UN SERVICIO TECNICO EN LOS SIGUIENTES CASOS:
          </strong>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center py-1 text-start">
          <div>
            <p>
              1. Si su servicio es por fibra optica y el dispositivo emite una luz de color rojo en el led LOS
            </p>
            <p>
              2. Si por manipulacion o accidente el cable UTP o Fibra optica es cortada o presenta deterioro.
            </p>
            <p>
              3. Si su servicio presenta lentitud en la navegacion. (no intente entrar al router)
            </p>
            <p>
              4. Si su dispositivo no enciende
            </p>
            <p>
              5. Si los dispositivos de su hogar tales como celulares, computadores no reconocen la red privada.
            </p>
            <p>
              6. Si requiere cambiar de lugar su dispositivo. (Puede tener costo adicional)
            </p>
            <p>
              7. Si necesita cambiar la contraseña.
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center py-1 text-center">
          <strong>
            Recuerde que la calidad del servicio depende tambien del cuidado y buen uso del dispositivo
          </strong>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center py-1 text-center">
          <strong>
            LINEA DE ATENCION:
          </strong>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center py-1 text-start">
          <div>
            <p>
              MARIQUITA: 310 343 25 99
            </p>
            <p>
              FRESNO: 258 14 93   /  350 810 59 49
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col class="d-flex justify-center py-1 text-start">
          <div>
            <v-row>
              <v-col class="pa-0">
                _____________________________________________
              </v-col>
            </v-row>
            <v-row class="mt-1">
              <v-col class="pa-0">
                CLIENTE
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col class="d-flex justify-center py-1 text-start">
          <div>
            <v-row>
              <v-col class="pa-0">
                ____________________________________________
              </v-col>
            </v-row>
            <v-row class="mt-1">
              <v-col class="pa-0">
                TECNICO
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <div v-if="(index + 1) < clientsInfo.length" class="pagebreak"></div>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'PrintOrder',
  layout: 'print',
  data () {
    return {
      clientsInfo: []
    }
  },
  mounted () {
    this.$vuetify.theme.dark = false
    this.getClientInfo()
  },
  destroyed () {
    this.$vuetify.theme.dark = true
  },
  methods: {
    getClientInfo () {
      if (this.$route.query.clientsInfo) {
        this.clientsInfo = JSON.parse(this.$route.query.clientsInfo)
      }
    }
  }
}
</script>
<style scoped>
body {
  background-color:white!important;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
}

.tabla > tr {
  display: grid !important;
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 0px;
}
.tabla > tr > td {
  padding-left: 5px;
}
p {
  font-size: 16px;
  line-height: 1.5rem;
  margin-bottom: 0 !important;
}
h2 {
  font-size: 24px!important;
  line-height: 1.5rem!important;
}
strong {
  font-size: 16px;
  line-height: 1.5rem!important;
}
@media print {
    .pagebreak {
        page-break-after: always;
        opacity: 0;
    }
}
</style>
