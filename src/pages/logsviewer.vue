<template>
  <f7-page name="logsviewer" ptr @ptr:refresh="fetchData">
    <f7-navbar>
      <f7-nav-left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>Log {{ file }}</f7-nav-title>
      <f7-nav-right>
        <f7-link
          @click="deleteLog"
          icon-aurora="f7:trash"
          icon-md="material:delete"
          v-if="theme.ios != true"
        ></f7-link>
        <f7-link
          @click="downloadLog"
          icon-aurora="f7:download_circle"
          icon-md="material:download"
          v-if="theme.ios != true"
        ></f7-link>
        <f7-link
          @click="f7router.back()"
          icon-ios="f7:multiply"
          icon-aurora="f7:multiply"
          icon-md="material:close"
        ></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-toolbar position="bottom" v-if="theme.ios">
        <f7-link
          @click="deleteLog"
          icon-ios="f7:trash"
        ></f7-link>
        <f7-link
          @click="downloadLog"
          icon-ios="f7:download_circle"
        ></f7-link>
      <f7-link>Download</f7-link>
      <f7-link>Delete</f7-link>
    </f7-toolbar>
    <f7-block>
      <p class="wrap">{{ log }}</p>
    </f7-block>
  </f7-page>
</template>
<style scoped>
.wrap {
  white-space: pre-wrap;
}
</style>
<script>
import api from "../js/api";
import { f7, f7ready, theme, f7router } from "framework7-vue";
import { ref } from "vue";

export default {
  setup() {
    const log = ref("");

    return {
      log,
      theme
    };
  },
  props: {
    file: String,
    f7router: Object,
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  methods: {
    fetchData: function (done) {
      api
        .getLog(this.file)
        .then((fileData) => {
          this.log = fileData;
        })
        .finally(() => {
          if (typeof done !== "undefined") done();
        });
    },
  },
};
</script>