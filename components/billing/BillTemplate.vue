<template>
  <v-card width="963" class="mx-auto py-10">
    <v-container class="parent">
      <div class="sub-parent">
        <div style="width:150px;margin:auto;">
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
        <h4>NICOLAS ECHEVERRY</h4>
        <h4>CARRERA 11A # 2 - 43 GALAN</h4>
        <h4>INTERNET ILIMITADO PERSONAL S20</h4>
      </div>
      <div class="code-sub-parent">
        CODIGO 17171
      </div>
    </v-container>
  </v-card>
</template>
<style scoped>
  .parent {
    display: grid;
    grid-template-columns: 3fr 10fr;
    grid-gap: 10px;
  }

  .sub-parent {
    display: grid;
    grid-template-columns: 1fr;
    place-items:center;
    justify-items: stretch;
  }

  .client-parent {
    place-items: start;
    padding: 10px 0 0 10px;
    border:1px solid black;border-radius:10px;
  }

  .code-sub-parent {
    display: grid;
    background-color:rgb(210, 40, 40);
    color: white;
    font-weight: bold;
    padding: 5px;
    place-items:end;
    position: absolute;
    right:12px;
    font-size:1.5rem;
    float:right;
    border-radius: 0 10px 0 10px;
  }
</style>
