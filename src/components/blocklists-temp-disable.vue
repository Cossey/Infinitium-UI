<template>
  <f7-list ref="form">
    <f7-list-item
      title="Disabled Until"
      :after="temporaryDisableBlockingTillTime"
    >
    </f7-list-item>
    <f7-list-input
      label="Disable for"
      type="number"
      validate
      required
      :placeholder="$t('misc.minutes')"
      min="0"
      max="178956"
      v-model:value="temporaryDisableBlockMins"
    >
    </f7-list-input>
    <f7-list-button
      @click="temporaryDisableBlocking()"
      title="Temporarily Disable Blocklist"
    ></f7-list-button>
  </f7-list>
</template>
<script>
import api from "@/js/api";
import { f7, f7ready, theme } from "framework7-vue";
import { ref } from "vue";
import regex from "@/js/regex";

export default {
  data: function () {
    return {
      temporaryDisableBlockMins: "",
      temporaryDisableBlockingTill: "",
    };
  },
  mounted: function () {
    this.temporaryDisableBlockingTill = this.disableBlockingTill;
  },
  computed: {
    temporaryDisableBlockingTillTime() {
      var dateRaw =
        this.temporaryDisableBlockingTill || this.disableBlockingTill;

      if (!dateRaw) {
        return "Not Set";
      }

      var date = new Date(dateRaw);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
  },
  props: {
    disableBlockingTill: String,
  },
  methods: {
    ...regex,
    temporaryDisableBlocking: function () {
      if (f7.input.validateInputs(this.$refs.form.$el)) {
        var mins = this.temporaryDisableBlockMins;
        if (mins == "") {
          f7.dialog.alert(
            "Please enter a number of minutes to disable blocking for."
          );
        } else {
          api
            .get("temporaryDisableBlocking", [["minutes", mins]])
            .then((res) => {
              this.temporaryDisableBlockMins = "0";
              this.temporaryDisableBlockingTill =
                res.temporaryDisableBlockingTill;
            });
        }
      }
    },
  },
};
</script>