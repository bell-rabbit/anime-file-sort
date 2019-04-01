<template>
  <div>
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

      <v-btn icon @click="openAddDialog()">
        <v-icon>add</v-icon>
      </v-btn>

      <v-btn icon @click="run()">
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
    <v-dialog
      v-model="addDialog"
      width="500"
    >
    <v-card>
      <v-card-title class="headline teal lighten-3 white--text" primary-title >
        Add
      </v-card-title>

      <v-card-text>
        <v-text-field
          label="Folder Name"
          v-model="folderName"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="dialog = false"
        >
          cancel
        </v-btn>
        <v-btn
          color="primary"
          flat
          @click="addFolder()"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    mixins: [],
    props: ['search'],
    name: 'app-nav',
    data() {
      return {
        text:"",
        addDialog:false,
        folderName:""
      }
    }, methods: {
      openAddDialog(){
        this.addDialog = true;
        this.folderName = "";
      },
      addFolder(){
        if (this.folderName && this.folderName !== ""){
        fetch("http://127.0.0.1:3000/add/folder?name=" + this.folderName).then(response => response.json()).
        then((json)=> {
          if(json.status === "success"){
            this.$g.load();
          }else{
            alert("fail!");
          }
          this.addDialog = false;
        });
        }
      },
      run(){
          fetch(this.$g.hostName + "/start").then(response => response.json()).
          then((json)=> {
            if(json.status === "success"){
              alert("success!");
            }else{
               alert("fail!");
            }
          });
      },
      keyup(){
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
