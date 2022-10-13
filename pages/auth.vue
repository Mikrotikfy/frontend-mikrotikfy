<template>
  <v-container>
    <v-card light class="elevation-0" style="width:100%;border:1px solid black;border-radius:10px;">
      <v-card-text>
        <MainLogoDark />
      </v-card-text>
      <v-card-text class="text-center">
        <h2>Resumen de la autorizacion de entrega de factura y/o estado de cuenta digital</h2>
      </v-card-text>
      <v-card-text class="text-center mb-10">
        <p class="px-10">
          Por medio de la firma del presente documento, el Usuario declara que autoriza de manera libre, previa, expresa e informada a ARNOPRODUCCIONES S.A.S., identificada con NIT. 900.655.719, para que realice la entrega de factura y/o estado de cuenta digital del servicio de telecomunicaciones y demás servicios especiales, complementarios o suplementarios indicados en el contrato de prestación de servicios celebrado, a través del correo electrónico registrado. A partir de la aceptación de los términos y condiciones, ARNOPRODUCCIONES S.A.S enviará la factura y/o el estado de cuenta al correo electrónico indicado en esta autorización y hasta tanto El USUARIO comunique, en cualquier momento, por los canales virtuales o presenciales a la Empresa, su deseo de no continuar recibiendo las factuas y/o los estados de cuenta por correo electrónico. Dicha comunicación tendrá efectos a partir del periodo de facturación siguiente.
        </p>
        <p>Por la presente el usuario entiende que este documento es un resumen de nuestros terminos y condiciones para el manejo de facturas y/o estados de cuenta digital. Podrá encontrar el documento al completo en nuestra pagina web www.arnoproducciones.com</p>
      </v-card-text>
      <v-card-text>
        <div class="parent1">
          <div class="child">------------------------------------------------------------------- <br> Nombre del usuario</div>
          <div class="child">------------------------------------------------------------------- <br> Cedula del usuario</div>
          <div class="child">------------------------------------------------------------------- <br> Firma del usuario</div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  layout: 'print',
  data () {
    return {
      email: '',
      password: ''
    }
  }
}
</script>
<style scoped>
  .parent1 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    place-items:center;
  }
</style>
