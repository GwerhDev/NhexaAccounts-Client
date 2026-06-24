<script setup lang="ts">
import LabeledForm from '../components/LabeledForm/LabeledForm.component.vue';
</script>

<template>
  <main class="main-container">
    <section class="section-container">
      <div class="inner-container">
        <ul class="card-container">
          <li>
            <LabeledForm title="Datos que recopilamos" accordion>
              <div class="ul-form privacy-content">
                <p>Para brindarte acceso a las aplicaciones del ecosistema NHEXA, almacenamos los siguientes datos:</p>
                <ul class="privacy-list">
                  <li><font-awesome-icon icon="fa-solid fa-at" /> <strong>Correo electrónico</strong> — necesario para identificar tu cuenta y enviar notificaciones.</li>
                  <li><font-awesome-icon icon="fa-solid fa-user" /> <strong>Nombre de usuario</strong> — identificador público dentro del ecosistema.</li>
                  <li><font-awesome-icon icon="fa-solid fa-circle-info" /> <strong>Información personal opcional</strong> — nombre, apellido, fecha de nacimiento y teléfono, solo si los proporcionas.</li>
                  <li><font-awesome-icon icon="fa-solid fa-desktop" /> <strong>Dispositivos activos</strong> — registro de sesiones activas (navegador, sistema operativo, IP y fecha) para permitirte gestionar el acceso a tu cuenta.</li>
                </ul>
                <p class="privacy-note">No vendemos ni compartimos tus datos con terceros. La información se usa exclusivamente para el funcionamiento del servicio.</p>
              </div>
            </LabeledForm>
          </li>
          <li>
            <LabeledForm title="Tus derechos" accordion>
              <div class="ul-form privacy-content">
                <p>Como usuario de NHEXA tienes los siguientes derechos sobre tus datos personales:</p>
                <ul class="privacy-list">
                  <li><font-awesome-icon icon="fa-solid fa-eye" /> <strong>Acceso</strong> — puedes consultar toda la información asociada a tu cuenta en la sección "Información personal".</li>
                  <li><font-awesome-icon icon="fa-solid fa-pen" /> <strong>Rectificación</strong> — puedes actualizar tus datos en cualquier momento desde "Información personal".</li>
                  <li><font-awesome-icon icon="fa-solid fa-trash" /> <strong>Eliminación</strong> — puedes solicitar la eliminación de tu cuenta y todos tus datos contactando al soporte técnico.</li>
                  <li><font-awesome-icon icon="fa-solid fa-lock" /> <strong>Seguridad</strong> — puedes gestionar el acceso desde la sección "Seguridad", incluyendo sesiones activas y verificación en dos pasos.</li>
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
.privacy-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.6;

  p {
    margin: 0;
    opacity: 0.8;
  }
}

.privacy-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;

    svg {
      margin-top: 0.2rem;
      opacity: 0.6;
      flex-shrink: 0;
      font-size: 0.85rem;
    }
  }
}

.privacy-note {
  font-size: 0.78rem;
  opacity: 0.5;
  font-style: italic;
}
</style>
