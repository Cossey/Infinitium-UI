<template>
  <div class="ptr-content" @ptr:refresh="fetchData">
    <div class="ptr-preloader">
      <div class="preloader"></div>
      <div class="ptr-arrow"></div>
    </div>
    <template v-if="loading">
      <f7-list media-list>
        <f7-list-item
          v-for="n in 7"
          :key="n"
          class="skeleton-text skeleton-effect-wave"
          title="DNSAPP Application"
          subtitle="Version 0.0.0"
          footer="DnsAppClassNames"
        ></f7-list-item>
      </f7-list>
    </template>
    <template v-else>
      <f7-list media-list v-if="apps.length > 0">
        <template :key="app" v-for="app in apps">
          <f7-list-item
            :link="configLink(app.name)"
            :footer="classPath(app)"
            :title="app.name"
            :subtitle="$t('misc.version', { version: app.version})"
            :badge="badge(app)"
            badge-color="orange"
            :swipeout="!$device.desktop"
            @swipeout:deleted="uninstallApp(app.name)"
            @contextmenu="showContextMenu(app, $event)"
          >
            <template v-if="!$device.desktop">
              <f7-swipeout-actions left v-if="app.updateAvailable">
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
        <f7-block-footer class="text-align-center">
          <p>{{$t('misc.items', { n: apps.length} )}}</p>
        </f7-block-footer>
      </f7-list>
      <f7-block v-else class="text-align-center">
        <p>
          <i class="f7-icons if-ios" style="font-size: 100pt">nosign</i>
          <i class="material-icons if-not-ios" style="font-size: 100pt">block</i>
        </p>
        <p>{{ $t('apps.noneinstalled') }}</p>
      </f7-block>
    </template>
  </div>
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
  data() {
    return {
      apps: ref([]),
      loading: ref(true),
    };
  },
  props: {
    f7router: Object,
  },
  methods: {
    badge(app) {
      if (app.updateAvailable) {
        return app.$t('apps.updatever', {version: app.updateVersion});
      } else {
        return null;
      }
    },
    classPath(app) {
      if (app.dnsApps.length > 0) {
        var paths = app.dnsApps.map((dnsApp) => dnsApp.classPath);
        return paths.join(", ");
      }
      return null;
    },
    configLink(appName) {
      return `${encodeURIComponent(appName)}/config`;
    },
    showContextMenu(app, event) {
      event.preventDefault();

      var items = [
        {
          label: "Configure App",
          onClick: () => {
            this.f7router.navigate(this.configLink(app.name));
          }
        },
      ];

      if (app.updateAvailable) {
        items.push({
          label: "Update App",
          onClick: () => {
            this.updateApp(app);
          },
        });
      }

      items.push({
        label: "Uninstall App",
        icon: 'trash',
        onClick: () => {
          f7.dialog.confirm(
            "Are you sure you want to uninstall this app?",
            "Uninstall",
            () => {
              this.uninstallApp(app.name);
            });
        }
      });


      this.$contextmenu({
        x: event.x,
        y: event.y,
        items: items
      });
    },
    fetchData(done) {
      this.$api.get("apps/list").then((res) => {
        this.apps = res.apps;
        this.loading = false;
        if (done) {
          done.detail();
        }
      });
    },
    updateApp(entry) {
      if (!entry.updateUrl) {
        f7.dialog.alert(app.$t('apps.updaterrorurl'));
        return;
      }
      f7.dialog.preloader(app.$t('apps.updating'));
      this.$api.get("apps/downloadAndUpdate", [
        ["name", entry.name],
        ["url", entry.updateUrl],
      ]
      ).then((res) => {
        this.fetchData();
      }).finally(() => {
        f7.dialog.close();
      });
    },
    uninstallApp(appName) {
      f7.dialog.preloader(app.$t('apps.uninstalling'));
      this.$api.get("apps/uninstall", [
        ["name", appName]
      ]).then((res) => {
        this.fetchData();
      }).finally(() => {
        f7.dialog.close();
      });
    },
  },
}
</script>