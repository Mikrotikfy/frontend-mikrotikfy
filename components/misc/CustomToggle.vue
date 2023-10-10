<template>
  <div class="mt-2">
    <label class="switch btn-color-mode-switch">
      <input id="color_mode" v-model="uwu" type="checkbox" name="color_mode" value="1">
      <label for="color_mode" data-on="TELEVISION" data-off="INTERNET" class="btn-color-mode-switch-inner" />
    </label>
  </div>
</template>

<script>
export default {
  data () {
    return {
      uwu: false
    }
  }
}
</script>

<style scoped>
/*switch styles*/

div.btn-container{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

div.btn-container i{
    display: inline-block;
    position: relative;
    top: -9px;
}

label {
    font-size: 13px;
    color: #424242;
    font-weight: 500;
    font-family: Roboto;
}

.btn-color-mode-switch{
    display: inline-block;
    margin: 0px;
    position: relative;
}

.btn-color-mode-switch > label.btn-color-mode-switch-inner{
    margin: 0px;
    width: 200px;
    height: 30px;
    background: #161718;
    color: #dadada;
    border-radius: 26px;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
    /*box-shadow: 0px 0px 8px 0px rgba(17, 17, 17, 0.34) inset;*/
    display: block;
}

.btn-color-mode-switch > label.btn-color-mode-switch-inner:before{
    content: attr(data-on);
    position: absolute;
    font-size: 12px;
    font-weight: 500;
    top: 5px;
    right: 20px;

}

.btn-color-mode-switch > label.btn-color-mode-switch-inner:after{
    content: attr(data-off);
    width: 100px;
    height: 26px;
    background: #ffffff;
    color: #1e1e1e;
    border-radius: 26px;
    position: absolute;
    left: 2px;
    top: 2px;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0px 0px 6px -2px #111;
    padding: 3px 0px;
}

.btn-color-mode-switch > .alert{
    display: none;
    background: #FF9800;
    border: none;
    color: #fafafa;
}

.btn-color-mode-switch input[type="checkbox"]{
    cursor: pointer;
    width: 50px;
    height: 25px;
    opacity: 0;
    position: absolute;
    top: 0;
    z-index: 1;
    margin: 0px;
}

.btn-color-mode-switch input[type="checkbox"]:checked + label.btn-color-mode-switch-inner{
    background: #161718;
    color: #dadada;
}

.btn-color-mode-switch input[type="checkbox"]:checked + label.btn-color-mode-switch-inner:after{
    content: attr(data-on);
    left: 98px;
    background: #ffffff;
}

.btn-color-mode-switch input[type="checkbox"]:checked + label.btn-color-mode-switch-inner:before{
    content: attr(data-off);
    right: auto;
    left: 20px;
}

.btn-color-mode-switch input[type="checkbox"]:checked ~ .alert{
    display: block;
}

/*mode preview*/
.dark-preview{
    background: #0d0d0d;
}

.dark-preview div.btn-container i.fa-sun-o{
    color: #777;
}

.dark-preview div.btn-container i.fa-moon-o{
    color: #fff;
    text-shadow: 0px 0px 11px #fff;
}

.white-preview{
    background: #fff;
}

.white-preview div.btn-container i.fa-sun-o{
    color: #ffa500;
    text-shadow: 0px 0px 16px #ffa500;
}

.white-preview div.btn-container i.fa-moon-o{
    color: #777;
}

p.by a{
    text-decoration: none;
    color: #000;
}

.dark-preview p.by a{
    color: #777;
}

.white-preview p.by a{
    color: #000;
}
</style>
