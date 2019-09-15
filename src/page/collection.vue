<template>
    <v-timeline
      align-top
      dense
      fill-dot
    >
      <div v-for="(item,index) in list">
      <v-timeline-item
      class="mb-6"
      align-top
      hide-dot
    >
      <span>{{item.year}}</span>
    </v-timeline-item>

      <v-timeline-item
        color="teal lighten-3"
        small
        v-for="(item2,index2) in item.list"
      >
        <template v-slot:opposite>
          <span> {{item2.month}}</span>
        </template>
        <div class="py-4">
          <h2 class="headline font-weight-light mb-4 cyan--text"> {{item2.month}}月新番</h2>
          <div>
            <v-container fluid class="box">
              <v-layout  row wrap>
                <v-flex xs2 v-for="(item4,index4) in item2.list" pa-1>
                  <v-img
                    :src="'./api/getCollectionImg?name=' + item4.name"
                    height="200"
                    class="grey darken-4"
                  ></v-img>

                  {{item4.name}} - <span v-if="item4.season">(第{{item4.season}}期) </span><span class="cyan--text">{{item4.roll}}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </div>
      </v-timeline-item>
      </div>
    </v-timeline>
</template>

<script>
    export default {
        name: "app-collection-page",
        data () {
            return {
                list:[]
            }
        },
        methods: {
            load(){
                let _this = this;
                fetch(this.$g.hostName + "/getCollection").then(
                    function(response) {
                        return response.json();
                    }
                ).then((json)=> {
                    _this.list = json;
                    //_this.list = ["",""];
                    console.log(Object.keys(_this.list[0])[0]);
                    //_this.filter();
                });
            },
            keyName(obj){
               return  Object.keys(obj)[0]
            }
        }, created() {
            let _this = this;
            this.$g.mode('collectionMode');
            this.$g.loadCollection = function(){_this.load()};
            this.load();
        },
    }
</script>

<style scoped>

</style>
