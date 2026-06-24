<script setup lang="ts">
import LabeledForm from '../components/LabeledForm/LabeledForm.component.vue';
</script>

<template>
  <main class="main-container">
    <section class="section-container">
      <div class="inner-container">
        <ul class="card-container">
          <li>
            <LabeledForm title="Datos que recopilamos" accordion initial-open>
              <div class="privacy-wrap">
                <p class="privacy-lead">Para brindarte acceso a las aplicaciones del ecosistema NHEXA, almacenamos los siguientes datos:</p>
                <ul class="privacy-list">
                  <li class="privacy-item">
                    <span class="privacy-icon"><font-awesome-icon icon="fa-solid fa-at" /></span>
                    <div class="privacy-body">
                      <span class="privacy-title">Correo electrónico</span>
                      <span class="privacy-desc">Necesario para identificar tu cuenta y enviar notificaciones.</span>
                    </div>
                  </li>
                  <li class="privacy-item">
                    <span class="privacy-icon"><font-awesome-icon icon="fa-solid fa-user" /></span>
                    <div class="privacy-body">
                      <span class="privacy-title">Nombre de usuario</span>
                      <span class="privacy-desc">Identificador público dentro del ecosistema.</span>
                    </div>
                  </li>
                  <li class="privacy-item">
                    <span class="privacy-icon"><font-awesome-icon icon="fa-solid fa-circle-info" /></span>
                    <div class="privacy-body">
                      <span class="privacy-title">Información personal opcional</span>
                      <span class="privacy-desc">Nombre, apellido, fecha de nacimiento y teléfono, solo si los proporcionas.</span>
                    </div>
                  </li>
                  <li class="privacy-item">
                    <span class="privacy-icon"><font-awesome-icon icon="fa-solid fa-desktop" /></span>
                    <div class="privacy-body">
                      <span class="privacy-title">Dispositivos activos</span>
                      <span class="privacy-desc">Registro de sesiones activas (navegador, sistema operativo, IP y fecha) para que puedas gestionar el acceso a tu cuenta.</span>
                    </div>
                  </li>
                </ul>
                <p class="privacy-note">No vendemos ni compartimos tus datos con terceros. La información se usa exclusivamente para el funcionamiento del servicio.</p>
              </div>
            </LabeledForm>
          </li>
          <li>
            <LabeledForm title="Tus derechos" accordion initial-open>
              <div class="privacy-wrap">
                <p class="privacy-lead">Como usuario de NHEXA tienes los siguientes derechos sobre tus datos personales:</p>
                <ul class="privacy-list">
                  <li class="privacy-item">
                    <span class="privacy-icon"><font-awesome-icon icon="fa-solid fa-eye" /></span>
                    <div class="privacy-body">
                      <span class="privacy-title">Acceso</span>
                      <span class="privacy-desc">Puedes consultar toda la información asociada a tu cuenta en la sección "Información personal".</span>
                    </div>
                  </li>
                  <li class="privacy-item">
                    <span class="privacy-icon"><font-awesome-icon icon="fa-solid fa-pen" /></span>
                    <div class="privacy-body">
                      <span class="privacy-title">Rectificación</span>
                      <span class="privacy-desc">Puedes actualizar tus datos en cualquier momento desde "Información personal".</span>
                    </div>
                  </li>
                  <li class="privacy-item">
                    <span class="privacy-icon"><font-awesome-icon icon="fa-solid fa-trash" /></span>
                    <div class="privacy-body">
                      <span class="privacy-title">Eliminación</span>
                      <span class="privacy-desc">Puedes solicitar la eliminación de tu cuenta y todos tus datos contactando al soporte técnico.</span>
                    </div>
                  </li>
                  <li class="privacy-item">
                    <span class="privacy-icon"><font-awesome-icon icon="fa-solid fa-lock" /></span>
                    <div class="privacy-body">
                      <span class="privacy-title">Seguridad</span>
                      <span class="privacy-desc">Puedes gestionar el acceso desde la sección "Seguridad", incluyendo sesiones activas y verificación en dos pasos.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </LabeledForm>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.privacy-wrap {
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.privacy-lead {
  font-size: 0.82rem;
  opacity: 0.55;
  margin: 0;
  line-height: 1.5;
}

.privacy-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.privacy-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.privacy-icon {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.4rem;
  background: color-mix(in srgb, var(--primary-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--primary-color) 25%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 0.75rem;
}

.privacy-body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.privacy-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--nhexa-white);
}

.privacy-desc {
  font-size: 0.78rem;
  opacity: 0.5;
  line-height: 1.5;
}

.privacy-note {
  font-size: 0.72rem;
  opacity: 0.35;
  font-style: italic;
  margin: 0;
  line-height: 1.4;
}
</style>
