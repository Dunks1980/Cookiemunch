VSCode plugins needed for compiling:

```
@command:HookyQR.minify
glenn2223.live-sass
```
Live-sass settings:<br>
Create a .vscode folder with a settings.json file inside with the following settings:

```
{
  "liveSassCompile.settings.formats":[
    {
      "extensionName": ".min.css",
      "format": "compressed",
      "savePath": "/"
    }
  ],
  "liveSassCompile.settings.excludeList": [
    "**/node_modules/**",
    ".vscode/**"
  ],
  "liveSassCompile.settings.generateMap": false,
  "liveSassCompile.settings.autoprefix": [
    "> 0.5%",
    "last 2 versions",
    "Firefox ESR",
    "not dead"
  ]
}
```
On saving the js and scss files they should then create the required .min versions.