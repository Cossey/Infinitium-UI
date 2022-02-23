<template>
  <f7-page name="zones" ptr @ptr:refresh="fetchData">
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
        {{ zone.name }}
        <f7-badge :color="zone.internal ? 'gray' : 'blue'">{{ recordType(zone) }}</f7-badge>
        <f7-badge
          class="badge-padding"
          :color="zone.disabled ? 'red' : (zone.isExpiry ? 'red' : 'green')"
        >{{ zone.disabled ? this.$t('zones.disabled') : (zone.isExpiry ? this.$t('zones.expired') : this.$t('zones.enabled')) }}</f7-badge>
        <span v-if="zone.expiry" class="expiry-text">{{$t('zone.expiry')}}: {{ dateFormat(zone.expiry) }}</span>
      </p>
    </f7-block>
    <f7-block v-if="loading">
      <p>Loading</p>
    </f7-block>

    <f7-block v-if="!zone.internal && !loading" :class="(selectActive ? 'disabled' : '')">
      <f7-row>
        <f7-col v-if="zone.type === 'Primary' || zone.type === 'Forwarder'">
          <f7-button color="blue" @click="recordAdd">{{$t('zones.addrecord')}}</f7-button>
        </f7-col>
        <f7-col>
          <f7-button color="orange" @click="zoneDisable" v-if="!zone.disabled">{{$t('zones.disablezone')}}</f7-button>
          <f7-button color="orange" @click="zoneEnable" v-if="zone.disabled">{{$t('zones.enablezones')}}</f7-button>
        </f7-col>
        <f7-col>
          <f7-button color="red" @click="zoneDelete">{{$t('zones.deletezone')}}</f7-button>
        </f7-col>
        <f7-col v-if="zone.type === 'Stub' || zone.type === 'Secondary'">
          <f7-button color="blue" @click="zoneResync">{{$t('zones.resync')}}</f7-button>
        </f7-col>
        <f7-col v-if="zone.type === 'Primary' || zone.type === 'Secondary'">
          <f7-button color="blue" @click="zoneOptions">{{$t('zones.options')}}</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>

    <f7-toolbar bottom v-if="selectActive">
      <f7-link
        icon-aurora="material:delete"
        icon-md="material:delete"
        text="Delete"
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
        <template #media>___</template></f7-list-item>
      </f7-list>
    </template>
    <template v-else>
      <f7-list media-list v-if="!loading">
        <template v-for="record in recordList" v-bind:key="record">
          <f7-list-item
            swipeout
            @swipeout:deleted="removeRecord(record)"
            @click="(e) => recordClick(e, record)"
            link="#"
            :title="record.name"
            :checkbox="selectActive && canDisableDelete(record)"
            :checked="selectItemSelected(record.type + record.name)"
            :after="'TTL: ' + record.ttl"
            :text="convertData(record.rData, record.type)"
            :footer="recordDisabled(record.disabled)"
            :no-chevron="selectActive"
          >
          <template #media>
            {{record.type}}
          </template>
            <f7-swipeout-actions v-if="canDisableDelete(record)" right>
              <f7-swipeout-button
                delete
                :confirm-text="$t('zones.view.deleteconfirm')"
              >Delete</f7-swipeout-button>
            </f7-swipeout-actions>
            <f7-swipeout-actions v-if="canDisableDelete(record)" left>
              <f7-swipeout-button
                v-if="record.disabled"
                color="green"
                @click="enableRecord(record)"
              >Enable</f7-swipeout-button>
              <f7-swipeout-button
                v-if="!record.disabled"
                color="orange"
                @click="disableRecord(record)"
              >Disable</f7-swipeout-button>
            </f7-swipeout-actions>
          </f7-list-item>
        </template>
      </f7-list>
      <f7-block-footer class="text-align-center">
        <p>{{ $t('misc.records', { n: recordList.length }) }}</p>
      </f7-block-footer>
    </template>
  </f7-page>
</template>
<style lang="less" scoped>
.badge-padding {
  margin-left: 5px;
  margin-right: 5px;
}

::v-deep .item-text {
  --f7-list-item-text-max-lines: 8;
  white-space: pre;
}

.expiry-text {
  font-size: 0.8em;
}
</style>
<script>
import { f7, f7ready } from "framework7-vue";
import { ref } from "vue";
import SelectMixin from "@/components/select-mixin";

export default {
  mixins: [SelectMixin],
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
        return this.$t('zone.internal');
      } else {
        return record.type;
      }
    },
    convertData: function (rData, type) {
      var keyvaluepair = "";
      var valNames = {
        NS: "Name Server: ",
        MX: "Exchange: ",
        CAA: "Authority: ",
        SRV: "Target: ",
      };

      for (const property in rData) {
        if (property !== "value") {
          var nP = property.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
          keyvaluepair += `${nP}: ${rData[property]}\n`;
        } else {
          keyvaluepair += valNames[type] || "";
          keyvaluepair += `${rData[property]}\n`;
        }

      }
      return keyvaluepair;
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

