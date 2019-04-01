<template>
  <div class="text-xs-center">
    <v-dialog

      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      v-model="dialog"
      width="500"
    >
      <v-card>

        <v-toolbar card dark color="teal lighten-3">
          <v-btn icon dark @click="close()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{name}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text>
          <template>
            <v-combobox
              v-model="condition"
              :items="itemsList"
              label="Your favorite hobbies"
              chips
              small-chips
              clearable
              solo
              multiple
            >
              <template v-slot:selection="data">
                <v-chip
                  :selected="data.selected"
                  close
                  @input="remove(data.item)"
                >
                  <strong>{{ data.item }}</strong>&nbsp;
                </v-chip>
              </template>
            </v-combobox>
          </template>

          <v-list >
            <v-list-tile
              v-for="item in file"
              :key="item"
              avatar
              @click=""
            >
              <v-list-tile-content >
                <v-list-tile-title>{{item}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>

        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    export default {
        mixins: [],
        props: ['dialog','name'],
        commponents: {},
        name: 'app-view-page',
        data() {
            return {
              lock:true,
              itemsList:[],
              file:[],
              condition:[]
            }
        }, methods: {
        remove(data) {
          let _this = this;
          fetch("http://127.0.0.1:3000/remove?name=" + this.name + "&text=" + data).then(function(response) {return response.json();})
            .then((json)=> {
              _this.file = json.file;
              _this.condition = json.condition;
              _this.lock = true;
            });
        },
        close() {
          this.$emit('update:dialog', false)
        }
        }, beforeMount() {
        }, mounted() {
        }, beforeUpdate() {
        }, updated() {
        }, render() {},
        watch:{
          name(data){
            let  _this = this;
            fetch("http://127.0.0.1:3000/get?name=" + this.name).then(function(response) {return response.json();})
              .then((json)=> {
              console.log(json);
               _this.file = json.file;
               _this.condition = json.condition;
               _this.lock = true;
            });
          },
          condition(newData){
            if (this.lock){
              this.lock = false;
              return;
            }
            let _this = this;
            fetch("http://127.0.0.1:3000/add?name=" + this.name + "&text=" + newData[newData.length - 1]).then(function(response) {return response.json();})
              .then((json)=> {
                _this.file = json.file;
                _this.condition = json.condition;
                _this.lock = true;
              });
          }
        }
    }
</script>

