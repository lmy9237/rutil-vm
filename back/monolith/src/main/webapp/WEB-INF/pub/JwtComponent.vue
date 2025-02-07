<template>
  <div id="jwtComponent">

  </div>
</template>

<script>

export default {
  name: "jwtComponent",
  data:function () {
    return {

    }
  },
  methods: {
    makeToken: function (param) {

      let header = {
        "typ": "JWT",
        "alg":"HS256"
      }
      let payload = param;
      let encHeader = this.makeBase64FromData(header);
      let encPayload = this.makeBase64FromData(payload);
      let secretKey = this.makeSecretKey(encPayload);
      const crypto = require('crypto');
      const signature = crypto.createHmac('sha256', secretKey)
          .update(encHeader
              + "."
              + encPayload)
          .digest('base64')
          .replace('=','')
      let token = encHeader
          + "."
          + encPayload
          + "."
          + signature

      token = btoa(token).replaceAll("=","");

      return token;
    },
    makeBase64FromData: function (data) {
      let encString = null;
      // console.log("data     :",data);
      encString = new Buffer(JSON.stringify(data))
          .toString('base64')
          .replace('=','');
      return encString;
    },
    makeSecretKey: function (data) {
      let secretKey = null;

      for(var i = 0; i < 5; i++) {
        if(i == 0) {
          secretKey = btoa(data);
        } else {
          secretKey = btoa(secretKey);
        }
      }
      secretKey = secretKey.substring(8,16);
      return secretKey;
    },
    // makePayload: function(param) {
    //   let payload = {};
    //
    //   // for(data in  param) {
    //   //
    //   // }
    //
    //   return payload;
    // }
  }
}
</script>