<template>
  <f7-page name="logs" ptr @ptr:refresh="fetchData">
    <f7-navbar title="Logs">
      <template v-slot:left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="material:menu"
          icon-md="material:menu"
          panel-open="left"
        />
      </template>
      <template v-slot:right>
        <f7-link
          icon-md="material:done_all"
          icon-aurora="material:done_all"
          @click="selectToggle"
          :text="($theme.ios) ? ((selectActive) ? 'Done' : 'Select') : ''"
        />
      </template>
    </f7-navbar>

    <f7-toolbar bottom v-if="selectActive">
      <f7-link
        icon-aurora="material:delete"
        icon-md="material:delete"
        :text="(selectItems.length > 0) ? 'Delete ' + selectItems.length : 'Delete All'"
        @click="deleteSelected"
      />
      <f7-link
        icon-aurora="material:pie_chart"
        icon-md="material:pie_chart"
        :text="'Delete All Stats'"
        @click="deleteStats"
      />
    </f7-toolbar>

    <f7-list>
      <f7-list-item
        v-for="log in logs"
        :key="log.fileName"
        :title="log.fileName"
        :after="log.size"
        view=".view-main"
        :checkbox="selectActive"
        :checked="selectItemSelected(log.fileName)"
        link="#"
        @click="(e) => logClick(e, log.fileName)"
        :swipeout="!$device.desktop"
        @swipeout:deleted="removeLog(log.fileName)"
        :no-chevron="selectActive"
      >
        <f7-swipeout-actions right v-if="!$device.desktop">
          <f7-swipeout-button delete confirm-text="Are you sure you want to delete this log?">Delete</f7-swipeout-button>
        </f7-swipeout-actions>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import { f7, f7ready } from "framework7-vue";
import SelectMixin from "@/components/select-mixin";

export default {
  mixins: [SelectMixin],
  props: {
    f7router: Object
  },
  data() {
    return {
      logs: [],
    };
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();

      f7.on("logDeleted", this.fetchData);
    });
  },
  methods: {
    logClick(event, fileName) {
      if (this.selectActive) {
        this.selectItemToggle(fileName);
      } else {
        this.f7router.navigate("/logs/file/" + fileName + "/");
      }
    },
    removeLog: function (logFile) {
      this.$api.delete("Log", "log", "fileName", logFile, this.logs);
    },
    fetchData: function (done) {
      this.$api
        .get("listLogs")
        .then((res) => {
          this.logs = res.logFiles;
        })
        .finally(() => {
          if (typeof done !== "undefined") done();
        });
    },
    deleteStats: function () {
      f7.dialog.confirm(
        "Do you want to delete all statistics?",
        "Delete All Stats",
        () => {
          this.$api.get("deleteAllStats");
        }
      );
    },
    deleteSelected: function () {
      if (this.selectItems.length > 0) {
        for (let i = 0; i < this.selectItems.length; i++) {
          this.removeLog(this.selectItems[i]);
        }
        this.selectClear();
      } else {
        f7.dialog.confirm(
          "Do you want to delete all log files?",
          "Delete All Logs",
          () => {
            this.$api.get("deleteAllLogs").then((data) => {
              this.fetchData();
            });
          }
        );
      }
    },
  },
};
</script>