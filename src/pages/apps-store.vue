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
  <template v-else>
    <f7-list media-list>
      <template v-if="storeApps.length > 0">
        <f7-list-item
          v-for="app in storeApps"
          :key="app.name"
          :title="app.name"
          :subtitle="$t('misc.version', { version: app.version})"
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
              <f7-swipeout-button color="orange" @click="updateApp(app)">{{ $t('apps.update') }}</f7-swipeout-button>
            </f7-swipeout-actions>
            <f7-swipeout-actions right>
              <f7-swipeout-button
                delete
                :confirm-text="$t('apps.uninstallconfirm', { app: app.name })"
              >{{ $t('apps.uninstall') }} </f7-swipeout-button>
            </f7-swipeout-actions>
          </template>
        </f7-list-item>
      </template>
      <template v-else>
        <f7-list-item :title="$t('apps.noapps')" :text="$t('apps.noappsmsg')"></f7-list-item>
        <f7-list-button :title="$t('misc.tryagain')" @click="refetchData"></f7-list-button>
      </template>
    </f7-list>
    <f7-block-footer class="text-align-center" v-if="storeApps.length > 0">
      <p>{{$t('misc.items', { n: storeApps.length})}}</p>
    </f7-block-footer>
  </template>
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
      return app.updateAvailable ? this.$t('apps.updateav') : app.installed ? this.$t('apps.installed') : null;
    },
    appBadgeColour(app) {
      return app.updateAvailable ? "orange" : app.installed ? "green" : null;
    },
    updateApp(app) {
      f7.dialog.preloader(this.$t('apps.updating'));
      this.$api.get("", [
        ["name", app.name],
        ["url", app.url],
      ]).then((res) => {
        f7.toast.create({
          text: this.$t('apps.updated', {app: app.name}),
          closeTimeout: 3000,
          horizontalPosition: "center",
        }).open();
        this.fetchData();
      }).finally(() => {
        f7.dialog.close();
      });
    },
    uninstallApp(app) {
      f7.dialog.preloader(this.$t('apps.uninstalling'));
      this.$api.get("apps/uninstall", [
        ["name", app.name]
      ]).then((res) => {
        f7.toast.create({
          text: this.$t('apps.uninstalledsuccess', {app: app.name}),
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
      f7.dialog.preloader(this.$t('apps.installing'));
      this.$api.get("apps/downloadAndInstall", [
        ["name", app.name],
        ["url", app.url]
      ]).then((res) => {
        this.refetchData();
        f7.emit("appInstalled", app);
        f7.toast.create({
          text: this.$t('apps.installedsuccess', {app: app.name}),
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
          text: this.$t('apps.update'),
          color: "orange",
          onClick: () => {
            this.updateApp(app);
          },
        });
      }

      if (app.installed) {
        buttons.push({
          text: this.$t('apps.uninstall'),
          color: "red",
          onClick: () => {
            f7.dialog.confirm(
              this.$t('apps.uninstallconfirm', { app: app.name }),
              this.$t('apps.uninstall'),
              () => {
                this.uninstallApp(app);
              });
          }
        });
      } else {
        buttons.push({
          text: this.$t('apps.install'),
          color: "green",
          onClick: () => {
            f7.dialog.confirm(
              this.$t('apps.installconfirm', {app: app.name}),
              this.$t('apps.install'),
              () => {
                this.installApp(app);
              });
          }
        });
      }

      buttons.push({
        text: this.$t('misc.cancel'),
      });

      f7.actions.create({
        buttons: buttons,
      }).open();
    }
  },
}
</script>