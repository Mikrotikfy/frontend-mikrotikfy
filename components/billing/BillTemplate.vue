<template>
  <v-card class="elevation-5 output" light>
    <v-container class="parent">
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
            ESTADO DE CUENTA
          </h4>
          <h4 style="border:1px solid black;border-radius:0px 0px 10px 10px;" class="pa-1">
            000001
          </h4>
        </div>
      </div>
      <div class="client-parent">
        <div class="client-parent-sub">
          <div>
            <h4>NICOLAS ECHEVERRY</h4>
            <h4>CARRERA 11A # 2 - 43 GALAN</h4>
            <h4>INTERNET ILIMITADO PERSONAL S20</h4>
            <h4>MES DE SEPTIEMBRE</h4>
          </div>
          <div>
            <h4>C.C. / NIT: 1110601254</h4>
            <h3 class="important-info">
              VENCIMIENTO: 16 SEPTIEMBRE 2022
            </h3>
            <h3 class="important-info">
              SUSPENSION: 18 SEPTIEMBRE 2022
            </h3>
          </div>
        </div>
        <div>
          <div class="code-sub-parent">
            CODIGO 17171
          </div>
        </div>
      </div>
    </v-container>
    <v-container class="parent-resume">
      <div>
        <div class="sub-parent-resume" style="border-radius:10px 10px 0px 0px;">
          Resumen de su cuenta
        </div>
        <div class="sub-parent-resume" style="border-radius:0px 0px 10px 10px;">
          <h3 class="blue darken-2 white--text rounded-xl px-2" style="margin-left:-5px;">SALDO TOTAL: $170.000</h3>
          <h4>SALDOS AGOSTO: 50.000</h4>
          <h4>SALDOS JULIO: 50.000</h4>
          <h4>SALDOS EQUIPOS: 70.000</h4>
        </div>
      </div>
      <div>
        <div class="sub-parent-resume" style="border-radius:10px 10px 0px 0px;">
          Servicio
        </div>
        <div class="sub-parent-resume" style="border-radius:0px 0px 10px 10px;">
          <h3>MENSUALIDAD SEPTIEMBRE</h3>
          <h4>INTERNET ILIMITADO PERSONAL S20</h4>
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
          ARNOProducciones empresa de telecomunicaciones del norte del tolima. Porque ya somos parte de tu hogar. Conozca nuestra politica de tratamiento de datos en www.arnoproducciones.com - Conozca los derechos y deberes como usuario de servicios de comunicaciones en www.comunicadoscomoes.gov.co - ARNOProducciones ofrece el servicio de atención en dias no laborales para atender sus solicitudes de domingo a domingo incluidos festivos a nuestra linea de atención 310 343 25 99 en Mariquita y 350 810 59 49 en Fresno. Porque ya somos parte de tu hogar. </p>
      </div>
    </v-container>
    <v-container class="parent-payment">
      <div>
        <div class="sub-parent-payment" style="border-radius:10px 10px 0px 0px;">
          Puntos de pago
        </div>
        <div class="sub-parent-payment" style="border-radius:0px 0px 10px 10px;">
          <h4>Oficina Mariquita: CRA 4 # 8 - 11</h4>
          <h4>Barrio: El Carmen</h4>
          <h4>Telefono: 310 343 25 99</h4>
        </div>
      </div>
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
<style scoped>
  .parent-payment{
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 10px;
    grid-gap: 10px;
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
  }
  .parent {
    display: grid;
    grid-template-columns: 5fr 10fr;
    grid-gap: 10px;
  }

  .sub-parent {
    display: grid;
    grid-template-columns: 1fr;
    place-items:center;
    justify-items: stretch;
  }

  .client-parent {
    display:grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 10px;
    border:1px solid black;border-radius:10px;
  }
  .client-parent-sub {
    display:grid;
    justify-content: space-between;
    padding: 10px 0 10px 10px;
  }

  .code-sub-parent {
    display: grid;
    background-color:#1976D2;
    color: white;
    font-weight: bold;
    padding: 5px;
    right:12px;
    font-size:1.5rem;
    float:right;
    border-radius: 0 10px 0 10px;
  }
  @media print {
  .output {
    -ms-transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
    width: 763px;
    height: 1198px;
    top: -215px;
    left: 221px;
  }
  }
</style>
