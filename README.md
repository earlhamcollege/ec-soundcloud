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
//to be added

### Screenshots
//to be added

### License
This project is licensed under the MIT License - see the LICENSE.md file for details.
