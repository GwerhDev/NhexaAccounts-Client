<style scoped lang="scss" src="./MenuMobile.component.scss" />
<script setup lang="ts">
import { closeMenu } from '../../../helpers/menu';
</script>

<template>
  <div class="container-menu-mobile">
    <ul class="ul-menu-mobile">
      <li>
        <router-link class="lateral-menu-link" to="/" @click="closeMenu()">
          <font-awesome-icon icon="fa-solid fa-home" />
          Página principal
        </router-link>
      </li>
    </ul>

    <div class="separator mt-1 mb-1"></div>

    <ul class="ul-menu-mobile">
      <li>
        <router-link class="lateral-menu-link" to="/personal-info" @click="closeMenu()">
          <font-awesome-icon icon="fa-solid fa-id-card" />
          Información personal
        </router-link>
      </li>
      <li>
        <router-link class="lateral-menu-link" to="/privacy" @click="closeMenu()">
          <font-awesome-icon icon="fa-solid fa-toggle-on" />
          Datos y privacidad
        </router-link>
      </li>
      <li>
        <router-link class="lateral-menu-link" to="/security" @click="closeMenu()">
          <font-awesome-icon icon="fa-solid fa-shield-halved" />
          Seguridad
        </router-link>
      </li>
      <li>
        <router-link class="lateral-menu-link" to="/billing" @click="closeMenu()">
          <font-awesome-icon icon="fa-solid fa-credit-card" />
          Pagos y suscripciones
        </router-link>
      </li>
    </ul>
    <div class="separator mt-1 mb-1"></div>
    <ul class="ul-menu-mobile">
      <li>
        <router-link class="lateral-menu-link" to="/environment/apps" @click="closeMenu()">
          <font-awesome-icon icon="fa-solid fa-layer-group" />
          Aplicaciones
        </router-link>
      </li>
      <li>
        <router-link class="lateral-menu-link" to="/support" @click="closeMenu()">
          <font-awesome-icon icon="fa-solid fa-circle-question" />
          Soporte técnico
        </router-link>
      </li>
    </ul>
  </div>
</template>