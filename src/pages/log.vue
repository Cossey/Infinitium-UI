<template>
  <f7-page name="logsviewer" ptr @ptr:refresh="fetchData">
    <f7-navbar back-link="Logs">
      <f7-nav-title sliding>Log {{ file }}</f7-nav-title>
    </f7-navbar>
    <f7-toolbar position="bottom">
      <f7-link
        @click="downloadLog"
        icon-aurora="material:download"
        icon-md="material:download"
        :text="$theme.ios ? 'Download' : ''"
      ></f7-link>
      <f7-link
        @click="deleteLog"
        icon-aurora="material:delete"
        icon-md="material:delete"
        :text="$theme.ios ? 'Delete' : ''"
      ></f7-link>
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
import { f7, f7ready } from "framework7-vue";
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
    f7router: Object,
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  methods: {
    fetchData: function (done) {
      this.$api
        .getLog(this.file)
        .then((fileData) => {
          this.log = fileData;
        })
        .finally(() => {
          if (typeof done !== "undefined") done();
        });
    },
    deleteLog: function () {
      f7.dialog.confirm(
        "Are you sure you want to delete this log?",
        "Delete Log",
        () => {
          this.$api.get("deleteLog", [["log", this.file]]).then(() => {
            f7.emit("logDeleted");
            this.f7router.back();
          });
        }
      );
    },
    downloadLog: function () {
      this.$api.downloadLog(this.file);
    },
  },
};
</script>