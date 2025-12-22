<template>
  <div class="banner">
    <div class="banner-content">
        <div>
    <h1>{{ $t("home.information.title") }}</h1>

    <p >{{ $t("home.information.description") }}</p>

        </div>


 
   
    
    </div>
     


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

.banner {
    gap: 2rem;
    width: 100%;
    padding: 16px;
    /* Utilise un dégradé linéaire pour séparer la couleur par une diagonale */
    background:  #ea9839 65%;
    display: flex;
    justify-content: center;
    text-align: center;
}

.submit-btn {
  width: 40%;
  padding: 0.8rem;
  background: #ffffff;
  color: #222221;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  border: 2px solid #ea9839;
  text-align: center;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover {
  background: #ea9839;
  border: 2px solid #fff;
  color: #ffffff;
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
  width: 93%;
  border: 2px solid #ea9839;

}

}
</style>
