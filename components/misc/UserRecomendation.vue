<template>
  <div>
    <v-col v-if="$route.query.clienttype === 'INTERNET'" cols="12" md="6" lg="7">
      <v-card class="rounded-xl">
        <v-card-title>
          <v-icon class="mr-2">
            mdi-account-alert-outline
          </v-icon>
          Recomendaciones para la toma de casos nuevos
        </v-card-title>
        <v-card-text>
          <span class="text-body-1 text-decoration-underline red--text">Preguntas a realizar al ENCONTRARSE FUERA DE LINEA ❌</span><br>
          <span class="text-body-1 ml-2">• ¿Ya realizo un reinicio del router?</span><br>
          <span class="text-body-1 ml-10">• Si no lo ha realizado, pedirle que lo realice. Muchas veces el router se encuentra bloqueado.</span><br>
          <span class="text-body-1 ml-2">• ¿Tiene una luz roja encendida en el router?</span><br>
          <span class="text-body-1 ml-10">• Luz roja indica perdida de potencia óptica. Tomar revisión.</span><br>
          <span class="text-body-1 ml-2">• ¿Le aparece la red WIFI?</span><br>
          <span class="text-body-1 ml-10">• Si no le aparece la red WIFI significa que el router pudo haberse reseteado de fábrica. Tomar Revisión</span><br>
          <span class="text-body-1 ml-2">• ¿Todos los cables se encuentran correctamente conectados?</span><br>
          <span class="text-body-1 ml-10">• El usuario pudo haber manipulado el orden de conexión de los cables de router generando la perdida de señal. Si lo hizo, tomar revisión.</span><br>
          <span class="text-body-1 ml-2">• ¿Esta sobrecalentado el router?</span><br>
          <span class="text-body-1 ml-10">• Si esta sobrecalentado puede presentar problemas de cobertura o navegación. Tomar revisión.</span><br><br>
          <span class="text-body-1 text-decoration-underline green--text">Preguntas a realizar al ENCONTRARSE EN LINEA ✔️: </span><br>
          <span class="text-body-1 ml-2">• ¿En el momento cuenta con navegación?</span><br>
          <span class="text-body-1 ml-10">• Verificar si necesita algún servicio relacionado con cambio de contraseña o nombre de red</span><br>
          <span class="text-body-1 ml-2">• ¿Desde que fecha presenta el inconveniente?</span><br>
          <span class="text-body-1 ml-10">• Asegurarse que la revisión se pide en fechas que no concuerden con caídas de azteca recientes. De ser el caso, explicarle al cliente que se han presentado fallas por parte del proveedor. Si son antes de las fechas de caídas, tomar la revisión.</span><br>
          <span class="text-body-1 ml-2">• ¿Es en todos los dispositivos, o solo en algunos específicos?</span><br>
          <span class="text-body-1 ml-10">• Si los errores de navegación son solo en unos dispositivos en específico, puede ser problemas de canal y banda WIFI. Tomar la revisión</span><br>
          <span class="text-body-1 ml-10">• Si es en todos los dispositivos, puede ser que se haya solicitado un cambio de contraseña recientemente y el usuario no haya realizado el cambio en los dispositivos. Si no se pidió un cambio de contraseña recientemente, Tomar revisión.</span><br>
          <span class="text-body-1 ml-2">• ¿A que red esta conectado en el dispositivo que no le navega?</span><br>
          <span class="text-body-1 ml-10">• El usuario puede no estar conectado a la red WIFI. Preguntar a que red esta conectada y si concuerda con su apellido para descartar este escenario. O puede estar conectado a la red de algún vecino del que tenga la contraseña.</span><br>
          <span class="text-body-1 ml-2">• ¿Ha solicitado un cambio de contraseña recientemente?</span><br>
          <span class="text-body-1 ml-10">• A veces el usuario olvida que pidió un cambio de contraseña y no la agrega a sus dispositivos de nuevo, quedándose sin navegación.</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-if="$route.query.clienttype === 'TELEVISION'" cols="12" md="6" lg="7">
      <v-card class="rounded-xl">
        <v-card-title>
          <v-icon class="mr-2">
            mdi-account-alert-outline
          </v-icon>
          Recomendaciones para la toma de casos nuevos
        </v-card-title>
        <v-card-text>
          <span class="text-body-1 text-decoration-underline green--text">Preguntas a realizar al Cliente ✔️: </span><br>
          <span class="text-body-1 ml-2">• ¿Afecta solo 1 canal o es en todos?</span><br>
          <span class="text-body-1 ml-10">• Verificar esto para determinar si es el nodo o amplificador</span><br>
          <span class="text-body-1 ml-2">• ¿Desde que fecha presenta el inconveniente?</span><br>
          <span class="text-body-1 ml-10">• Asegurarse que la revisión se pide en fechas que no concuerden con trabajos de adecuacion de red o de terceros.</span><br>
          <span class="text-body-1 ml-2">• ¿Aparece un letrero de "Codificado" o similar?</span><br>
          <span class="text-body-1 ml-10">• Puede tratarse de una revision por solo 1 canal que tenga afectado la señal satelital.</span><br>
          <span class="text-body-1 ml-2">• ¿Esta conectado el Televisor al cable de la parabolica?</span><br>
          <span class="text-body-1 ml-10">• El usuario pudo haber desconectado el cable por alguna limpieza o cambio de lugar que haya realizado y olvido volverlo a conectar</span><br>
          <span class="text-body-1 ml-2">• ¿Sucede en todos los televisores o solo en 1?</span><br>
          <span class="text-body-1 ml-10">• Si presenta el problema solo en 1 televisor puede significar daño en conector o cable.</span>
        </v-card-text>
      </v-card>
    </v-col>
  </div>
</template>
