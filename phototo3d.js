/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

var express	= require('express');
var bodyParser	= require('body-parser');
var favicon	= require('serve-favicon');
var async	= require('async');
var unirest	= require('unirest');
var ejs		= require('ejs');

var app = express();
app.use(bodyParser.json ());
app.use(express.static (__dirname + '/www'));
app.use(favicon (__dirname + '/www/images/favicon.ico'));
app.set('view engine', 'ejs');

var client_id		= '2W9HKhs84yScWPyjxipMQM7HpBD5MrG8';
var client_secret	= 'FkeixQySGIS59A2e';
var access_token	= '';
var redirect_uri	= 'http://localhost.autodesk.com:9990/callback';

var scope			= ['data:read', 'data:write'];
var BASE_ENDPOINT	= 'https://developer.api.autodesk.com/photo-to-3d/v1';

var ClientOAuth2 = require('client-oauth2');

var recapAuth = new ClientOAuth2 ({
	clientId			: client_id,
	clientSecret		: client_secret,
	accessTokenUri		: 'https://developer.api.autodesk.com/authentication/v1/gettoken',
	authorizationUri	: 'https://developer.api.autodesk.com/authentication/v1/authorize',
	authorizationGrants	: [ 'code' ],
	redirectUri			: redirect_uri,
	scopes				: scope
});

app.get('/auth', function (req, res) {
	var uri = recapAuth.code.getUri ()
	console.log ('redirection: ' + uri);
	res.redirect(uri);
});

app.get('/callback', function (req, res) {
	recapAuth.code.getToken (req.url)
	.then (function (token) {
		console.log ('token: ');
		console.log (token);
		access_token = token.accessToken;
		res.redirect ('/app');
	});
});

app.get ('/app', function (req, res) {
	var self = this;
	var endpoint = BASE_ENDPOINT + '/service/date';
	unirest.get (endpoint)
	.header ('Accept', 'application/json')
	.header ('Content-Type', 'application/json')
	.header ('Authorization', 'Bearer ' + access_token)
	.end (function (response) {
		try {
			if ( response.statusCode != 200 )
				throw response;

			var json = response.body;
			var obj = {
				'dt': json.date
			};
			res.render ('explore', obj);

		} catch ( err ) {
			console.log(err);
			console.log (response.code + ' - ' + response.body);
			res.status (500).end ();
		}
	});
});

app.post ('/app/createscene', function (req, res) {
	var self = this;
	var sceneName = req.body.name;
	var endpoint = BASE_ENDPOINT + '/photoscene';
	unirest.post (endpoint)
	.header ('Accept', 'application/json')
	.header ('Authorization', 'Bearer ' + access_token)
	.send ({
		'scenename': sceneName,
		'format': 'obj'
	})
	.end (function (response) {
		try {
			if ( response.statusCode != 200 )
				throw response;

			var json = response.body;
			var obj = {
				'id': json.Photoscene.photosceneid
			};
			res.json (obj);
		} catch ( err ) {
			console.log (response.code + ' - ' + response.body);
			res.status (500).end ();
		}
	});
});

app.post ('/app/post', function (req, res) {
	var self = this;
	var sceneId = req.body.id;

	var urlArray = [
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3809.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3810.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3811.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3812.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3813.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3814.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3815.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3816.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3817.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3818.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3819.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3820.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3821.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3822.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3823.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3824.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3825.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3826.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3827.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3828.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3829.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3830.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3831.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3832.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3833.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3834.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3835.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3836.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3837.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3838.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3839.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3840.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3841.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3842.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3843.JPG',
		'/Volumes/DATA/Swift/reality-capture-api/images/binhco/IMG_3844.JPG'
];

	console.log("Posting photos...")

	var endpoint = BASE_ENDPOINT + '/file';
	unirest.post (endpoint)
	.header ('Accept', 'application/json')
	.header ('Content-Type', 'multipart/form-data')
	.header ('Authorization', 'Bearer ' + access_token)
	.field('type', 'image')
	.field('photosceneid', sceneId)
	.attach('file[0]', urlArray[0])
	.attach('file[1]', urlArray[1])
	.attach('file[2]', urlArray[2])
	.attach('file[3]', urlArray[3])
	.attach('file[4]', urlArray[4])
	.attach('file[5]', urlArray[5])
	.attach('file[6]', urlArray[6])
	.attach('file[7]', urlArray[7])
	.attach('file[8]', urlArray[8])
	.attach('file[9]', urlArray[9])
	.attach('file[10]', urlArray[10])
	.attach('file[11]', urlArray[11])
	.attach('file[12]', urlArray[12])
	.attach('file[13]', urlArray[13])
	.attach('file[14]', urlArray[14])
	.attach('file[15]', urlArray[15])
	.attach('file[16]', urlArray[16])
	.attach('file[17]', urlArray[17])
	.attach('file[18]', urlArray[18])
	.attach('file[19]', urlArray[19])
	.attach('file[20]', urlArray[20])
	.attach('file[21]', urlArray[21])
	.attach('file[22]', urlArray[22])
	.attach('file[23]', urlArray[23])
	.attach('file[24]', urlArray[24])
	.attach('file[25]', urlArray[25])
	.attach('file[26]', urlArray[26])
	.attach('file[27]', urlArray[27])
	.attach('file[28]', urlArray[28])
	.attach('file[29]', urlArray[29])
	.attach('file[30]', urlArray[30])
	.attach('file[31]', urlArray[31])
	.attach('file[32]', urlArray[32])
	.attach('file[33]', urlArray[33])
	.attach('file[34]', urlArray[34])
	.attach('file[35]', urlArray[35])
	.end (function (response) {
		try {
			if ( response.statusCode != 200 )
				throw response;

			var json = response.body;
			var obj = {
				'count': json.Files.file.length
			};
			res.json (obj);
		} catch ( err ) {
			console.log (response.code + ' - ' + response.body);
			res.status (500).end ();
		}
	});
});

app.post ('/app/launch', function (req, res) {
	var self = this;
	var sceneId = req.body.id;

	var endpoint = BASE_ENDPOINT + '/photoscene/' + sceneId;
	unirest.post (endpoint)
	.header ('Accept', 'application/json')
	.header ('Authorization', 'Bearer ' + access_token)
	.send ()
	.end (function (response) {
		try {
			if ( response.statusCode != 200 )
				throw response;

			var obj = {
				'ok': 'launched'
			};
			res.json (obj);
		} catch ( err ) {
			console.log (response.code + ' - ' + response.body);
			res.status (500).end ();
		}
	});
});

app.post ('/app/results', function (req, res) {
	var self = this;
	var sceneId = req.body.id;

	var endpoint = BASE_ENDPOINT + '/photoscene/' + sceneId + '?format=obj';
	unirest.get (endpoint)
	.header ('Accept', 'application/json')
	.header ('Authorization', 'Bearer ' + access_token)
	.send ()
	.end (function (response) {
		try {
			if ( response.statusCode != 200 )
				throw response;

			var json = response.body;
			res.json (json);
		} catch ( err ) {
			console.log (response.code + ' - ' + response.body);
			res.status(500).end();
		}
	});
});

app.set ('port', process.env.PORT || 9990);
var server = app.listen (app.get ('port'), function () {
	console.log ('Server listening on port ' + server.address ().port);
});
