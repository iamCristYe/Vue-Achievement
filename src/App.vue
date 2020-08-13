<template>
  <v-app>
    <v-app-bar app color="#DDA300" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        {{
        username === "" ? me + org : username + org
        }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
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
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-if="!viewonly"
            v-model.trim="username"
            :label="you+name"
            :placeholder="namenotsent"
          ></v-text-field>
        </v-col>
        <div>
          <v-btn v-if="!viewonly" rounded color="primary" dark @click="changeParam">确定</v-btn>
        </div>
        <div>
          <v-btn v-if="viewonly" rounded color="primary" dark @click="resetForm">制作我的</v-btn>
        </div>
      </v-container>
    </v-main>
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
      return this.viewonly ? "null" : "click";
    },
  },
  created: function () {
    let url = new URL(window.location);

    //need this for sharing on weixin
    if (url.searchParams.get("weixin") != "crappy") {
      window.location = window.location + "?weixin=crappy";
    } else if (window.location.href.indexOf("name=") != -1) {
      this.username = url.searchParams.get("name");
      this.viewonly = true;
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
      this.viewonly = true;
      let newTitle = this.username + this.org;
      let newURL =
        window.location.href.split("?")[0] +
        "?weixin=crappy&name=" +
        this.username +
        "&selected=" +
        selectedArr;
      history.pushState({}, newTitle, newURL);
      //window.location.hash = "#" + this.username + "," + selectedArr;

      let node = document.getElementById("app");
      toimg.toPng(node).then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
      });
    },
    resetForm: function () {
      this.username = "";
      this.viewonly = false;
      this.achievements.forEach((element) => {
        element.selected = false;
      });
    },
  },
};
</script>
