<template>
  <f7-app v-bind="f7params" :domCache="false">
    <!-- Left panel with cover effect when hidden -->
    <f7-panel left cover :visible-breakpoint="960">
      <f7-view class="view-left">
        <f7-page>
          <f7-navbar title="Technitium DNS">
          </f7-navbar>
          <f7-list>
            <f7-list-item link="/" view=".view-main" panel-close title="Dashboard">
              <template #media>
                <f7-icon ios="f7:gauge" md="material:speed" aurora="material:speed"></f7-icon>
              </template>
            </f7-list-item>
          </f7-list>

          <f7-list>
            <f7-list-item link="/zones/" view=".view-main" panel-close title="Zones">
              <template #media>
                <f7-icon ios="f7:shield_fill" md="material:shield" aurora="material:shield"></f7-icon>
              </template>
            </f7-list-item>
            <f7-list-item link="/allowed/" view=".view-main" panel-close title="Allowed">
              <template #media>
                <f7-icon
                  ios="f7:checkmark_shield_fill"
                  md="material:gpp_good"
                  aurora="material:gpp_good"
                ></f7-icon>
              </template>
            </f7-list-item>
            <f7-list-item link="/blocked/" view=".view-main" panel-close title="Blocked">
              <template #media>
                <f7-icon ios="f7:xmark_shield_fill" md="material:gpp_bad" aurora="material:gpp_bad"></f7-icon>
              </template>
            </f7-list-item>
            <f7-list-item link="/cache/" view=".view-main" panel-close title="Cache">
              <template #media>
                <f7-icon ios="f7:bolt" md="material:bolt" aurora="material:bolt"></f7-icon>
              </template>
            </f7-list-item>
          </f7-list>

          <f7-list>
            <f7-list-item link="/settings/" view=".view-main" panel-close title="Settings">
              <template #media>
                <f7-icon ios="f7:gear" md="material:settings" aurora="material:settings"></f7-icon>
              </template>
            </f7-list-item>
            <f7-list-item link="/dhcp/" view=".view-main" panel-close title="DHCP">
              <template #media>
                <f7-icon ios="f7:desktopcomputer" md="material:computer" aurora="material:computer"></f7-icon>
              </template>
            </f7-list-item>
            <f7-list-item link="/apps/" view=".view-main" panel-close title="Apps">
              <template #media>
                <f7-icon ios="f7:app" md="material:apps" aurora="material:apps"></f7-icon>
              </template>
            </f7-list-item>
          </f7-list>

          <f7-list>
            <f7-list-item link="/tools/" view=".view-main" panel-close title="Tools">
              <template #media>
                <f7-icon ios="f7:hammer_fill" md="material:handyman" aurora="material:handyman"></f7-icon>
              </template>
            </f7-list-item>
            <f7-list-item link="/client/" view=".view-main" panel-close title="DNS Client">
              <template #media>
                <f7-icon ios="f7:globe" md="material:public" aurora="material:public"></f7-icon>
              </template>
            </f7-list-item>
            <f7-list-item link="/logs/" title="Logs" view=".view-main" panel-close>
              <template #media>
                <f7-icon
                  ios="f7:doc_plaintext"
                  md="material:description"
                  aurora="material:description"
                ></f7-icon>
              </template>
            </f7-list-item>
          </f7-list>

          <f7-list>
            <f7-list-item link="/about/" view=".view-main" panel-close title="About">
              <template #media>
                <f7-icon ios="f7:question_circle_fill" md="material:help" aurora="material:help"></f7-icon>
              </template>
            </f7-list-item>
          </f7-list>

          <template v-slot:fixed>
            <div class="account">
              <f7-list media-list>
                <f7-list-item
                  :title="user"
                  :footer="domain"
                  io="f7:person_alt_circle_fill"
                  link="/user/"
                  no-chevron
                  panel-close
                  view=".view-main"
                >
                  <template #media>
                    <f7-icon
                      size="36"
                      ios="f7:person_alt_circle_fill"
                      aurora="material:account_circle"
                      md="material:account_circle"
                      color="gray"
                    ></f7-icon>
                  </template>
                </f7-list-item>
              </f7-list>
            </div>
          </template>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>

    <!-- App login -->
    <f7-login-screen id="my-login-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title>
            <img src="@/assets/logo.png" />
            <br />Login
          </f7-login-screen-title>
          <f7-list form>
            <f7-list-input
              type="text"
              name="username"
              placeholder="Your username"
              autocomplete="username"
              v-model:value="username"
            ></f7-list-input>
            <f7-list-input
              type="password"
              name="password"
              placeholder="Your password"
              autocomplete="current-password"
              v-model:value="password"
            ></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-list-button title="Login" @click="doLogin()"></f7-list-button>
            <f7-block-footer>Forgot Password?</f7-block-footer>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-app>
</template>
<style scoped>
.panel-left::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.panel-left {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.panel-left .page {
  padding-bottom: calc(
    var(--f7-tabbar-labels-height) + var(--f7-safe-area-bottom)
  );
}

.panel-left .account {
  z-index: 300;
  height: calc(var(--f7-tabbar-labels-height) + var(--f7-safe-area-bottom));
  background: #f5f5f5 !important;
  position: fixed;
  bottom: calc(var(--f7-safe-area-bottom));
  width: 100%;
}

.panel-left .account .list {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-bottom: 0;
  height: calc(var(--f7-tabbar-labels-height) + var(--f7-safe-area-bottom));
}

.panel-left .account:deep() .item-inner {
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 4px;
  margin-left: 4px;
}

.panel-left .account:deep() .item-content {
  padding-left: 5px;
}

.panel-left .account:deep() .item-media {
  padding-top: 6px;
  padding-bottom: 6px;
}

.theme-dark .panel-left .account {
  background: #232323 !important;
}
</style>
<script>
import { ref, onMounted } from "vue";
import { f7, f7ready } from "framework7-vue";

import api from "../js/api";

import routes from "../js/routes.js";
import { useStore } from "framework7-vue";
import store from "../js/store";
import { getDevice } from "framework7";

export default {
  setup() {
    let theme = localStorage.getItem("theme");
    let darkMode = localStorage.getItem("dark") || "auto";

    const device = getDevice();

    if ((!theme || theme === "auto") && device.desktop) {
      theme = "aurora";
    }

    // Framework7 Parameters
    const f7params = {
      name: "Technitium DNS Server", // App name
      theme: theme || "auto", // Automatic theme detection
      autoDarkTheme: darkMode === "auto",
      // App store
      store: store,
      // App routes
      routes: routes,
      // Register service worker
      // serviceWorker: {
      //   path: "/service-worker.js",
      // },
      touch: {
        tapHold: true,
      },
      smartSelect: {
        closeOnSelect: true
      },
    };

    // Login screen data
    const username = ref("");
    const password = ref("");
    const user = useStore(store, "user");
    const domain = useStore(store, "domain");

    const doLogin = () => {
      api.doLogin(username.value, password.value);
      password.value = "";
    };

    onMounted(() => {
      f7ready((f7) => {
        api.doInitialLogin();
      });
    });

    return {
      f7params,
      username,
      password,
      user,
      domain,
      doLogin,
    };
  },
  mounted() {
    f7ready((f7) => {
      this.updateThemeConfig();
    });
  },
  methods: {
    updateThemeConfig() {
      let darkMode = localStorage.getItem("dark") || "auto";
      console.log("Update theme", darkMode);
      if (darkMode !== "auto") {
        if (darkMode === "dark") {
          f7.$("html").addClass("theme-dark");
        } else {
          f7.$("html").removeClass("theme-dark");
        }
      }
    },
  },
};
</script>