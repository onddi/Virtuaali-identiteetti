This stuff is for converting the WebGL rotating mesh to a gif. Do this:

# Go to your preferred folder with the webgl thingy:
- `cd demo/`
- `python -m SimpleHTTPServer 8080`
- go to localhost:8080 and position you mesh. The gif will be one full rotation.
- Go back to terminal and close the server with `Ctrl-C`
- change to this folder with `cd ../webgl-to-gif-server`
- run the node file with `node webgl_to_gif_server.js`
- go back to browser and press space. Wait a moment while the .jpg files are generated
- go to the ile with your new images (`cd webgl_to_gif_server/img`) and run `mogrify -background white -flatten *.png`
-then transform the images to a gif: `ffmpeg -i screenshot-%03d.png output.gif`
-move output.gif to the webgl folder and rename

-you'll need imagemagick and ffmpeg (use brew or apt)


