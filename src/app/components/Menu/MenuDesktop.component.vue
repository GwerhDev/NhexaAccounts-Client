<style scoped lang="scss" src="./MenuDesktop.component.scss" />
<script setup lang="ts">
import { closeMenu } from '../../../helpers/menu';
</script>

<template>
  <ul class="lateral-menu-text">
    <li>
      <router-link class="lateral-menu-link" to="/" @click="closeMenu()">
        Página principal
      </router-link>
    </li>
  </ul>
  
  <div class="separator mt-1 mb-1"></div>

  <ul class="lateral-menu-text">
    <li>
      <router-link class="lateral-menu-link" to="/" @click="closeMenu()">
        Información personal
      </router-link>
    </li>
    <li>
      <router-link class="lateral-menu-link" to="/" @click="closeMenu()">
        Datos y privadicidad
      </router-link>
    </li>
    <li>
      <router-link class="lateral-menu-link" to="/" @click="closeMenu()">
        Seguridad
      </router-link>
    </li>
    <li>
      <router-link class="lateral-menu-link" to="/" @click="closeMenu()">
        Pagos y suscripciones
      </router-link>
    </li>
  </ul>

  <div class="separator mt-1 mb-1"></div>
  
  <ul class="lateral-menu-text">
    <li>
      <router-link class="lateral-menu-link" to="/environment/apps" @click="closeMenu()">
        Aplicaciones
      </router-link>
    </li>
    <li>
      <router-link class="lateral-menu-link" to="/support" @click="closeMenu()">
        Soporte técnico
      </router-link>
    </li>
  </ul>
</template>