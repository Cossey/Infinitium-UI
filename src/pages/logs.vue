<template>
  <f7-page name="logs" ptr @ptr:refresh="fetchData">
    <f7-navbar title="Logs" back-link="DNS Server">
      <f7-nav-right>
         <f7-link
          icon-ios="f7:trash"
          icon-aurora="f7:trash"
          icon-md="material:delete"
          class="deletePopover"
          @click="openDeletePopover"
        ></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-list>
      <f7-list-item
        v-for="log in logs"
        v-bind:key="log"
        :title="log.fileName"
        :footer="log.size"
        :link="'/logs/file/' + log.fileName + '/'"
        view=".view-main"
        panel-close
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
    deleteStats: function () {
      f7.dialog.confirm('Do you want to delete all statistics?', 'Delete All Stats', () =>{
        api.get("deleteAllStats");
      });
    },
    deleteLogs: function () {
      f7.dialog.confirm('Do you want to delete all log files?', 'Delete All Logs', () => {
        api.get("deleteAllLogs").then((data) => {
          this.fetchData();
        });
      })
    },
    openDeletePopover() {
      const self = this;
      if (!self.deletePopover) {
        self.deletePopover = f7.actions.create({
          buttons: [
            {
              text: 'Delete All Stats',
              onClick: function() {
                self.deleteStats();
              }
            },
            {
              text: 'Delete All Logs',
              onClick: function() {
                self.deleteLogs();
              }
            },
            {
              text: 'Cancel',
              color: 'red',
            },
          ],
          // Need to specify popover target
          targetEl: self.$el.querySelector('.deletePopover'),
        });
      }

      // Open
      self.deletePopover.open();
    },
  },
};
</script>