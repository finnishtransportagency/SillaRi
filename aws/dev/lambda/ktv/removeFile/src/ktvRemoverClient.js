const https = require('https');

//Kuvien poistoon tarvitaan nämä parametrit 
// {"data": [{"tunnisteavaruus": <tunnisteavaruus>,"tunniste": "<poistettavan kuvan tunniste>","poista": "true"}]} 
//
// "poista": "true" -> kuva poistetaan kokonaan, "poista": "false" -> kuva historioidaan Kuvatiedossa.

module.exports = {
  removeFileFromKVT: function(apiKey, ktvIdentifier) {

    return new Promise((resolve, reject) => {

      // Sillarin tunnisteavaruus on 22 ja kuvatyyppi 2101.
      const idSpace = 22;
      
      console.log('Remove from ktv: ' + ktvIdentifier);
      
      const postData = JSON.stringify({
        data: [{
          tunnisteavaruus: idSpace,
          tunniste: ktvIdentifier,
          poista: true
        }]
      });

      console.log(postData);

      const options = {
        hostname: 'devapi.testivaylapilvi.fi',
        path: '/ktv/api/public/KTJPoistaKuvia',
        // path: '/ktv/api/ktv/KTJPoistaKuvia',
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
