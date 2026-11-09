# vendor/

Optional local fallback for third-party libraries.

`index.html` loads three.js r128 from cdnjs. If that request fails, it loads
`vendor/three.min.js` from here instead. To add the local copy, run
`sh scripts/fetch-vendor.sh`, or download
https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js and save it in
this folder as `three.min.js`.

If neither copy loads, the site still works: the 3D globe is replaced by the
static gradient background.
