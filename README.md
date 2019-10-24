## EC-SOUNDCLOUD Module

[![npm version](https://badge.fury.io/js/ec-soundcloud.svg)](https://badge.fury.io/js/ec-soundcloud)
[![GitHub issues](https://img.shields.io/github/issues/earlhamcollege/ec-soundcloud)](https://github.com/earlhamcollege/ec-soundcloud/issues)
[![GitHub license](https://img.shields.io/github/license/earlhamcollege/ec-soundcloud)](https://github.com/earlhamcollege/ec-soundcloud/blob/master/LICENSE)

An [Apostrophe CMS](http://apostrophecms.org/) module to provide customizable tools for soundcloud widgets.


### GETTING STARTED

#### Prerequisites
In order to use this module, you should have:
- NPM
- ApostropheCMS

#### Installing
From within your apostrophe project directory, run
 `npm install --save ec-soundcloud`

Include widget in projects' app.js file:

```
bundles: ['ec-soundcloud'],
modules: {
    'ec-soundcloud': {},
    'apostrophe-express': {
        csrf: {
            exceptions: ['soundcloud']
        }
    },
    // ... other modules
}
```

### Configuration
If you want your soundcloud environment settings to be global, use the following app.js adjustments:

```
modules: {
    settings: {
        alias: 'settings',
        client_id: '<your client id from soundcloud account>',
        api_key: '<your api key for the soundcloud api>'
    }
  // ... other modules, etc.
}
```

### Screenshots
![Focus View](http://porterlibby.herokuapp.com/img_content/ec-soundcloud.png)
