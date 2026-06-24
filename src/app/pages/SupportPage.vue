<template>
  <main class="main-container">
    <section class="section-container">
      <div class="inner-container">
        <ul class="card-container">
          <li>
            <div class="support-card">
              <font-awesome-icon icon="fa-solid fa-headset" class="support-icon" />
              <h2>¿Necesitas ayuda?</h2>
              <p>Nuestro equipo está disponible para resolver tus dudas y problemas técnicos relacionados con el ecosistema NHEXA.</p>
              <div class="support-contact">
                <div class="support-contact-item">
                  <font-awesome-icon icon="fa-solid fa-envelope" />
                  <a href="mailto:contacto@nhexa.cl">contacto@nhexa.cl</a>
                </div>
                <div class="support-contact-item">
                  <font-awesome-icon icon="fa-solid fa-clock" />
                  <span>Tiempo de respuesta estimado: 24–48 horas hábiles</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.support-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
  text-align: center;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    max-width: 340px;
    line-height: 1.6;
    opacity: 0.7;
  }
}

.support-icon {
  font-size: 2.5rem;
  opacity: 0.4;
}

.support-contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.support-contact-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  opacity: 0.65;

  svg {
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  a {
    color: var(--nhexa-white);
    &:hover { color: var(--nhexa-white); opacity: 0.8; }
  }
}
</style>