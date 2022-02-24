export default {
  methods: {
    displayRData(rData, recordType) {
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
          keyvaluepair += valNames[recordType] || "";
          keyvaluepair += `${rData[property]}\n`;
        }

      }
      return keyvaluepair;
    },
    displayRName(name, domain) {
      if (name == domain) return "@";
      return name.endsWith(domain) ? name.substring(0, name.length - domain.length - 1) : name;
    }
  }
}
