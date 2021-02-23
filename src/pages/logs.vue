<template>
  <f7-page name="logs" ptr @ptr:refresh="fetchData">
    <f7-navbar title="Logs" back-link="Back"></f7-navbar>
    <f7-list>
      <f7-list-item
        v-for="log in logs"
        v-bind:key="log"
        :title="log.fileName"
        :footer="log.size"
        :link="'/logs/file/' + log.fileName + '/'"
        swipeout
        @swipeout:deleted="removeLog(log.fileName)"
      >
        <f7-swipeout-actions right>
          <f7-swipeout-button
            delete
            confirm-text="Are you sure you want to delete this log?"
          >
            Delete
          </f7-swipeout-button>
        </f7-swipeout-actions>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import api from "../js/api";
import { ref } from "vue";
import { f7, f7ready } from "framework7-vue";

export default {
  setup() {
    const logs = ref([]);

    return {
      logs,
    };
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  methods: {
    removeLog: function (logFile) {
      api.delete("Log", "log", "fileName", logFile, this.logs);
    },
    fetchData: function (done) {
      api
        .get("listLogs")
        .then((res) => {
          this.logs = res.logFiles;
        })
        .finally(() => {
          if (typeof done !== "undefined") done();
        });
    },
  },
};
</script>