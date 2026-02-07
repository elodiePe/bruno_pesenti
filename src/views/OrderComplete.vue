<template>
  <div class="boxes">
    <div class="box">
  <div class="order-complete-wrapper">
    <div class="order-complete-card">
      <h1>{{ $t('orderComplete.title') }}</h1>
      <p>{{ $t('orderComplete.thankYou') }}</p>
      <p>{{ $t('orderComplete.checkEmail') }}</p>
      <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Order Complete" class="order-complete-icon" />
      <router-link to="/" class="btn-home">{{ $t('orderComplete.backHome') }}</router-link>
    </div>
  </div>
    </div>
    </div>
</template>

<script>
export default {
  name: 'OrderComplete',
};
</script>

<style scoped>
.order-complete-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: #f8fafc;
}
.order-complete-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 40px 30px;
  text-align: center;
  max-width: 400px;
}
.order-complete-card h1 {
  color: #10b981;
  font-size: 2rem;
  margin-bottom: 16px;
}
.order-complete-card p {
  font-size: 1.1rem;
  color: #475569;
  margin-bottom: 12px;
}
.order-complete-icon {
  width: 80px;
  margin: 24px 0;
}
.btn-home {
  width: 80%;
  padding: 14px;
  background-color: #4c6a65;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
text-decoration: none;
display: inline-block;
}
.btn-home:hover {
  background-color: #3a4f4a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 106, 101, 0.3);
}
</style>
