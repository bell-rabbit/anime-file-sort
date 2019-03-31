<template>
    <v-toolbar
      style="position: fixed;"
      fixed
      absolute
      color="teal lighten-3"
      dark
      scroll-off-screen
      scroll-target="#scrolling-techniques"
    >
<!--      <v-toolbar-side-icon></v-toolbar-side-icon>-->

      <v-toolbar-title>List</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="text"
        @keyup="keyup()"
        label="Solo"
        placeholder="search"
        solo
      ></v-text-field>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>add</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>play_arrow</v-icon>
      </v-btn>

<!--      <v-btn icon>-->
<!--        <v-icon>favorite</v-icon>-->
<!--      </v-btn>-->

<!--      <v-btn icon>-->
<!--        <v-icon>more_vert</v-icon>-->
<!--      </v-btn>-->
    </v-toolbar>
<!--    <div-->
<!--      id="scrolling-techniques"-->
<!--      class="scroll-y"-->
<!--      style="max-height: 600px;"-->
<!--    >-->
<!--      <v-container style="height: 1000px;"></v-container>-->
<!--    </div>-->
</template>

<script>
  export default {
    mixins: [],
    props: ['search'],
    name: 'app-nav',
    data() {
      return {
        text:""
      }
    }, methods: {
      keyup(){
        console.log(this.text);
        this.$emit('update:search', this.text)
      }
    }, beforeCreate() {
    }, created() {
    }, beforeMount() {
    }, mounted() {
    }, beforeUpdate() {
    }, updated() {
    }, render() {}
  }
</script>

<style>

</style>

<style scoped>

</style>
