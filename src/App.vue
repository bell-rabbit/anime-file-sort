<template>
  <v-app id="app">
      <app-nav :search.sync="searchText"></app-nav>
      <router-view :search-text.sync="searchText"/>
  </v-app>
</template>

<script>
  import AppNav from "./components/nav";
  export default {
    name: 'App',
    components: {AppNav},
    data(){
      return{
      searchText:""
      }
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
