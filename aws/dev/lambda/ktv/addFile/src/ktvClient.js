const https = require('https');

module.exports = {
  postFileToKVT: function(objectData, metadata, apiKey, imageKey) {

    return new Promise((resolve, reject) => {

      // Sillarin tunnisteavaruus on 22 ja kuvatyyppi 2101.
      const idSpace = 22;
      const picType = 2101;
      
      const {x_coord, y_coord, roadaddress, sillaribridgeid, sillaribridgename, objectidentifier, bridgeoid, bridgeidentifier} = metadata;
      
      let bridgeName = '';
      if (sillaribridgename) {
        const decodedName = decodeURIComponent(sillaribridgename);
        // decodeURIComponent does not handle '+' encoded in Java
        bridgeName = decodedName.replace(/\+/g, ' ');
      }
      
      console.log(x_coord);
      console.log(y_coord);
      console.log(roadaddress);
      console.log(sillaribridgeid);
      console.log(sillaribridgename);
      console.log(bridgeName);
      console.log(objectidentifier);
      console.log(bridgeoid);
      console.log(bridgeidentifier);
      
      const roadAddressParts = roadaddress ? roadaddress.split('-') : [];
      console.log(roadAddressParts);
      
      const postData = JSON.stringify({
        data: [{
          tunnisteavaruus: idSpace,
          tunniste: objectidentifier,
          kuvatyyppi: picType,
          nimi: imageKey, 
          image: objectData,
          tie: roadAddressParts[0] || null,
          tieosa: roadAddressParts[1] || null,
          etaisyys: roadAddressParts[2] || null,
          ajorata: roadAddressParts[3] || null,
          xkoordinaatti: x_coord,
          ykoordinaatti: y_coord,
          sillantunnus: 3, // TODO change after KTV has updated their end, now it has to be number 1-10
          //sillariBridgeId: sillaribridgeid,
          //sillariBridgeName: sillaribridgename,
          //sillariBridgeIdentifier: bridgeidentifier,
          //sillariBridgeOid: bridgeoid
        }]
      });

      const options = {
        hostname: 'devapi.testivaylapilvi.fi',
        path: '/ktv/api/public/KTJLisaaKuvia',
        // path: '/ktv/api/ktv/KTJLisaaKuvia',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      };

      const req = https.request(options, res => {
        let body = '';
        console.log('statusCode', res.statusCode);

        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);

        res.on('end', () => {
          console.log('Successfully processed HTTPS response');
          console.log('RES body', body);
        });
      });

      req.on('error', error => {
        console.error(error)
      });

      req.write(postData);
      req.end();

    });
  }
};
