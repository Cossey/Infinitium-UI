<template>
  <f7-page name="zones-view" ptr @ptr:refresh="fetchData">
    <f7-navbar :title="$t('zones.view.title')" :back-link="$t('zones.title')">
      <template v-slot:right>
        <f7-link
          v-if="zone.type !== 'Stub'"
          icon-md="material:done_all"
          icon-aurora="material:done_all"
          @click="selectToggle"
          :text="($theme.ios) ? ((selectActive) ? $t('misc.done') : $t('misc.select')) : ''"
        />
      </template>
    </f7-navbar>

    <f7-block v-if="!loading">
      <p>
        <span class="domain-text">{{ zone.name }}</span>
        <f7-badge :color="zone.internal ? 'gray' : 'blue'">{{ recordType(zone) }}</f7-badge>
        <f7-badge
          class="badge-padding"
          :color="zone.disabled ? 'red' : (zone.isExpiry ? 'red' : 'green')"
        >{{ zone.disabled ? this.$t('zones.disabled') : (zone.isExpiry ? this.$t('zones.expired') : this.$t('zones.enabled')) }}</f7-badge>
        <span
          v-if="zone.expiry"
          class="expiry-text"
          v-t="{ path: 'zones.expiry', args: [dateFormat(zone.expiry)] }"
        />
      </p>
    </f7-block>
    <f7-block v-if="loading">
      <f7-preloader />
    </f7-block>

    <f7-block v-if="!zone.internal && !loading" :class="(selectActive ? 'disabled' : '')">
      <f7-row>
        <f7-col v-if="zone.type === 'Primary' || zone.type === 'Forwarder'">
          <f7-button color="blue" @click="recordAdd" v-t="'zones.addrecord'" />
        </f7-col>
        <f7-col>
          <f7-button
            color="orange"
            @click="zoneDisable"
            v-if="!zone.disabled"
            v-t="'zones.disablezone'"
          />
          <f7-button
            color="orange"
            @click="zoneEnable"
            v-if="zone.disabled"
            v-t="'zones.enablezones'"
          />
        </f7-col>
        <f7-col>
          <f7-button color="red" @click="zoneDelete" v-t="'zones.deletezone'" />
        </f7-col>
        <f7-col v-if="zone.type === 'Stub' || zone.type === 'Secondary'">
          <f7-button color="blue" @click="zoneResync" v-t="'zones.resync'" />
        </f7-col>
        <f7-col v-if="zone.type === 'Primary' || zone.type === 'Secondary'">
          <f7-button color="blue" @click="zoneOptions" v-t="'zones.options'" />
        </f7-col>
      </f7-row>
    </f7-block>

    <f7-toolbar bottom v-if="selectActive">
      <f7-link
        icon-aurora="material:delete"
        icon-md="material:delete"
        text="$t('zones.delete')"
        @click="deleteSelected"
      />
      <f7-link
        icon-aurora="material:done"
        icon-md="material:done"
        :text="$t('zones.enable')"
        @click="edSelected('false')"
      />
      <f7-link
        icon-aurora="material:close"
        icon-md="material:close"
        :text="$t('zones.disable')"
        @click="edSelected('true')"
      />
    </f7-toolbar>

    <template v-if="loading">
      <f7-list media-list>
        <f7-list-item
          v-for="n in 3"
          :key="n"
          class="skeleton-text skeleton-effect-wave"
          title="________________"
          after="___ ___"
          text="________________________________"
        >
          <template #media>___</template>
        </f7-list-item>
      </f7-list>
    </template>
    <template v-else>
      <f7-list v-if="!loading">
        <template v-for="record in recordList" v-bind:key="record">
          <f7-list-item
            :swipeout="!$device.desktop"
            @swipeout:deleted="removeRecord(record)"
            @click="(e) => recordClick(e, record)"
            link="#"
            :header="record.type"
            :title="displayRName(record.name, zone.name)"
            :footer="displayRData(record.rData, record.type)"
            :checkbox="selectActive && canDisableDelete(record)"
            :checked="selectItemSelected(record.type + record.name)"
            :after="'TTL: ' + record.ttl"
            :badge="record.disabled ? $t('zones.disabled') : ''"
            :badge-color="record.disabled ? 'red' : ''"
            :text="recordDisabled(record.disabled)"
            :no-chevron="selectActive"
            @contextmenu="cmShow($event, record)"
          >
            <template v-if="!$device.desktop">
              <f7-swipeout-actions v-if="canDisableDelete(record)" right>
                <f7-swipeout-button
                  delete
                  :confirm-text="$t('zones.view.deleteconfirm')"
                  v-t="'zones.delete'"
                />
              </f7-swipeout-actions>
              <f7-swipeout-actions v-if="canDisableDelete(record)" left>
                <f7-swipeout-button
                  v-if="record.disabled"
                  color="green"
                  @click="enableRecord(record)"
                  v-t="'zones.enable'"
                />
                <f7-swipeout-button
                  v-if="!record.disabled"
                  color="orange"
                  @click="disableRecord(record)"
                  v-t="'zones.disable'"
                />
              </f7-swipeout-actions>
            </template>
          </f7-list-item>
        </template>
      </f7-list>
      <f7-block-footer class="text-align-center">
        <p v-t="{ path: 'zones.records', args: [recordList.length] }" />
      </f7-block-footer>
    </template>
  </f7-page>
