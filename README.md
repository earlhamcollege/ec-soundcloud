## EC-SOUNDCLOUD Module
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
//to be added

### License
This project is licensed under the MIT License - see the LICENSE.md file for details.
