const https = require("https");

module.exports = {
  postFileToKVT: function (objectData, apikey, imageId, callback) {
    return new Promise((resolve, reject) => {
      console.log("HELLOOO ktvClient!");

      //Sillarin tunnisteavaruus on 22 ja kuvatyyppi 2101.
      const idSpace = 22;
      const picType = 2101;

      //todo use actual photo coords and road address
      const north = 7554425;
      const east = 505189;
      const roadAddressRoad = 4;
      const roadAddressPart = 538;
      const roadAddressCarriageWay = 0;
      const roadAddressDistance = 17487;

      const postData = JSON.stringify({
        data: [
          {
            tunnisteavaruus: idSpace,
            tunniste: imageId,
            kuvatyyppi: picType,
            nimi: imageId, //todo split only filename from key
            image: objectData,
            tie: roadAddressRoad,
            tieosa: roadAddressPart,
            etaisyys: roadAddressDistance,
            ajorata: roadAddressCarriageWay,
            //koordinaattijarj ?,
            xkoordinaattiAnnettu: north,
            ykoordinaattiAnnettu: east,
            //zkoordinaattiAnnettu	number,
            //xkoordinaattiLaskettu:,
            //ykoordinaattiLaskettu:,
            //zkoordinaattiLaskettu:,
          },
        ],
      });

      //console.log('postData:', postData);

      const options = {
        hostname: "devapi.testivaylapilvi.fi",
        path: "/ktv/api/ktv/KTJLisaaKuvia",
        //path: '/ktv/api/public/22/KTV100000000039068',
        //path: '/ktv/api/ktv/11/1?tunnisteavaruus=11',
        method: "POST",
        //method: 'GET',
        headers: {
          "Content-Type": "application/json",
          // 'Content-Length': data.length,
          "x-api-key": apikey,
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        console.log("statusCode", res.statusCode);

        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));

        res.on("end", () => {
          console.log("Successfully processed HTTPS response");
          // If we know it's JSON, parse it
          /*if (res.headers['content-type'] === 'application/json') {
              body = JSON.parse(body);
          }*/
          console.log("RES body", body);
          callback();
        });
      });

      req.on("error", (error) => {
        console.error(error);
      });

      req.write(postData);
      req.end();
    });
  },
};

/*exports.handler = (event, context, callback) => {
    const req = https.request(event.options, (res) => {
        let body = '';
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Successfully processed HTTPS response');
            // If we know it's JSON, parse it
            if (res.headers['content-type'] === 'application/json') {
                body = JSON.parse(body);
            }
            callback(null, body);
        });
    });
    req.on('error', callback);
    req.write(JSON.stringify(event.data));
    req.end();
};*/
