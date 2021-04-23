<template>
  <f7-page name="about">
    <f7-navbar title="About" back-link="Back"></f7-navbar>
    <f7-block-title>Infinitium UI</f7-block-title>
    <f7-block>
      <p>Copyright &copy; 2021 Stewart Cossey</p>
    </f7-block>
    <f7-block-title>Theme</f7-block-title>
    <f7-block>
      <f7-segmented raised tag="p">
        <f7-button :active="theme === 'auto'" @click="switchTheme('auto')"
          >Auto</f7-button
        >
        <f7-button :active="theme === 'ios'" @click="switchTheme('ios')"
          >iOS</f7-button
        >
        <f7-button :active="theme === 'md'" @click="switchTheme('md')"
          >Android</f7-button
        >
        <f7-button :active="theme === 'aurora'" @click="switchTheme('aurora')"
          >Desktop</f7-button
        >
      </f7-segmented>
    </f7-block>
    <f7-block-title>Dark Mode</f7-block-title>
    <f7-block>
      <f7-segmented raised tag="p">
        <f7-button :active="darkMode === 'auto'" @click="setDarkMode('auto')"
          >Auto</f7-button
        >
        <f7-button :active="darkMode === 'light'" @click="setDarkMode('light')"
          >Light</f7-button
        >
        <f7-button :active="darkMode === 'dark'" @click="setDarkMode('dark')"
          >Dark</f7-button
        >
      </f7-segmented>
    </f7-block>
    <f7-block-title>Technitium DNS Server</f7-block-title>
    <f7-block>
      <p>Copyright &copy; 2020 Shreyas Zare (shreyas@technitium.com)</p>
      <p>
        This program comes with ABSOLUTELY NO WARRANTY. This is free software,
        and you are welcome to redistribute it under certain conditions.
      </p>
      <p>Source code available under GNU General Public License v3.0</p>
      <f7-row>
        <f7-col>
          <f7-button outline external href="https://go.technitium.com/?id=24"
            >View License</f7-button
          >
        </f7-col>
        <f7-col>
          <f7-button
            outline
            external
            href="https://github.com/TechnitiumSoftware/DnsServer"
            >Source Code</f7-button
          >
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>What's new?</f7-block-title>
    <f7-block>
      <p>Read the change log to know whats new in this release.</p>
      <f7-row>
        <f7-col>
          <f7-button outline external href="https://go.technitium.com/?id=23"
            >View the Change log</f7-button
          >
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>API Documentation</f7-block-title>
    <f7-block>
      <p>
        The DNS server HTTP API allows any 3rd party app or script to configure
        the DNS server. The HTTP API is used by this web console and thus all
        the actions that this web console does can be performed via the API.
      </p>
      <f7-row>
        <f7-col>
          <f7-button
            outline
            external
            href="https://github.com/TechnitiumSoftware/DnsServer/blob/master/APIDOCS.md"
            >View HTTP API Documentation</f7-button
          >
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>Support</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button outline external href="mailto:support@technitium.com"
            >Email</f7-button
          >
        </f7-col>
        <f7-col>
          <f7-button outline external href="https://twitter.com/Technitium"
            >Twitter</f7-button
          >
        </f7-col>
        <f7-col>
          <f7-button outline external href="https://blog.technitium.com/"
            >Blog</f7-button
          >
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>Become A Patron</f7-block-title>
    <f7-block>
      <p>
        Make contribution to Technitium by becoming a Patron and help making new
        software, updates, and features possible.
      </p>
      <f7-row>
        <f7-col>
          <f7-button outline external href="https://go.technitium.com/?id=35"
            >Become a Patron Now!</f7-button
          >
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>
<script>
import { f7, f7ready } from "framework7-vue";

export default {
  setup() {
    const uiTheme = f7.theme;
    return {
      uiTheme,
    };
  },
  mounted() {
    f7ready((f7) => {});
  },
  methods: {
    switchTheme(theme) {
      localStorage.setItem("theme", theme);
      location.reload();
    },
    setDarkMode(mode) {
      localStorage.setItem("dark", mode);
      location.reload();
    },
  },
  computed: {
    theme() {
      return localStorage.getItem("theme") || "auto";
    },
    darkMode() {
      return localStorage.getItem("dark") || "auto";
    },
  },
};
</script>