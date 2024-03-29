<template>
  <f7-popup>
    <f7-view>
      <f7-page>
        <f7-navbar :title="(typeof this.inIndex === 'undefined' ? 'New' : 'Edit') + ' Key'">
          <template v-slot:left>
            <f7-link popup-close>Cancel</f7-link>
          </template>
          <template v-slot:right>
            <f7-link
              @click="updateTsig"
            >{{ (typeof this.inIndex === 'undefined' ? 'Create' : 'Save') }}</f7-link>
          </template>
        </f7-navbar>
        <f7-list>
          <f7-list-input 
            ref="keyName"
            label="Key Name" 
            type="text" 
            v-model:value="tsig.keyName"
            required
            error-message="A Key Name is required."
          />
          <f7-list-input
            label="Shared Secret"
            type="text"
            placeholder
            v-model:value="tsig.sharedSecret"
          />
          <f7-list-item ref="algorithmSS" title="Algorithm" smart-select>
            <select name="type" v-model="tsig.algorithmName">
              <option value="hmac-md5.sig-alg.reg.int" selected>HMAC-MD5 (obsolete)</option>
              <option value="hmac-sha1">HMAC-SHA1</option>
              <option value="hmac-sha256">HMAC-SHA256 (recommended)</option>
              <option value="hmac-sha256-128">HMAC-SHA256 128-bits</option>
              <option value="hmac-sha384">HMAC-SHA384</option>
              <option value="hmac-sha384-128">HMAC-SHA384 128-bits</option>
              <option value="hmac-sha512">HMAC-SHA512</option>
              <option value="hmac-sha512-128">HMAC-SHA512 128-bits</option>
            </select>
          </f7-list-item>
          <f7-block-footer>
            <p>
              If the
              <i>Shared Secret</i> is empty the DNS Server will auto generate a strong key.
            </p>
          </f7-block-footer>
        </f7-list>

        <f7-list no-hairlines-md v-if="typeof this.inIndex !== 'undefined'">
          <f7-list-button @click="deleteTsig()" color="red" title="Delete Key" />
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>
<script>
import { f7, f7ready } from "framework7-vue";
import regex from "@/js/regex";

export default {
  mounted() {
    f7ready((f7) => {
      this.fetchData();
    });
  },
  data: () => ({
    tsig: {},
    index: null
  }),
  props: {
    keyNames: Object,
    inIndex: Number,
    inTsig: Object,
    f7router: Object,
  },
  methods: {
    ...regex,
    fetchData() {
      if (this.inTsig) {
        this.tsig = this.inTsig;
        this.index = this.inIndex;
      } else {
        this.tsig = {
          keyName: "",
          algorithmName: "hmac-sha256",
          sharedSecret: "",
        };
      }

      this.$refs.algorithmSS.$el
        .querySelector(".smart-select")
        .f7SmartSelect.setValue(this.tsig.algorithmName);

    },
    updateTsig() {
      if (this.keyNames.includes(this.tsig.keyName)) {
        f7.dialog.alert("The Key Name already exists. Please choose another one.");
        return;
      }

      if (f7.input.validateInputs(this.$refs.keyName.$el)) {
        f7.emit("tsigUpdated", { index: this.index, tsig: this.tsig });
        f7.popup.close();
      }
    },
    deleteTsig() {
      f7.emit("tsigDeleted", this.index);
      f7.popup.close();
    },
  },
}
</script>
