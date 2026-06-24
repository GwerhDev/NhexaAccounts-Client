<template>
  <main class="main-container">
    <section class="section-container">
      <div class="inner-container">
        <ul class="card-container">
          <li>
            <div class="billing-placeholder">
              <font-awesome-icon icon="fa-solid fa-credit-card" class="billing-icon" />
              <h2>Facturación</h2>
              <p>Esta sección estará disponible próximamente. Aquí podrás gestionar tus métodos de pago y suscripciones.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.billing-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  opacity: 0.6;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    max-width: 320px;
    line-height: 1.6;
  }
}

.billing-icon {
  font-size: 2.5rem;
  opacity: 0.4;
}
</style>
