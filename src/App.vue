<!-- App.vue -->

<!-- HTML Template -->
<template>
  <div id="app">
    <img src="./assets/logo.png" class="logo">
    <div class="container">
      <!--UPLOAD-->
      <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
        <h1>Upload SMILES file</h1>
        <div class="dropbox">
          <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="*/*" class="input-file">
            <p v-if="isInitial">
              Drag your file(s) here to begin<br> or click to browse
            </p>
            <p v-if="isSaving">
              Uploading {{ fileCount }} file(s)...
            </p>
        </div>
      </form>
      
      <!--SUCCESS-->
      <div v-if="isSuccess">
        <h2>Uploaded {{ Object.keys(uploadedFiles).length }} file(s) successfully.</h2>
        <p>
          <a href="javascript:void(0)" @click="reset()">Upload again</a>
        </p>
        <ul class="list-unstyled">
          <li v-for="(value, key) in uploadedFiles" :key="key">
            <a href="javascript:void(0)" @click="render2speck(key)">Render {{ key }} XYZ coversion:</a><br>
            <pre class="xyz-text">
              {{ value }}
            </pre> 
          </li>
        </ul>
        
      </div>
      <!--FAILED-->
      <div v-if="isFailed">
        <h2>Upload failed.</h2>
        <p>
          <a href="javascript:void(0)" @click="reset()">Try again</a>
        </p>
        <p>{{ uploadError }}</p>
      </div>


    <!-- SPECK -->
    <div id="speck">
        <div id="render-container" style="margin: 0 auto;"> 
            <canvas id="renderer-canvas"></canvas>
        </div>

        <div id="controls-menu" style="display: none;">
            <button id="menu-button-structure">Structure</button>
            <button id="menu-button-render">Render</button>
            <button id="menu-button-share">Share</button>
            <button id="menu-button-help">Help</button>
            <button id="menu-button-about">About</button>
        </div>

        <div id="controls-container" style="display: none;">

            <div id="controls-structure">

                <h2>Samples</h2>

                <select id="controls-sample"></select>

                <h2>Custom</h2>

                Paste xyz file data:<br>

                <textarea id="xyz-data" rows="4" columns="10"></textarea><br><br>

                <button id="xyz-button">Load</button><br><br>

            </div>

            <div id="controls-render">

                <table>
                    <tr>
                        <td align="right">Preset</td>
                        <td>
                            <select id="view-preset">
                                <option value="default">Default</option>
                                <option value="stickball">Ball & Stick</option>
                                <option value="toon">Toon</option>
                                <option value="licorice">Licorice</option>
                            </select>
                        </td>
                    </tr>
                    <tr><td colspan="10"><hr></td></tr>
                    <tr>
                        <td align="right">Atom radius</td>
                        <td><input id="atom-radius" type="range" min="1" max="100" value="50" class="control-width"></td>
                        <td id="atom-radius-text"></td>
                        <td class="control-help">a + scrollwheel</td>
                    </tr>
                    <tr>
                        <td align="right">Relative atom radius</td>
                        <td><input id="relative-atom-radius" type="range" min="0" max="100" value="100" class="control-width"></td>
                        <td id="relative-atom-radius-text"></td>
                        <td class="control-help">z + scrollwheel</td>
                    </tr>
                    <tr>
                        <td align="right">Atom shade</td>
                        <td><input id="atom-shade" type="range" min="0" max="100" value="0" class="control-width"></td>
                        <td id="atom-shade-text"></td>
                        <td class="control-help">w + scrollwheel</td>
                    </tr>
                    <tr><td colspan="10"><hr></td></tr>
                    <tr>
                        <td align="right">Bonds</td>
                        <td><input type="checkbox" id="bonds"></td>
                    </tr>
                    <tr>
                        <td align="right">Bond radius</td>
                        <td><input id="bond-radius" type="range" min="0" max="100" value="50" class="control-width"></td>
                        <td id="bond-radius-text"></td>
                        <td class="control-help">b + scrollwheel</td>
                    </tr>
                    <tr>
                        <td align="right">Bond threshold</td>
                        <td><input type="number" step="0.1" min="0.0" max="2.5" id="bond-threshold" value="1.2" class="control-width"></td>
                    </tr>
                    <tr>
                        <td align="right">Bond shade</td>
                        <td><input id="bond-shade" type="range" min="0" max="100" value="0" class="control-width"></td>
                        <td id="bond-shade-text"></td>
                        <td class="control-help">s + scrollwheel</td>
                    </tr>
                    <tr><td colspan="10"><hr></td></tr>
                    <tr>
                        <td align="right">Ambient occlusion</td>
                        <td><input id="ambient-occlusion" type="range" min="0" max="100" value="50" class="control-width"></td>
                        <td id="ambient-occlusion-text"></td>
                        <td class="control-help">o + scrollwheel</td>
                    </tr>
                    <tr>
                        <td align="right">Brightness</td>
                        <td><input id="brightness" type="range" min="0" max="100" value="50" class="control-width"></td>
                        <td id="brightness-text"></td>
                        <td class="control-help">l + scrollwheel</td>
                    </tr>
                    <tr>
                        <td align="right">AO Resolution</td>
                        <td>
                            <select id="ao-resolution">
                                <option value="16">16x16</option>
                                <option value="32">32x32</option>
                                <option value="64">64x64</option>
                                <option value="128">128x128</option>
                                <option value="256">256x256</option>
                                <option value="512">512x512</option>
                                <option value="1024">1024x1024</option>
                                <option value="2048">2048x2048</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">Samples per frame</td>
                        <td>
                            <select id="samples-per-frame">
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="4">4</option>
                                <option value="8">8</option>
                                <option value="16">16</option>
                                <option value="32">32</option>
                                <option value="64">64</option>
                                <option value="128">128</option>
                                <option value="256">256</option>
                            </select>
                        </td>
                    </tr>
                    <tr><td colspan="10"><hr></td></tr>
                    <tr>
                        <td align="right">Depth of field strength</td>
                        <td><input id="dof-strength" type="range" min="0" max="100" value="0" class="control-width"></td>
                        <td id="dof-strength-text"></td>
                        <td class="control-help">d + scrollwheel</td>
                    </tr>
                    <tr>
                        <td align="right">Depth of field position</td>
                        <td><input id="dof-position" type="range" min="0" max="100" value="0" class="control-width"></td>
                        <td id="dof-position-text"></td>
                        <td class="control-help">p + scrollwheel</td>
                    </tr>
                    <tr><td colspan="10"><hr></td></tr>
                    <tr>
                        <td align="right">Outline strength</td>
                        <td><input id="outline-strength" type="range" min="0" max="100" value="50" class="control-width"></td>
                        <td id="outline-strength-text"></td>
                        <td class="control-help">q + scrollwheel</td>
                    </tr>
                    <tr>
                        <td align="right">Antialiasing passes</td>
                        <td><input type="number" step="1" min="0" max="32" id="fxaa" value="1" class="control-width"></td>
                    </tr>
                    <tr>
                        <td align="right">Resolution</td>
                        <td>
                            <select id="resolution">
                                <option value="256">256x256</option>
                                <option value="512">512x512</option>
                                <option value="768">768x768</option>
                                <option value="1024">1024x1024</option>
                                <option value="1536">1536x1536</option>
                                <option value="2048">2048x2048</option>
                            </select>
                        </td>
                    </tr>
                </table>

                <button id="center-button">Center</button>

            </div>

            <div id="controls-share">

                <button id="share-url-button">Click this</button>then share the url below.<br><br>
                <textarea id="share-url" cols="48" rows="8"></textarea><br><br>

                <hr><br>

                <a href='#' class=button id="download-image-button" download='render.png'>Download</a>as a
                <select id="download-image-format-selector">
                    <option value="png">PNG</option>
                    <option value="jpg">JPEG</option>
                    <option value="bmp">BMP</option>
                    <option value="gif">GIF</option>
                    <option value="webp">WebP</option>
                </select>
                <br><br>

            </div>

            <div id="controls-help">

                <p>
                    Speck has been tested against recent Firefox and Chrome browsers. Performance
                    appears to be significantly better on Chrome.<br><br>

                    To translate your system, use the shift key and click and drag on the rendering.
                    To rotate, click and drag. To zoom, use the scrollwheel.
                </p>

            </div>

            <div id="controls-about">

                <h2>Speck</h2>
                High quality atomistic system rendering.<br><br>
                Author: Rye Terrell | wwwtyro at gmail.com<br><br>
                Github: <a href="https://github.com/wwwtyro/speck">https://github.com/wwwtyro/speck</a>
                <h2>Copyright, license, etc.</h2>
                <p>
                    Speck and the images it produces are completely public domain
                    and free to use. Do with it/them what you will. Attribution
                    is appreciated but not required.
                </p>

            </div>

        </div>

        <div id="ao-indicator" style="display: none;"></div>

        <div id="error" style="display: none;">
            <div id="error-text"></div>
            <br>
            <button id="close-error">Continue</button>
        </div>
    </div>

    </div>
  </div>
  
