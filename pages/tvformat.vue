<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <v-container
      v-for="(clientInfo, index) in clientsInfo"
      :key="index"
    >
      <v-row>
        <v-col cols="4" class="d-flex justify-start">
          <v-img
            src="cmas.png"
            contain
            max-width="200"
          />
        </v-col>
        <v-col cols="8" class="d-flex align-end justify-center">
          <h2>ENTREGA DE SERVICIO TELEVISION</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-1">
          <table class="tabla" style="line-height:1rem;font-size:14px;">
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
              <td style="border-right: 1px solid black; border-bottom: 1px solid black;grid-column: span 3;" class="text-center">
                <strong>RAZONAMIENTO</strong>
              </td>
              <td></td>
              <td style="border-left: 1px solid black; border-bottom: 1px solid black;grid-column: span 3;" class="text-center">
                <strong>
                  TIPO DE TRABAJO
                </strong>
              </td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;">
                Cliente no atiende
              </td>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;grid-column: span 2;"></td>
              <td></td>
              <td style="border-left: 1px solid black;grid-column: span 2;">
                {{ clientInfo.tickettype }}
              </td>
              <td style="border-left: 1px solid black;"></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;">
                Mal Agendado
              </td>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;grid-column: span 2;"></td>
              <td></td>
              <td style="border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;grid-column: span 3;" class="text-center">
                <strong>PARAMETROS DE ENTREGA</strong>
              </td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;font-size:12px;">
                No disponibilidad de red
              </td>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;grid-column: span 2;"></td>
              <td></td>
              <td style="border-left: 1px solid black;border-bottom: 1px solid black;">
                Decibeles
              </td>
              <td style="border-left: 1px solid black;border-bottom: 1px solid black;grid-column: span 2;"></td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;">
                Fuera de zona
              </td>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;grid-column: span 2;"></td>
              <td></td>
              <td style="border-left: 1px solid black;border-bottom: 1px solid black;">
                Calidad
              </td>
              <td style="border-left: 1px solid black;border-bottom: 1px solid black;grid-column: span 2;"></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td style="grid-column: span 7;" class="text-center">
                <strong>
                  MATERIAL
                </strong>
              </td>
            </tr>
            <tr>
              <td style="border-top: 1px solid black;border-right: 1px solid black;">
                CABLE COAXIAL
              </td>
              <td style="border-right: 1px solid black;border-top: 1px solid black;">
                NUEVO
              </td>
              <td style="border-right: 1px solid black;border-top: 1px solid black;">
                USADO
              </td>
              <td></td>
              <td style="border-left: 1px solid black;border-top: 1px solid black;">
                METROS
              </td>
              <td style="border-left: 1px solid black;border-top: 1px solid black;">
                # TV
              </td>
              <td style="border-left: 1px solid black;border-top: 1px solid black;font-size:12px;">
                UBICACION TV
              </td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid black;border-right: 1px solid black;height:35px;border-top: 1px solid black;">
                Conectores RG6
              </td>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;height:35px;border-top: 1px solid black;"></td>
              <td style="border-right: 1px solid black;border-bottom: 1px solid black;height:35px;border-top: 1px solid black;"></td>
              <td></td>
              <td style="border-left: 1px solid black;border-bottom: 1px solid black;height:35px;border-top: 1px solid black;"></td>
              <td style="border-left: 1px solid black;border-bottom: 1px solid black;height:35px;border-top: 1px solid black;"></td>
              <td style="border-left: 1px solid black;border-bottom: 1px solid black;height:35px;border-top: 1px solid black;"></td>
            </tr>
            <tr>
              <td style="border-right: 1px solid black;height:35px;">
                Elementos de distribución
              </td>
              <td style="border-right: 1px solid black;height:35px;"></td>
              <td style="border-right: 1px solid black;height:35px;"></td>
              <td></td>
              <td style="border-left: 1px solid black;height:35px;"></td>
              <td style="border-left: 1px solid black;height:35px;"></td>
              <td style="border-left: 1px solid black;height:35px;"></td>
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
        <v-col class="d-flex justify-center py-0 text-center">
          <strong>
            RECOMENDACIONES TECNICAS
          </strong>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center py-0 text-start">
          <div>
            <p>
              1. Evite manipular o modificar el cable coaxial de su instalación.
            </p>
            <p>
              2. No comparta su señal de televisión con terceros.
            </p>
            <p>
              3. En caso de lluvia, tormenta o alteraciones eléctricas, desconecte el cable coaxial de la entrada del televisor.
            </p>
            <p>
              4. No está autorizado para mover o reubicar su instalación de televisión.
            </p>
            <p>
              5. Puede consultar nuestra política de datos en la página www.arnoproducciones.com
            </p>
            <p>
              6. Abstengase de realizar algún pago al técnico de soporte, debe de acercarse únicamente a nuestra oficina.
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
              1. Si su servicio presenta lluvia, interferencia o no tiene señal.
            </p>
            <p>
              2. Si por manipulación o accidente el cable coaxial es cortado o presenta deterioro (puede tener un costo adicional.)
            </p>
            <p>
              3. Si requiere realizar un traslado del servicio. (Tiene un costo adicional)
            </p>
            <p>
              4. Si requiere cambiar de lugar su televisor o un punto adicional. (Tiene un costo adicional)
            </p>
          </div>
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
      <v-row>
        <v-col class="d-flex justify-start py-1 text-center">
          <strong>
            OBSERVACIONES:
          </strong>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-start py-1 text-center" style="border: 1px solid black; height:50px;">
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
  name: 'PrintTVOrder',
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
.tabla {
  width: 100%;
  border: 1px solid black;
}

.tabla > tr {
  display: grid !important;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 1fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 2fr);
  padding: 0px;
}
.tabla > tr > td {
  padding-left: 5px;
}
p {
  font-size: 16px;
  line-height: 1.2rem;
  margin-bottom: 0 !important;
}
@media print {
    .pagebreak {
        page-break-after: always;
    }
}
</style>
