var r = require('request');
module.exports = {
    extend: 'apostrophe-widgets',
    contextual: true,
    label: 'EC Soundcloud',
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
            }
        ].concat(options.addFields || []);
    },
    construct: function (self, options) {

        //self.template = "placeholder";
        var widgetOptions = {};

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
                return callback(null, JSON.parse(results.body));
            });
        }
        self.output = function(widget, options, req) {
            return self.partial(self.template, {
                widget: widget,
                options: options,
                req: req
            });
          };
        var superPushAssets = self.pushAssets;
        self.pushAssets = function() {
            superPushAssets();
            self.pushAsset('stylesheet','always');
            self.pushAsset('script','always');
        }
    }
};
