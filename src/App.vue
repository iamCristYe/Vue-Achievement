<template>
  <v-app>
    <v-overlay v-if="pageStatus=='ImgSharePageProcessing'">{{generatingImage}}</v-overlay>
    <v-flex id="forShare">
      <v-app-bar app color="#DDA300" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{username === "" ? title : title.replace(me,username)}}</v-toolbar-title>
        <vue-title :title="username === '' ? title : title.replace(me,username)"></vue-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <!-- for cache -->
      <v-row align="center" justify="center">
        <v-img src="../public/QRcode.svg" max-width="0"></v-img>
      </v-row>
      <v-main v-if="pageStatus!='ImgSharePage'">
        <v-container class="fill-height" fluid>
          <v-col v-for="achievement in achievements" :key="achievement.id" cols="12">
            <v-card
              class="mx-auto"
              max-width="344"
              outlined
              @[clickable]="achievement.selected = !achievement.selected"
              :color="achievement.selected ? achievement.color : 'white'"
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="headline mb-1">{{ achievement.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ achievement.description }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile v-if="achievement.selected">{{ achievement.emoji }}</v-list-item-avatar>
              </v-list-item>
            </v-card>
          </v-col>
          <v-row>
            <v-col cols="12">
              <v-row align="center" justify="center">
                <v-text-field
                  v-if="pageStatus=='edit'"
                  v-model.trim="username"
                  :label="askname"
                  :placeholder="namenotsent"
                  class="shrink"
                ></v-text-field>
              </v-row>
              <v-row align="center" justify="center">
                <v-btn
                  align="center"
                  justify="center"
                  v-if="pageStatus=='edit'"
                  rounded
                  color="primary"
                  dark
                  @click="changeParam"
                >{{generateSharePage}}</v-btn>
              </v-row>
              <v-row align="center" justify="center">
                <v-btn
                  align="center"
                  justify="center"
                  v-if="pageStatus=='view'"
                  rounded
                  color="primary"
                  dark
                  @click="resetForm"
                >{{produceMine}}</v-btn>
              </v-row>
              <v-row v-if="pageStatus=='ImgSharePageProcessing'" align="center" justify="center">
                <v-img src="../public/QRcode.svg" max-width="150px"></v-img>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <v-main v-if="pageStatus=='ImgSharePage'">
        <v-container class="fill-height" fluid>
          <v-alert type="success">
            <span v-html="sharePageInfo1"></span>
          </v-alert>

          <v-row align="center" justify="center">
            <img :src="shareImgSrc" style="max-height:300px" />
          </v-row>

          <v-alert type="info">
            <span v-html="sharePageInfo2"></span>
          </v-alert>
        </v-container>
      </v-main>
    </v-flex>
  </v-app>
</template>

<script>
import json from "./data.json";
import toimg from "html-to-image";

export default {
  name: "App",

  data: () => json,

  computed: {
    clickable: function () {
      return this.pageStatus == "view" ? "null" : "click";
    },
  },
  created: function () {
    let url = new URL(window.location);

    //need this for sharing on weixin
    if (url.searchParams.get("weixin") != "crappy") {
      window.location = window.location + "?weixin=crappy";
    } else if (window.location.href.indexOf("name=") != -1) {
      this.username = url.searchParams.get("name");
      this.pageStatus = "view";
      this.achievements.forEach((element) => {
        let selectedArray = url.searchParams.get("selected");
        if (selectedArray.indexOf("" + element.id) != -1) {
          element.selected = true;
        }
      });
    }
  },
  methods: {
    changeParam: function () {
      let selectedArr = [];
      this.achievements.forEach((element) => {
        if (element.selected) {
          selectedArr.push(element.id);
        }
      });
      if (this.username == "") {
        this.username = this.me;
      }
      this.pageStatus = "view";
      let newTitle = this.username + this.org;
      let newURL =
        window.location.href.split("?")[0] +
        "?weixin=crappy&name=" +
        this.username +
        "&selected=" +
        selectedArr;
      history.pushState({}, newTitle, newURL);
      //window.location.hash = "#" + this.username + "," + selectedArr;
      //console.log(this);

      let thisapp = this;
      let node = document.getElementById("forShare");
      this.pageStatus = "ImgSharePageProcessing";

      setTimeout(() => {
        //load QR
        toimg
          .toPng(node, { backgroundColor: "white" })
          .then(function (dataUrl) {
            //var img = document.getElementById("shareImg");
            //console.log(this);
            //console.log(thisapp);
            thisapp.shareImgSrc = dataUrl;
            thisapp.pageStatus = "ImgSharePage";
            window.scrollTo(0, 0);
            //document.body.appendChild(img);
          });
      }, 2000);
    },
    resetForm: function () {
      this.username = "";
      this.pageStatus = "edit";
      this.achievements.forEach((element) => {
        element.selected = false;
      });
      this.$vuetify.goTo(0);
    },
  },
};
</script>
