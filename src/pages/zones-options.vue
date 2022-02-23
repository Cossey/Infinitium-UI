<template>
  <f7-popup>
    <f7-view>
      <f7-page>
        <f7-navbar :title="$t('zones.options.title')">
          <template v-slot:left>
            <f7-link popup-close>{{$t('dialogs.cancel')}}</f7-link>
          </template>
          <template v-slot:right>
            <f7-link @click="updateOptions">{{$t('dialogs.save')}}</f7-link>
          </template>
        </f7-navbar>
        <f7-list>
          <f7-list-item ref="xfrSS" class="xfer-ss" :title="$t('zones.options.zonexfr')" smart-select>
            <select name="xfr" v-model="config.zoneTransfer">
              <option value="Deny" selected>{{$t('misc.deny')}}</option>
              <option value="Allow">{{$t('misc.allow')}}</option>
              <option value="AllowOnlyZoneNameServers">{{$t('zones.options.allowzns')}}</option>
              <option value="AllowOnlySpecifiedNameServers">{{$t('zones.options.allowsns')}}</option>
            </select>
          </f7-list-item>
          <f7-list-input
            :disabled="config.zoneTransfer !== 'AllowOnlySpecifiedNameServers'"
            :label="$t('zones.options.ans')"
            type="textarea"
            v-model:value="zoneTransferNameServers"
            resizable
          />
        </f7-list>
        <f7-list>
          <f7-list-item ref="notifySS" title="Notify" smart-select>
            <select name="notify" v-model="config.notify">
              <option value="None" selected>{{$t('misc.none')}}</option>
              <option value="ZoneNameServers" selected>{{$t('zones.options.zns')}}</option>
              <option value="SpecifiedNameServers">{{$t('zones.options.sns')}}</option>
            </select>
          </f7-list-item>
          <f7-list-input
            :disabled="config.notify !== 'SpecifiedNameServers'"
            :label="$t('zones.options.nns')"
            type="textarea"
            v-model:value="notifyNameServers"
            resizable
          />
        </f7-list>
        <f7-list>
          <f7-list-input
            :label="$t('zones.options.tsigkeynames')"
            type="textarea"
            v-model:value="zoneTransferTsigKeyNames"
            resizable
          />
          <f7-list-button popup-open=".tsig-key-list" :title="$t('misc.quickadd')" />
        </f7-list>
      </f7-page>
    </f7-view>
    <f7-popup class="tsig-key-list">
      <f7-page>
        <f7-navbar :title="$t('zones.options.tsigkeylist')">
          <template v-slot:right>
            <f7-link popup-close>{{$t('dialogs.close')}}</f7-link>
          </template>
        </f7-navbar>
        <f7-list media-list class="search-list searchbar-found">
          <template v-for="tsig in config.availableTsigKeyNames" v-bind:key="tsig">
            <f7-list-item checkbox :value="tsig" :title="tsig" @change="tsigSelectChange"></f7-list-item>
          </template>
        </f7-list>
      </f7-page>
    </f7-popup>
  </f7-popup>
</template>
<script>
import { f7, f7ready } from 'framework7-vue';

export default {
  props:
  {
    zoneName: String,
    f7router: Object,
  },
  data() {
    return {
      "config": {}
    }
  },
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  computed: {
    zoneTransferTsigKeyNames: {
      get() {
        if (this.config.zoneTransferTsigKeyNames) {
          return this.config.zoneTransferTsigKeyNames.join('\n');
        }
      },
      set(val) {
        this.config.zoneTransferTsigKeyNames = val.split('\n');
      }
    },
    zoneTransferNameServers: {
      get() {
        if (this.config.zoneTransferNameServers) {
          return this.config.zoneTransferNameServers.join('\n');
        }
      },
      set(val) {
        this.config.zoneTransferNameServers = val.split('\n');
      },
    },
    notifyNameServers: {
      get() {
        if (this.config.notifyNameServers) {
          return this.config.notifyNameServers.join('\n');
        }
      },
      set(val) {
        this.config.notifyNameServers = val.split('\n');
      },
    },
  },
  methods: {
    updateOptions() {
      var params = this.$api.serializeParams(this.config);
      params.push(['domain', this.zoneName]);

      this.$api.get("zone/options/set",
        params
      ).then(() => {
        f7.popup.close();
      });
    },
    fetchData() {
      this.$api.get("zone/options/get", [
        ['domain', this.zoneName],
      ]).then((res) => {
        this.config = res;

        this.$refs.xfrSS.$el
          .querySelector(".smart-select")
          .f7SmartSelect.setValue(this.config.zoneTransfer);

        this.$refs.notifySS.$el
          .querySelector(".smart-select")
          .f7SmartSelect.setValue(this.config.notify);

      });
    },
    tsigSelectChange(e) {
      const tsig = e.target.value;
      if (e.target.checked) {
        this.config.zoneTransferTsigKeyNames.push(tsig);
      } else {
        this.config.zoneTransferTsigKeyNames.splice(this.config.zoneTransferTsigKeyNames.indexOf(tsig), 1);
      }
    },
  },
}
</script>