# 3D rendering app for SMILES (Simplified molecular-input line-entry system) files

To be used for educational and demonstration purposes. 
Application accepts file(s) in [SMILES file format](https://en.wikipedia.org/wiki/Simplified_molecular-input_line-entry_system), uses the [ChEMBL API](https://www.ebi.ac.uk/chembl/api/utils/docs) methods to convert SMILES string from file to [xyz coordinates](https://en.wikipedia.org/wiki/XYZ_file_format), having the coordinates, the application utilizes [Speck](http://wwwtyro.github.io/speck/) library ([source](https://github.com/wwwtyro/speck)) to display a 3D compound model. 

During the development, I found out that [Speck](http://wwwtyro.github.io/speck/) is not a true JavaScript library, nor a JQuery plugin, and since I had no time to re-write it to be a Vue.js component, I ended up retrofitting their build to my Vue.js app.

Some key features: 

* Written in [Vue.js](https://vuejs.org/) The Progressive JavaScript Framework.
* Demonstrates interaction with [ChEMBL API](https://www.ebi.ac.uk/chembl/api/utils/docs).
* Utilizes [Speck](http://wwwtyro.github.io/speck/) for 3D model rendering.
* Has verification procedure and accepts only valid SMILES files.
* Works great in all browsers including mobile! (Thanks to responsive web design)
* Supports multiple files conversion and rendering.
* Features drag-and-drop functionality.
* Uses SASS/SCSS for styling. 
* Has thoroughly commented code.

## DEMO

Thanks to [GitHub pages](https://pages.github.com/), live demo is available [HERE](https://aseevia.github.io/smiles-3d-vue/).

## Mobile browser issues

While the app has responsive design and adapts to any screen size from the smallest iphone to TV, the [Speck](http://wwwtyro.github.io/speck/) appears to have some WebGL shader issues which prevent rendering on mobile platforms. Tested both iOS and Android with no luck, it throws the follwing error:
> Extension EXT _frag_depth not available

If anyone knows how to fix this without re-writing Speck, please let me know.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

