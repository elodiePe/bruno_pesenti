<template>
  <div class="banner">
    <div class="banner-content">
        <div>
    <h1>{{ $t("concours.title") }}</h1>
    <p>{{ $t("concours.banner_description") }}</p>
        </div>


    <button class="submit-btn">
      <RouterLink to="/concours">{{ $t("concours.cta") }}</RouterLink>
    </button>
    </div>
        <img src="../assets/img/concours.png" alt=""></img>


  </div>
</template>
<style>
.banner-content {
display: flex;
flex-direction: column;
/* align-items: center; */
text-align: left;
gap: 1rem;
}
.banner h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 0rem;
}
.banner img {
    width: 20%;
    height: auto;
    display: block;
    object-fit: contain;

    /* margin-top: 1rem; */
}
.banner {
    gap: 2rem;
    width: 100%;
    padding: 16px;
    /* Utilise un dégradé linéaire pour séparer la couleur par une diagonale */
    background: linear-gradient(175deg, #ea9839 65%, #fff 50%);
    display: flex;
    justify-content: center;
    text-align: center;
}

.submit-btn {
  width: 40%;
  padding: 0.8rem;
  background: #ffffff;
  color: #deb887;
  border: #deb887;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  border: 2px solid #fff;
}
.submit-btn a {
  color: #000000 !important;
  text-decoration: none;
}

.submit-btn:hover {
background: #ea9839;
border: 2px solid #fff;
  color: #ffffff;
}
.submit-btn:hover a {
  color: #ffffff !important;
}

@media (max-width: 1050px) {
    .banner-content {
display: flex;
flex-direction: column;
align-items: center;
text-align: center;

}
    .banner img {
    width: 25%;
    height: 25%;
    display: absolute;
    /* margin-top: 1rem; */
}
.banner {
  width: 100%;
  padding: 16px;
  background-color: #ea9839;
border-top: none;

  display: flex;
  border-radius: 10px;
flex-direction: column;
align-items: center;
text-align: center;
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  border: 2px solid #fff;

}

}
</style>