</template>
<style lang="less" scoped>
.badge-padding {
  margin-left: 5px;
  margin-right: 5px;
}

.domain-text {
  font-size: 1.5em;
}

:deep .item-footer {
  --f7-list-item-text-max-lines: 8;
  white-space: pre;
}

:deep .badge {
  margin-left: 5px;
}

.expiry-text {
  font-size: 0.8em;
}
</style>
<script>
import { f7, f7ready } from "framework7-vue";
import { ref } from "vue";
import SelectMixin from "@/components/select-mixin";
import RecordMixin from "@/components/record-mixin";
import { loadLocaleMessages } from '../js/i18n';
import ContextMenuMixin from "@/components/context-menu-mixin";

export default {
  i18n: {
    messages: loadLocaleMessages(require.context('@/assets/i18n/zones'))
  },
  mixins: [SelectMixin, RecordMixin, ContextMenuMixin],
  data() {
    return {
      recordList: [],
      zone: {},
      loading: ref(true)
    }
  },
  props: {
    zoneName: Object,
    f7router: Object,
  },
  mounted() {
    f7ready((f7) => {
      f7.on("updateRecord", () => {
        this.fetchData();
      });
      this.fetchData();
      this.contextMenuItems = [
        {
          label: 'zones.disable',
          icon: 'disable',
          onClick: (record) => this.disableRecord(record),
          visible: (record) => this.canDisableDelete(record) && !record.disabled
        },
        {
          label: 'zones.enable',
          icon: 'enable',
          onClick: (record) => this.enableRecord(record),
          visible: (record) => this.canDisableDelete(record) && record.disabled
        },
        {
          label: 'zones.deleterecord',
          icon: 'delete',
          onClick: (record) => {
            f7.dialog.confirm(
              this.$t('zones.view.deleteconfirm'),
              this.$t('zones.deleterecord'),
              () => this.removeRecord(record)
            );
          },
          visible: (record) => this.canDisableDelete(record)
        },
      ];
    });
  },
  methods: {
    recordClick(event, record) {
      if (this.selectActive) {
        this.selectItemToggle(record);
      } else {
        this.f7router.navigate("/zones/" + this.zone.name + "/record/", {
          props: {
            zoneName: this.zoneName,
            inRecord: record
          }
        });
      }
    },
    dateFormat(date) {
      if (!date) return null;
      return new Date(date).toLocaleString();
    },
    deleteSelected() {
      function buildParams(record) {
        return [
          ["domain", record.name],
          ["type", record.type],
          ["value", record.rData.value],
        ];
      }

      this.$api.doBatchGet((r) => "deleteRecord", buildParams, this.selectItems).then((res) => {
        this.fetchData();
        this.selectClear();
      });
    },
    edSelected(disable) {
      function buildParams(record) {
        return [
          ["type", record.type],
          ["domain", record.name],
          ["disable", disable],
          ["value", record.rData.value],
          ["ttl", record.ttl],
        ];
      }

      this.$api.doBatchGet((r) => "updateRecord", buildParams, this.selectItems).then((res) => {
        this.fetchData();
        this.selectClear();
      });
    },
    zoneOptions() {
      this.f7router.navigate("/zones/" + this.zone.name + "/options/");
    },
    recordAdd() {
      this.f7router.navigate("/zones/" + this.zone.name + "/record/");
    },
    zoneResync() {
      f7.dialog.confirm(this.$t('zones.view.resyncconfirm'), () => {
        this.$api.get("zone/resync", [
          ["domain", this.zone.name]
        ]).then((res) => {
          this.fetchData();
        });
      });
    },
    zoneDelete() {
      f7.dialog.confirm(
        this.$t('zones.deleteconfirm'),
        () => {
          this.$api.get("deleteZone", [
            ["domain", this.zone.name]
          ]).then((res) => {
            f7.emit("zoneDeleted", this.zone.name);
            this.f7router.back();
          })
        });
    },
    zoneDisable() {
      f7.dialog.confirm(
        this.$t('zones.disableconfirm'),
        () => {
          this.$api.get("disableZone", [
            ["domain", this.zone.name]
          ]).then((res) => {
            f7.emit("zoneDisabled", this.zone.name);
            this.fetchData();
          })
        }
      );
    },
    zoneEnable() {
      f7.dialog.confirm(
        this.$t('zones.enableconfirm'),
        () => {
          this.$api.get("enableZone", [
            ["domain", this.zone.name]
          ]).then((res) => {
            f7.emit("zoneEnabled", this.zone.name);
            this.fetchData();
          })
        }
      );
    },
    canDisableDelete: function (record) {
      return record.type !== "SOA" && this.zone.internal !== true && this.zone.type !== 'Stub';
    },
    recordType: function (record) {
      if (record.internal) {
        return this.$t('zones.internal');
      } else {
        return this.$t(`zones.type.${record.type.toLowerCase()}`);;
      }
    },
    disableRecord: function (record) {
      this.$api
        .get("updateRecord", [
          ["type", record.type],
          ["domain", record.name],
          ["disable", "true"],
          ["value", record.rData.value],
          ["ttl", record.ttl],
        ])
        .then((res) => {
          this.fetchData();
        });
    },
    enableRecord: function (record) {
      this.$api
        .get("updateRecord", [
          ["type", record.type],
          ["domain", record.name],
          ["disable", "false"],
          ["value", record.rData.value],
          ["ttl", record.ttl],
        ])
        .then((res) => {
          this.fetchData();
        });
    },
    removeRecord: function (record) {
      this.$api
        .get("deleteRecord", [
          ["domain", record.name],
          ["type", record.type],
          ["value", record.rData.value],
          ["ttl", record.ttl],
        ])
        .then((data) => {
          const itemToRemoveIndex = array.findIndex(function (item) {
            return (
              item["domain"] === record.name &&
              item["type"] === record.type &&
              item["value"] === record.rData.value
            );
          });
          // proceed to remove an item only if it exists.
          if (itemToRemoveIndex !== -1) {
            array.splice(itemToRemoveIndex, 1);
          }
        });
    },
    newRecord: function () { },
    fetchData: function (done) {
      this.$api.get("getRecords", [["domain", this.zoneName]]).then((data) => {
        this.recordList = data.records;
        this.zone = data.zone;
        this.loading = false;
        if (typeof done !== "undefined") done();
      });
    },
    recordDisabled: function (zoneDisabled) {
      if (zoneDisabled) {
        return this.$t('zones.disabled');
      }
    },
  },
};
</script>

