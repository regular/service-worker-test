const setCSS = require('module-styles')('3d')

init()

async function init() {
  const img = new Image()
  img.src = "icon2.png"
  await (new Promise( r=> img.onload = r))

  const depth = new Image()
  depth.src = "icon2_depth.jpg"
  await (new Promise( r=> depth.onload = r))

  const canvas = document.createElement("canvas")
  canvas.height = img.height
  canvas.width = img.width

  const gl = canvas.getContext("webgl")

  Object.assign(canvas.style, {
    maxWidth: "100vw",
    maxHeight: "100vh",
    objectFit: "contain",
  })

  document.body.appendChild(canvas)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, -1, 1,
    1, -1, 1, 1,
  ]), gl.STATIC_DRAW)

  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)

  const vshader = `
    attribute vec2 pos;
    varying vec2 vpos;

    void main(){
      vpos = pos*-0.5 + vec2(0.5);
      gl_Position = vec4(pos, 0.0, 1.0);
    }
  `
  const vs = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vs, vshader)
  gl.compileShader(vs)

  const fshader = `
    precision highp float;
    uniform sampler2D img;
    uniform sampler2D depth;
    uniform vec2 mouse;
    varying vec2 vpos;

    void main(){
      float dp = -0.5 + texture2D(depth, vpos).x;
      gl_FragColor = texture2D(img, vpos + mouse * 0.2 * 0.6 * dp);
    }
  `

  const fs = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fs, fshader)
  gl.compileShader(fs)

  const program = gl.createProgram()
  gl.attachShader(program, fs)
  gl.attachShader(program, vs)
  gl.linkProgram(program)
  gl.useProgram(program)

  function setTexture(im, name, num) {
    const texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + num)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)
    gl.uniform1i(gl.getUniformLocation(program, name), num)
  }

  setTexture(img, "img", 0)
  setTexture(depth, "depth", 1)

  const mouseLoc = gl.getUniformLocation(program, "mouse")
  const start_t = Date.now()

  function loop() {
    const t = Date.now() - start_t
    const x = Math.sin( (t/4000 + 0) * 2.0 * Math.PI) * 0.5
    const y = Math.sin( (t/8000 + 0.25) * 2.0 * Math.PI) * 0.5
    const mpos = [x, y]

    gl.uniform2fv(mouseLoc, new Float32Array(mpos))

    gl.clearColor(0.25, 0.65, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    requestAnimationFrame(()=>loop())
  }

  loop()

  /*
  canvas.onmousemove = function (d) {
    const mpos = [-0.5 + d.layerX / canvas.width, 0.5 - d.layerY / canvas.height]
    gl.uniform2fv(mouseLoc, new Float32Array(mpos))
  }*/
}

setCSS(`
  body{
    margin: 0;
    overflow: hidden;
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .message {
    color: #dddddd;
  }
  *{
    box-sizing: border-box;
  }
`)
