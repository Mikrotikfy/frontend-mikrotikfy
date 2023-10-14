<template>
  <v-card v-if="invoice" class="elevation-0 inner p-0" light>
    <v-container class="parent p-0">
      <div class="sub-parent">
        <div style="width:200px;margin:auto;">
          <MainLogoDark />
        </div>
        <div style="width:100%;text-align:center;text-align:center;">
          <h5>ARNOProducciones S.A.S. NIT 900655719-2</h5>
          <h5>CARRERA 4 # 8 - 11, EL CARMEN</h5>
        </div>
        <div style="text-align:center;">
          <h4 style="border:1px solid black;border-radius:10px 10px 0px 0px;" class="pa-1">
            ESTADO DE CUENTA INDIVIDUAL
          </h4>
          <h4 style="border:1px solid black;border-radius:0px;" class="pa-1">
            {{ invoice.id }}
          </h4>
          <h4 style="border:1px solid black;border-radius:0px 0px 10px 10px;" class="pa-1">
            {{ getDate(invoice.createdAt) }}
          </h4>
        </div>
      </div>
      <div class="client-parent">
        <div class="client-parent-sub">
          <h5>USUARIO: {{ invoice.service.normalized_client.name }}</h5>
          <h5>DIRECCION: {{ invoice.service.service_addresses.at(-1).address }} {{ invoice.service.service_addresses.at(-1).neighborhood.name }}</h5>
          <h5>SERVICIO: {{ invoice.service.name === 'INTERNET' ? 'INTERNET HOG. ILIMITADO' : 'TELEVISION HOGAR' }}</h5>
          <h5>OFERTA: {{ invoice.service.offer.name }}</h5>
        </div>
        <div>
          <div class="code-sub-parent">
            CODIGO {{ invoice.service.code }}
          </div>
        </div>
      </div>
    </v-container>
    <v-container class="parent-resume">
      <div>
        <div class="sub-parent-resume" style="border-radius:10px 10px 0px 0px;">
          Concepto
        </div>
        <div class="sub-parent-resume" style="border-radius:0px 0px 10px 10px;">
          <h3 class="blue darken-2 white--text rounded-lg px-2" style="margin-left:-5px;">
            TOTAL: $ {{ Number(invoice.balance).toLocaleString('es') }} {{ invoice.details }}
          </h3>
          <h4
            v-for="movement in invoice.invoice_movements"
            :key="movement.id"
          >
            ABONO ANTERIOR {{ movement.type === 'FACTURACION MENSUAL' ? movement.concept : movement.type }} {{ movement.year }} $ {{ Number(movement.amount).toLocaleString('es') }}
          </h4>
        </div>
      </div>
      <div>
        <div class="sub-parent-resume" style="border-radius:10px 10px 0px 0px;">
          Servicio
        </div>
        <div class="sub-parent-resume" style="border-radius:0px 0px 10px 10px;">
          <h3>{{ invoice.service.name === 'INTERNET' ? 'INTERNET HOG. ILIMITADO' : 'TELEVISION HOGAR' }}</h3>
          <h4>{{ invoice.service.offer.name }}</h4>
        </div>
      </div>
    </v-container>
    <v-container class="parent-company">
      <div>
        <div class="sub-parent-company" style="border-radius:10px 10px 0px 0px;">
          ARNOPRODUCCIONES
        </div>
        <div class="sub-parent-company" style="border-radius:0px 0px 10px 10px;">
          <h4>Direccion: CRA 4 # 8 - 11</h4>
          <h4>Ciudad: Mariquita, Tolima 732020</h4>
          <h4>Barrio: El Carmen</h4>
          <h4>Horarios Lun - Vie: 8:00 a.m. - 12:00 m, 2:00 p.m. - 6:00 p.m.</h4>
          <h4>Horarios Sab: 8:00 a.m. - 3:00 p.m. jornada continua</h4>
        </div>
      </div>
      <div>
        <p class="text-caption">
          Conozca nuestra politica de tratamiento de datos en www.arnoproducciones.com - Conozca los derechos y deberes como usuario de servicios de comunicaciones en www.comunicadoscomoes.gov.co - ARNOProducciones ofrece el servicio de atención en dias no laborales para atender sus solicitudes de domingo a domingo incluidos festivos a nuestra linea de atención 310 343 25 99 en Mariquita y 350 810 59 49 en Fresno. Porque ya somos parte de tu hogar. Tu estado de cuenta es digital y sera entregado a tu WhatsApp o correo electronico todos los meses para que puedas consultarlo desde cualquier lugar. Tambien puedes acceder a tu estado de cuenta en www.arnoproducciones.com/usuario - Recuerda que durante las tormentas electricas debes desconectaqr tu router de la corriente electrica para evitar daños en tu equipo.
        </p>
      </div>
    </v-container>
    <v-container class="parent-payment">
      <div>
        <div class="sub-parent-payment" style="border-radius:10px 10px 0px 0px;">
          Medios de entrega
        </div>
        <div class="sub-parent-payment" style="border-radius:0px 0px 10px 10px;">
          <h4>Estado de cuenta digital</h4>
          <h4>Canales de WhatsApp o Correo electronico</h4>
          <h4>Al afiliarte con nosotros tu estado de cuenta es digital y ayuda a cuidar el medio ambiente.</h4>
        </div>
      </div>
      <div />
    </v-container>
    <v-container class="parent-sub-info">
      <div class="client-parent-sub2 pa-2">
        <h4>USUARIO: {{ invoice.service.normalized_client.name }}</h4>
        <h4>DIRECCION: {{ invoice.service.service_addresses.at(-1).address }} {{ invoice.service.service_addresses.at(-1).neighborhood.name }}</h4>
        <h4>SERVICIO: {{ invoice.service.name === 'INTERNET' ? 'INTERNET HOG. ILIMITADO' : 'TELEVISION HOGAR' }}</h4>
        <h4>OFERTA: {{ invoice.service.offer.name }}</h4>
      </div>
      <div>
        <div class="sub-parent-company" style="border-radius:10px 10px 0px 0px;">
          ARNOPRODUCCIONES
        </div>
        <div class="sub-parent-company" style="border-radius:0px 0px 10px 10px;">
          <h4>Pagina web: www.arnoproducciones.com</h4>
          <h4>Ciudad: Mariquita, Tolima 732020</h4>
          <h4>WhatsApp: 310 343 25 99</h4>
          <h4>Horarios Lun - Vie: 8:00 a.m. - 12:00 m, 2:00 p.m. - 6:00 p.m.</h4>
          <h4>Horarios Sab: 8:00 a.m. - 3:00 p.m. jornada continua</h4>
        </div>
      </div>
    </v-container>
    <v-container class="parent-company-footer">
      <div>
        <v-img
          src="/barcode.jpg"
          width="90%"
          class="mx-auto"
        />
      </div>
    </v-container>
  </v-card>
