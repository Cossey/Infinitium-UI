<template>
  <f7-list media-list v-if="loading">
    <f7-list-item
      v-for="n in 7"
      :key="n"
      class="skeleton-text skeleton-effect-wave"
      title="Full Name"
      subtitle="Version 0.0.0"
      text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lobortis et massa ac interdum. Cras consequat felis at consequat hendrerit. Aliquam vestibulum vitae lorem ac iaculis. Praesent nec pharetra massa, at blandit lectus. Sed tincidunt, lectus eu convallis elementum, nibh nisi aliquet urna, nec imperdiet felis sapien at enim."
      footer="00.00 KB"
    ></f7-list-item>
  </f7-list>
  <f7-list media-list v-else>
    <template v-if="storeApps.length > 0">
      <f7-list-item
        v-for="app in storeApps"
        :key="app.name"
        :title="app.name"
        :subtitle="'Version ' + app.version"
        :text="app.description"
        :footer="app.size"
        :badge="appBadge(app)"
        :badge-color="appBadgeColour(app)"
        link="#"
        @click="storeMenu(app)"
        no-chevron
        :swipeout="!$device.desktop"
        @swipeout:deleted="uninstallApp(app.name)"
      >
        <template v-if="!$device.desktop">
          <f7-swipeout-actions left>
            <f7-swipeout-button color="orange" @click="updateApp(app)">Update</f7-swipeout-button>
          </f7-swipeout-actions>
          <f7-swipeout-actions right>
            <f7-swipeout-button
              delete
              confirm-text="Are you sure you want to uninstall this app?"
            >Uninstall</f7-swipeout-button>
          </f7-swipeout-actions>
        </template>
      </f7-list-item>
    </template>
    <template v-else>
      <f7-list-item title="No apps found" text="Could not find any apps on the store."></f7-list-item>
      <f7-list-button title="Try again" @click="refetchData"></f7-list-button>
    </template>
  </f7-list>
</template>

<script>
import { f7, f7ready } from "framework7-vue";
import { ref } from "vue";

export default {
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  emits: ["appInstalled"],
  data() {
    return {
      storeApps: ref([]),
      loading: ref(true),
    };
  },
  methods: {
    appBadge(app) {
      return app.updateAvailable ? "Update Available" : app.installed ? "Installed" : null;
    },
    appBadgeColour(app) {
      return app.updateAvailable ? "orange" : app.installed ? "green" : null;
    },
    updateApp(app) {
      f7.dialog.preloader("Updating...");
      this.$api.get("", [
        ["name", app.name],
        ["url", app.url],
      ]).then((res) => {
        f7.toast.create({
          text: app.name + " Updated",
          closeTimeout: 3000,
          horizontalPosition: "center",
        }).open();
        this.fetchData();
      }).finally(() => {
        f7.dialog.close();
      });
    },
    uninstallApp(app) {
      f7.dialog.preloader("Uninstalling...");
      this.$api.get("apps/uninstall", [
        ["name", app.name]
      ]).then((res) => {
        f7.toast.create({
          text: app.name + " Uninstalled Sucessfully",
          closeTimeout: 3000,
          horizontalPosition: "center",
        }).open();
        this.fetchData();
      }).finally(() => {
        f7.dialog.close();
      });
    },
    refetchData() {
      this.loading = true;
      this.fetchData();
    },
    fetchData() {
      this.$api.get("apps/listStoreApps").then((res) => {
        this.storeApps = res.storeApps;
      }).finally(() => {
        this.loading = false;
      });
    },
    installApp(app) {
      f7.dialog.preloader("Installing...");
      this.$api.get("apps/downloadAndInstall", [
        ["name", app.name],
        ["url", app.url]
      ]).then((res) => {
        this.refetchData();
        f7.emit("appInstalled", app);
        f7.toast.create({
          text: app.name + " Installed Sucessfully",
          closeTimeout: 3000,
          horizontalPosition: "center",
        }).open();
      }).finally(() => {
        f7.dialog.close();
      });
    },
    storeMenu(app, forceToPopover = false) {
      var buttons = [
        {
          text: app.name,
          label: true,
        },
      ];

      if (app.updateAvailable) {
        buttons.push({
          text: "Update",
          color: "orange",
          onClick: () => {
            this.updateApp(app);
          },
        });
      }

      if (app.installed) {
        buttons.push({
          text: "Uninstall",
          color: "red",
          onClick: () => {
            f7.dialog.confirm(
              "Are you sure you want to uninstall this app?",
              "Uninstall",
              () => {
                this.uninstallApp(app);
              });
          }
        });
      } else {
        buttons.push({
          text: "Install",
          color: "green",
          onClick: () => {
            f7.dialog.confirm(
              "Are you sure you want to install this app?",
              "Install",
              () => {
                this.installApp(app);
              });
          }
        });
      }

      buttons.push({
        text: 'Cancel',
      });

      f7.actions.create({
        buttons: buttons,
      }).open();
    }
  },
}
</script>