</template>

<!-- Javascript -->
<script>
import { convert2xyz, xyz2speck } from "./convert.service";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  name: "app",
  data() {
    return {
      uploadedFiles: {},
      filesData: null,
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "smiles"
    };
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = {};
      this.uploadError = null;
    },
    render2speck(key){
      loadStructure(xyz2speck(this.uploadedFiles[key])[0]);
    },
    processFiles(formData) {
      this.currentStatus = STATUS_SAVING;

      // Send files for conversion
      convert2xyz(formData)
        .then(xyzArr => {
          
          xyzArr.map( x => {
            this.uploadedFiles[x.name] = x.body;
          });
          //loadStructure(xyz2speck(this.uploadedFiles[Object.keys(this.uploadedFiles)[0]])[0]);
          this.render2speck(Object.keys(this.uploadedFiles)[0]);
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.uploadError = err.message;
          this.currentStatus = STATUS_FAILED;
          console.error(err);
        });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      this.filesData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map(x => {
        this.filesData.append(fieldName, fileList[x], fileList[x].name);
      });

      // process it
      this.processFiles(this.filesData);
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<!-- SASS styling -->
<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5%;
}
.logo{
  width: 100px;
}
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  cursor: pointer;
}

.input-file {
  position: absolute;
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}

.xyz-text {
  width: 90%;
  max-width: 600px;
  height: 150px;
  margin: 0 auto;
  overflow: auto;
  text-align: left;
  border: 2px solid grey;
  margin-bottom: 10px;
  margin-top: 5px;
}

.list-unstyled {
  list-style: none;
  padding: 0;
}
</style>