<template>
  <f7-popup>
    <f7-page>
      <f7-navbar :title="$t('apps.configuration', {app: appName})">
        <template v-slot:left>
          <f7-link popup-close>{{$t('dialogs.cancel')}}</f7-link>
        </template>
        <template v-slot:right>
          <f7-link @click="saveData">{{$t('dialogs.save')}}</f7-link>
        </template>
      </f7-navbar>
      <f7-list>
        <f7-list-input type="textarea" resizable v-model:value="config"></f7-list-input>
        <f7-block-footer>
          <p>{{$t('apps.reloadonsave')}}</p>
        </f7-block-footer>
      </f7-list>
    </f7-page>
  </f7-popup>
</template>
<script>
import api from "../js/api";
import { f7, f7ready, theme } from "framework7-vue";
import { ref } from "vue";

export default {
  data() {
    return {
      config: ref(""),
    };
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  props: {
    appName: String,
  },
  methods: {
    fetchData() {
      api.get("apps/getConfig", [
        ["name", this.appName],
      ]).then((res) => {
        this.config = res.config;
      }).catch((err) => {
        f7.popup.close();
      });
    },
    saveData() {
      var self = this;
      api.post("apps/setConfig", [
        ["name", this.appName],
      ],
        "config=" + this.config,
      ).then((res) => {
        f7.popup.close();
      });
    },
  },
}
</script>