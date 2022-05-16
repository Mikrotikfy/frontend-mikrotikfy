<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Medidor de Velocidad</v-card-title>
          <v-card-subtitle>
            Recuerda realizar la prueba estando conectado por cable al router para obtener una medición correcta. Las mediciones por WiFi no representan adecuadamente la velocidad por intermitencias del ambiente.
          </v-card-subtitle>
          <v-card-text>
            <iframe width="100%" height="650px" frameborder="0" src="https://arnoproducciones.speedtestcustom.com" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
