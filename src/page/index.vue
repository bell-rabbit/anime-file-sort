<template>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
          <v-list >
<!--            <v-subheader inset>Folders</v-subheader>-->

            <v-list-tile
              v-for="item in file"
              :key="item"
              avatar
              @click=""
            >
<!--              <v-list-tile-avatar>-->
<!--                <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>-->
<!--              </v-list-tile-avatar>-->

              <v-list-tile-content @click="dialog(item)">
                <v-list-tile-title>{{item}}</v-list-tile-title>
<!--                <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>-->
              </v-list-tile-content>


              <!--              <v-list-tile-action>-->
<!--                <v-btn icon ripple>-->
<!--                  <v-icon color="grey lighten-1">info</v-icon>-->
<!--                </v-btn>-->
<!--              </v-list-tile-action>-->
            </v-list-tile>

            <app-view-page :dialog.sync="showDialog" :name="dialogName"></app-view-page>

<!--            <v-divider inset></v-divider>-->
<!--            <v-list-tile-->
<!--              v-for="item in items2"-->
<!--              :key="item.title"-->
<!--              avatar-->
<!--              @click=""-->
<!--            >-->
<!--              <v-list-tile-avatar>-->
<!--                <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>-->
<!--              </v-list-tile-avatar>-->

<!--              <v-list-tile-content>-->
<!--                <v-list-tile-title>{{ item.title }}</v-list-tile-title>-->
<!--                <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>-->
<!--              </v-list-tile-content>-->

<!--              <v-list-tile-action>-->
<!--                <v-btn icon ripple>-->
<!--                  <v-icon color="grey lighten-1">info</v-icon>-->
<!--                </v-btn>-->
<!--              </v-list-tile-action>-->
<!--            </v-list-tile>-->
          </v-list>
      </v-flex>
    </v-layout>
  </template>

<script>
  import AppViewPage from "./view";
  export default {
        mixins: [],
        props: ['searchText'],
        components: {AppViewPage},
        name: 'app-index-page',
          data () {
            return {
              dialogName:"",
              showDialog:false,
              sourceFile:[],
              file: []
            }
        },
      methods: {
        dialog(name){
          this.dialogName  = name;
          this.showDialog = true;
        },
        filter(){
          this.file = [];
          for (let sourceFileElement of this.sourceFile) {
            if (this.searchText === "" || sourceFileElement.includes(this.searchText)){
              this.file.push(sourceFileElement);
            }
          }
        },
        load(){
          let _this = this;
          fetch("http://127.0.0.1:3000/list").then(
            function(response) {
              return response.json();
            }
          ).then((json)=> {
            _this.sourceFile = json;
            _this.filter();
          });
        }
      },
        beforeCreate() {

        }, created() {
          let _this = this;
          this.$g.load = function(){_this.load()};
          this.load();
        }, beforeMount() {
        }, mounted() {
        }, beforeUpdate() {
        }, updated() {
        }, render() {},
          watch:{
            searchText(d){
              this.filter();
            }
          }
    }
</script>