</template>
<script>
export default {
  props: {
    invoice: {
      type: Object,
      required: true
    }
  },
  methods: {
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
      return humanDateFormat
    }
  }
}
</script>
<style scoped>
  .client-parent-sub2 {
    display: grid;
    border:1px solid black;border-radius:10px;
    border-radius: 10px;
  }
  .parent-sub-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    width:830px;
  }
  .parent-company-footer {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 10px;
    width:830px;
  }
  .parent-payment{
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 10px;
    grid-gap: 10px;
    width:830px;
  }
  .sub-parent-payment {
    border: 1px solid black;
    padding: 10px;
  }
  .parent-company{
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 10px;
    grid-gap: 10px;
    width:830px;
  }
  .sub-parent-company {
    border: 1px solid black;
    padding: 10px;
  }
  .parent-resume{
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 10px;
    grid-gap: 10px;
    width:830px;
  }
  .sub-parent-resume {
    border: 1px solid black;
    padding: 10px;
  }
  .important-info{
    font-weight: bold;
    background-color:#1976D2;
    padding: 0 5px;
    border-radius: 15px;
    color: white;
    margin-top:5px;
    width:830px;
  }
  .parent {
    display: grid;
    grid-template-columns: 5fr 10fr;
    grid-gap: 10px;
    width:830px;
    align-items: flex-end;
  }

  .sub-parent {
    display: grid;
    grid-template-columns: 1fr;
    place-items:center;
    justify-items: stretch;
  }

  .client-parent {
    display:grid;
    grid-template-columns: 4fr 3fr;
    grid-gap: 10px;
    border:1px solid black;border-radius:10px;
  }
  .client-parent-sub {
    padding: 10px 0 10px 10px;
    margin-top: 50px;
  }

  .code-sub-parent {
    display: grid;
    background-color:#1976D2;
    color: white;
    font-weight: bold;
    padding: 5px;
    right:12px;
    font-size:1.8rem;
    float:right;
    border-radius: 0 10px 0 10px;
  }
  .inner {
    width: 775px;
    height: 1300px;
    position: absolute;
  }
  @media print {
    .inner {
      transform: scale(0.6) rotate(-90deg);
      bottom: 64px;
      width: 775px;
      height: 1300px;
      position: absolute;
    }
  }
</style>
