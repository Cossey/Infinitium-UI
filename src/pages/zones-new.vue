<template>
  <f7-popup>
    <f7-view>
      <f7-page>
        <f7-navbar title="Add Zone">
          <template v-slot:left>
            <f7-link popup-close>{{ $t('dialogs.cancel') }}</f7-link>
          </template>
          <template v-slot:right>
            <f7-link @click="createZone">Add</f7-link>
          </template>
        </f7-navbar>
        <f7-list form>
          <f7-list-input
            label="Zone"
            type="text"
            required
            placeholder="example.com or 192.168.0.0/24 or 2001:db8::/64"
            v-model:value="domain"
            autocomplete="off"
            data-lpignore="true"
          />
          <f7-list-item title="Type" smart-select>
            <select name="type" v-model="type">
              <option value="primary" selected>Primary Zone</option>
              <option value="secondary">Secondary Zone</option>
              <option value="stub">Stub Zone</option>
              <option value="forwarder">Conditional Forwarder Zone</option>
            </select>
          </f7-list-item>
        </f7-list>

        <f7-list v-if="type === 'secondary' || type === 'stub'" form>
          <f7-list-input
            label="Primary Name Server Addresses"
            type="textarea"
            placeholder="192.168.1.1"
            v-model:value="primaryNameServerAddresses"
            resizable
          />
          <f7-list-item title="Zone Transfer Protocol" v-if="type === 'secondary'" smart-select>
            <select name="xfr" v-model="zoneTransferProtocol">
              <option value="tcp" selected>XFR-over-TCP</option>
              <option value="tls">XFR-over-TLS</option>
            </select>
          </f7-list-item>
          <f7-list-item title="TSIG Key Name" v-if="type === 'secondary'" smart-select>
            <select name="tsig" v-model="tsigKeyName">
              <option value selected>None</option>
              <option v-for="key in tsigKeys" :key="key" :value="key">{{ key }}</option>
            </select>
          </f7-list-item>
        </f7-list>

        <f7-list v-if="type === 'forwarder'" form>
          <f7-list-item
            checkbox
            title="Use This DNS Server"
            name="https"
            v-model:checked="useThisServer"
          />
        </f7-list>
        <f7-list v-if="type === 'forwarder'" form>
          <f7-list-item title="Protocol" smart-select :disabled="useThisServer">
            <select name="protocol" v-model="protocol">
              <option value="Udp" selected>DNS-over-UDP</option>
              <option value="Tcp">DNS-over-TCP</option>
              <option value="Tls">DNS-over-TLS</option>
              <option value="Https">DNS-over-HTTPS</option>
              <option value="HttpsJson">DNS-over-HTTPS (JSON)</option>
            </select>
          </f7-list-item>
          <f7-list-input
            label="Forwarder"
            type="text"
            :placeholder="zoneForwarderPlaceholder(type)"
            v-model:value="domain"
            :disabled="useThisServer"
            :required="!useThisServer && type === 'forwarder'"
          />
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>
<script>
import store from '../js/store';
import { f7 } from "framework7-vue";
import App from 'framework7-vue/components/app';

export default {
  emits: ['zoneCreated'],
  data() {
    return {
      domain: '',
      type: 'primary',
      primaryNameServerAddresses: [],
      zoneTransferProtocol: 'tcp',
      tsigKeyName: '',
      protocol: 'Udp',
      forwarder: '',
      useThisServer: false,
    }
  },
  computed: {
    tsigKeys() {
      return store.state.tsigKeys;
    },
  },
  methods: {
    createZone() {
      if (f7.input.validateInputs('form')) {

        var params = [
          ["domain", this.domain],
          ["type", this.type]
        ]

        if (this.type === 'secondary' || this.type === 'stub') {
          if (this.primaryiNameServerAddresses) {
            params.push(["primaryNameServerAddresses", ths.primaryiNameServerAddresses.replace('\n', ',')]);
          }
        }

        if (this.type === 'secondary') {
          params.push(["zoneTransferProtocol", this.zoneTransferProtocol]);
          params.push(["tsigKeyName", this.tsigKeyName]);
        }

        if (this.type === 'forwarder') {
          if (this.useThisServer) {
            params.push(["protocol", 'tcp']);
            params.push(["forwarder", 'this-server']);
          } else {
            params.push(["protocol", this.protocol]);
            params.push(["forwarder", this.forwarder]);
          }
        }

        this.$api.get("createZone", params).then((res) => {
          f7.emit('zoneCreated', this.domain);
          f7.popup.close();
        });
      }
    },
    zoneForwarderPlaceholder(zoneType) {
      switch (zoneType) {
        case 'Https':
        case 'HttpsJson':
          return 'https://cloudflare-dns.com/dns-query (1.1.1.1)';
        case 'Tls':
          return 'dns.quad9.net (9.9.9.9:853)';
        default:
          return '8.8.8.8 or [2620:fe::10]';
      }
    }
  }
}
</script>
