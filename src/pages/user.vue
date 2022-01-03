<template>
  <f7-page name="user">
    <f7-navbar :title="user">
      <template v-slot:left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="material:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </template>
    </f7-navbar>
    <f7-block-title>Change Password</f7-block-title>
    <f7-list ref="changePassword">
      <f7-list-input
        label="New Password"
        type="password"
        v-model:value="password.new"
        validate
        required
      ></f7-list-input>
      <f7-list-input
        label="Confirm Password"
        type="password"
        v-model:value="password.repeat"
        validate
        required
        error-message="Passwords do not match"
        :pattern="regexEscape(password.new)"
      >
      </f7-list-input>
      <f7-list-button @click="changePassword" title="Change Password"></f7-list-button>
    </f7-list>
    <f7-list no-hairlines-md>
      <f7-list-button @click="logout" color="red" title="Logout"></f7-list-button>
    </f7-list>
  </f7-page>
</template>
<script>
import api from "@/js/api";
import { useStore } from "framework7-vue";
import { f7, f7ready, theme } from "framework7-vue";
import { ref } from "vue";
import regex from "@/js/regex";

export default {
  //   setup() {
  //     const user = useStore("user");
  //     return {
  //       user,
  //       password: {
  //         new: "",
  //         repeat: "",
  //       },
  //     };
  //   },
  data: function () {
    return {
      user: useStore("user"),
      password: {
        new: "",
        repeat: "",
      },
    };
  },
  props: {
    f7router: Object,
  },
  methods: {
    ...regex,
    validatePassword(isValid) {
      //   console.log(
      //     "Validation " + this.password.new + " " + this.password.repeat
      //   );
      //   console.log(this.password.new != this.password.repeat);
      if (this.password.new !== this.password.repeat) {
        isValid = false;
      }
      return isValid;
    },
    changePassword: function () {
      if (f7.input.validateInputs(this.$refs.changePassword.$el)) {
        if (this.password.new === this.password.repeat) {
          api
            .get("changePassword", [["pass", this.password.new]])
            .then((res) => { });
        } else {
          f7.dialog.alert("Passwords do not match", "Change Password");
        }
      }
    },
    logout: function () {
      api.doLogout();
      this.f7router.back();
    },
  },
};
</script>