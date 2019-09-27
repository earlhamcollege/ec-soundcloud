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
                step: 1
            },
            {
                type: 'checkboxes',
                name: 'preferences',
                label: 'Display Preferences',
                required: 'false',
                choices: [
                    {
                        label: 'Release Number',
                        value: 'count'
                    },
                    {
                        label: 'Title',
                        value: 'title'
                    },
                    {
                        label: 'Date',
                        value: 'date'
                    },
                    {
                        label: 'Time',
                        value: 'time'
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
                type: 'select',
                choices: [
                    {
                        value: '00ee00',
                        label: 'Green'
                    },
                    {
                        value: '0000ee',
                        label: 'Blue'
                    },
                    {
                        value: 'ee0000',
                        label: 'Red'
                    }
                ]
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
                name:'appearance',
                label: 'Appearance Settings',
                fields: ['player_color']
            }
          ].concat(options.arrangeFields || [])
    },
    construct: function (self, options) {
        self.addHelpers({
            track: function () {
                console.log('track');
            },
            features: function () {
                console.log('features');
            }
        });
        var superPushAssets = self.pushAssets;
        self.pushAssets = function() {
            self.pushAsset('stylesheet','always');
            self.pushAsset('script','always');
            superPushAssets();
        }
    },
    afterConstruct: function(self) {
        var widgetOptions = {};
        //self.template = "placeholder";

        self.route('get', 'soundcloud', function (req, res) {
            var url = "https://api.soundcloud.com/resolve?url=http://soundcloud.com/"+"earlhamcollege"+"&client_id="+req.query.api_key;

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
                //console.log(results.body);
                return callback(null, JSON.parse(results.body));
            });
        }
        /*
        self.output = function(widget, options, req) {
            return self.partial(self.template, {
                widget: widget,
                options: options,
                req: req
            });
        };
        */
    }
};
