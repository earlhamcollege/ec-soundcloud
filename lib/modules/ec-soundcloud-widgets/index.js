var r = require('request');
const request = require('request-promise');
module.exports = {
    extend: 'apostrophe-widgets',
    contextual: true,
    label: 'EC Soundcloud',
    alias: 'link',
    name: 'ec-soundcloud',
    perPage: 50,
    beforeConstruct: function(self, options){
        options.addFields = [
            {
                name: 'api_key',
                type: 'password',
                label: 'API key',
                required: 'true'
            },
            {
                name: 'client_id',
                htmlHelp: '<a href="https://soundcloud.com/settings/content">Client ID can be found in the RSS feed URL after "users:"</a>',
                type: 'string',
                label: 'Client ID',
                required: 'true'
            },
            {
                name: 'feature_count',
                type: 'range',
                label: 'Number of Featured Episodes',
                min: 0,
                max: 4,
                step: 1,
                def: 4,
            },
            {
                type: 'checkboxes',
                name: 'preferences',
                label: 'Display Preferences',
                required: 'false',
                def: 'count,title,date,time,views',
                choices: [
                    {
                        label: 'Release Number',
                        value: 'count',
                    },
                    {
                        label: 'Title',
                        value: 'title',
                    },
                    {
                        label: 'Date',
                        value: 'date',
                    },
                    {
                        label: 'Time',
                        value: 'time',
                    },
                    {
                        label: 'View Count',
                        value: 'views'
                    }
                ]
            },
            {
                name: 'player_color',
                label: 'Player Accent Color',
                type: 'color',
                def: '#00EE00'
            },
            {
                name: 'player_autoplay',
                label: 'Autoplay',
                type: 'boolean',
                def: false
            },
            {
                name: 'player_comments',
                label: 'Show Comments',
                type: 'boolean',
                def: false
            }
        ].concat(options.addFields || []);
        options.arrangeFields = [
            {
              name:'user',
              label:'User Settings',
              fields: ['api_key', 'client_id']
            },
            {
              name:'display',
              label: 'Display Settings',
              fields: ['preferences', 'feature_count']
            },
            {
                name:'player',
                label: 'Player Settings',
                fields: ['player_color','player_autoplay','player_comments']
            }
          ].concat(options.arrangeFields || [])
    },
    construct: function (self, options) {

        self.route('get', 'soundcloud', function (req, res) {
            console.log(options.api_key);
            console.log(options.client_id);
            var url = "https://api.soundcloud.com/resolve?url=http://soundcloud.com/"+"earlhamcollege"+"&client_id="+req.query.api_key;
            console.log(url);
            return self.getData(url, function (err, results) {
                if (err) {
                    results = [];
                }
                return res.send(self.render(req, 'widget', {
                    data: results
                }));
            });
        });

        self.getData = function (url, callback) {
            return r(url, function (err, results) {
                if (err) {
                console.error('error:', err);
                    return callback(err);
                }
                console.log(results.body);
                return callback(null, JSON.parse(results.body));
            });
        }

        var superPushAssets = self.pushAssets;
        self.pushAssets = function() {
            self.pushAsset('stylesheet','always');
            self.pushAsset('script','always');
            superPushAssets();
        }
    }
};
