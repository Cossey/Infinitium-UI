<template>
  <f7-page name="logsviewer" ptr @ptr:refresh="fetchData">
    <f7-navbar :title="'Log ' + file">
      <f7-nav-left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          text="Logs"
          panel-open="left"
          link="/logs/"
          view=".view-left"
        ></f7-link>
      </f7-nav-left>
    </f7-navbar>
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
import { f7, f7ready, theme } from "framework7-vue";
import { ref } from "vue";

export default {
  setup() {
    const log = ref("");

    return {
      log,
    };
  },
  props: {
    file: String,
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  methods: {
    fetchData: function (done) {
      console.log(this.file);
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