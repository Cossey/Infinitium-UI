<template>
  <f7-app v-bind="f7params">
    <!-- Left panel with cover effect when hidden -->
    <f7-panel left reveal :visible-breakpoint="960">
      <f7-view class="view-left">
        <f7-page>
          <f7-navbar title="DNS Server"></f7-navbar>
          <f7-list>
            <f7-list-item
              link="/dashboard/"
              view=".view-main"
              panel-close
              title="Dashboard"
            ></f7-list-item>
            <f7-list-item
              link="/settings/"
              view=".view-main"
              panel-close
              title="Settings"
            ></f7-list-item>
          </f7-list>

          <f7-list>
            <f7-list-item
              link="/zones/"
              view=".view-main"
              panel-close
              title="Zones"
            ></f7-list-item>
            <f7-list-item
              link="/allowed/"
              view=".view-main"
              panel-close
              title="Allowed"
            ></f7-list-item>
            <f7-list-item
              link="/blocked/"
              view=".view-main"
              panel-close
              title="Blocked"
            ></f7-list-item>
          </f7-list>

          <f7-list>
            <f7-list-item
              link="/client/"
              view=".view-main"
              panel-close
              title="DNS Client"
            ></f7-list-item>
            <f7-list-item
              link="/dhcp/"
              view=".view-main"
              panel-close
              title="DHCP"
            ></f7-list-item>
            <f7-list-item link="/logs/" title="Logs"></f7-list-item>
            <f7-list-item
              link="/about/"
              view=".view-main"
              panel-close
              title="About"
            ></f7-list-item>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Right panel with reveal effect-->
    <f7-panel right reveal>
      <f7-view>
        <f7-page>
          <f7-navbar :title="username"></f7-navbar>
          <f7-list>
            <f7-list-item
              link="#"
              view=".view-main"
              panel-close
              title="Change Password"
            ></f7-list-item>
            <f7-list-item
              link="#"
              view=".view-main"
              panel-close
              title="Logout"
            ></f7-list-item>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>

    <!-- App login -->
    <f7-login-screen id="my-login-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title
            ><img src="@/assets/logo.png" /><br />
            Login</f7-login-screen-title
          >
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
            <f7-block-footer> Forgot Password? </f7-block-footer>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-app>
</template>
<script>
import { ref, onMounted } from "vue";
import { f7, f7ready } from "framework7-vue";

import api from "../js/api";

import routes from "../js/routes.js";
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
      serviceWorker: {
        path: "/service-worker.js",
      },
      touch: {
        tapHold: true,
      },
    };

    // Login screen data
    const username = ref("");
    const password = ref("");

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
    newZone() {
      var zonePopup = f7.popup.create({
        el: ".newZonePopup",
      });
      zonePopup.open();
    },
  },
};
</script>