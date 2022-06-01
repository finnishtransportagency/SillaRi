const https = require('https');

module.exports = {
  postFileToKVT: function(objectData, metadata, apiKey, imageKey) {

    return new Promise((resolve, reject) => {
      // Sillarin tunnisteavaruus on 22 ja kuvatyyppi 2101.
      const ID_SPACE = 22;
      const PIC_TYPE = 2101;

      const {
        bridgeidentifier,
        bridgename,
        bridgeoid,
        createdtime,
        filename,
        objectidentifier,
        permitnumber,
        roadaddress,
        supervisionexceptional,
        supervisionfinishedtime,
        supervisionid,
        supervisionstartedtime,
        x_coord,
        y_coord,
      } = metadata;

      let bridgeProcessedName = "";
      if (bridgename) {
        const decodedName = decodeURIComponent(bridgename);
        // decodeURIComponent does not handle '+' encoded in Java
        bridgeProcessedName = decodedName.replace(/\+/g, " ");
      }

      console.log("bridgeidentifier: " + bridgeidentifier);
      console.log("bridgename: " + bridgename);
      console.log("bridgeProcessedName: " + bridgeProcessedName);
      console.log("bridgeoid: " + bridgeoid);
      console.log("createdtime: " + createdtime);
      console.log("filename: " + filename);
      console.log("objectidentifier: " + objectidentifier);
      console.log("permitnumber: " + permitnumber);
      console.log("roadaddress: " + roadaddress);
      console.log("supervisionexceptional: " + supervisionexceptional);
      console.log("supervisionfinishedtime: " + supervisionfinishedtime);
      console.log("supervisionid: " + supervisionid);
      console.log("supervisionstartedtime: " + supervisionstartedtime);
      console.log("x_coord: " + x_coord);
      console.log("y_coord: " + y_coord);

      const roadAddressParts = roadaddress ? roadaddress.split("-") : [];
      console.log(roadAddressParts);

      // TODO post supervision metadata how?
      const postData = JSON.stringify({
        data: [
          {
            tunnisteavaruus: ID_SPACE,
            tunniste: objectidentifier,
            kuvatyyppi: PIC_TYPE,
            nimi: imageKey,
            image: objectData,
            tie: roadAddressParts[0] || null,
            tieosa: roadAddressParts[1] || null,
            etaisyys: roadAddressParts[2] || null,
            ajorata: roadAddressParts[3] || null,
            xkoordinaatti: x_coord,
            ykoordinaatti: y_coord,
            sillantunnus: 3, // TODO change after KTV has updated their end, now it has to be number 1-10. This goes to location on ktv map near Loviisa
          },
        ],
      });

      const options = {
        hostname: process.env.KTV_HOSTNAME,
        path: "/ktv/api/public/KTJLisaaKuvia",
        // path: '/ktv/api/ktv/KTJLisaaKuvia',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        console.log("statusCode", res.statusCode);

        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));

        res.on("end", () => {
          console.log("Successfully processed HTTPS response");
          console.log("RES body", body);
        });
      });

      req.on("error", (error) => {
        console.error(error);
      });

      req.write(postData);
      req.end();
    });
  }
};
