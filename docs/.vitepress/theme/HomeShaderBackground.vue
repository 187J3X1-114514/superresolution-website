<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { inBrowser } from 'vitepress'

const canvas = ref<HTMLCanvasElement>()

let gl: WebGLRenderingContext | null = null
let backgroundProgram: WebGLProgram | null = null
let screenProgram: WebGLProgram | null = null
let sidebarProgram: WebGLProgram | null = null
let buffer: WebGLBuffer | null = null
let framebuffer: WebGLFramebuffer | null = null
let colorTexture: WebGLTexture | null = null
let animationFrame = 0
let startTime = 0
let framebufferWidth = 0
let framebufferHeight = 0

const uniforms = {
  backgroundResolution: null as WebGLUniformLocation | null,
  backgroundTime: null as WebGLUniformLocation | null,
  screenTexture: null as WebGLUniformLocation | null,
  sidebarTexture: null as WebGLUniformLocation | null,
  sidebarResolution: null as WebGLUniformLocation | null,
  sidebarWidth: null as WebGLUniformLocation | null,
  sidebarDark: null as WebGLUniformLocation | null,
}

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const backgroundFragmentShaderSource = `
precision highp float;

#define G 0.035

uniform vec2 u_resolution;
uniform float u_time;

mat2 R(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 H(vec2 p) {
  p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
  return fract(sin(p) * 43758.5453);
}

float N(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return 0.5 + 0.5 * mix(
    mix(
      dot(-1.0 + 2.0 * H(i), f),
      dot(-1.0 + 2.0 * H(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)),
      u.x
    ),
    mix(
      dot(-1.0 + 2.0 * H(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
      dot(-1.0 + 2.0 * H(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)),
      u.x
    ),
    u.y
  );
}

float F(vec2 uv) {
  return length(H(uv));
}

void main() {
  vec2 f = gl_FragCoord.xy, u = f / u_resolution.xy;
  float a = u_resolution.x / u_resolution.y;

  vec2 t = u - 0.5;
  float d = N(vec2(u_time * 0.025, t.x * t.y));
  t.y /= a;
  t *= R(radians((d - 0.5) * 720.0 + 180.0));
  t.y *= a;

  float freq = 4.0, amp = 42.0, sp = u_time * 0.7;
  t.x += sin(t.y * freq + sp) / amp;
  t.y += sin(t.x * freq * 1.5 + sp) / (amp * 0.5);

  vec3 C1 = vec3(210.0, 222.0, 225.0) / 255.0;
  vec3 C2 = vec3(178.0, 184.0, 178.0) / 255.0;
  vec3 C3 = vec3(128.0, 96.0, 92.0) / 255.0;
  vec3 C4 = vec3(48.0, 72.0, 92.0) / 255.0;
  vec3 C5 = vec3(42.0, 60.0, 74.0) / 255.0;
  vec3 C6 = vec3(70.0, 58.0, 86.0) / 255.0;
  float cyc = sin(u_time * 0.22);
  float tt = (sign(cyc) * pow(abs(cyc), 0.6) + 1.0) / 2.0;
  vec3 c1 = mix(C1, C3, tt), c2 = mix(C2, C4, tt);
  vec3 c3 = mix(C3, C5, tt), c4 = mix(C4, C6, tt);

  vec3 l1 = mix(c3, c2, smoothstep(-0.03, 0.2, (t * R(radians(-5.0))).x));
  vec3 l2 = mix(c4, c1, smoothstep(-0.02, 0.2, (t * R(radians(-5.0))).x));
  vec3 col = mix(l1, l2, smoothstep(0.05, -0.3, t.y));

  col *= 0.95;
  col = pow(col, vec3(1.18));
  col -= F(u) * G;

  gl_FragColor = vec4(col, 1.0);
}
`

const screenFragmentShaderSource = `
precision highp float;

uniform sampler2D u_texture;
varying vec2 v_uv;

void main() {
  gl_FragColor = texture2D(u_texture, v_uv);
}
`

const sidebarFragmentShaderSource = `
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_sidebar_width;
uniform float u_dark;
varying vec2 v_uv;

vec3 sampleBackground(vec2 uv) {
  return texture2D(u_texture, clamp(uv, vec2(0.0), vec2(1.0))).rgb;
}

void main() {
  float fade = smoothstep(1.0, 0.05, v_uv.x);
  float blur = fade * fade;
  vec2 sourceUv = vec2(v_uv.x * (u_sidebar_width / max(u_resolution.x, 1.0)), v_uv.y);
  vec2 radius = vec2(30.0 / max(u_resolution.x, 1.0), 12.0 / max(u_resolution.y, 1.0)) * blur;

  vec3 col = vec3(0.0);
  col += sampleBackground(sourceUv + radius * vec2(-1.0, -0.5)) * 0.10;
  col += sampleBackground(sourceUv + radius * vec2(-0.55, 0.65)) * 0.14;
  col += sampleBackground(sourceUv) * 0.28;
  col += sampleBackground(sourceUv + radius * vec2(0.55, -0.65)) * 0.14;
  col += sampleBackground(sourceUv + radius * vec2(1.0, 0.5)) * 0.10;
  col += sampleBackground(sourceUv + radius * vec2(-0.25, 1.0)) * 0.12;
  col += sampleBackground(sourceUv + radius * vec2(0.25, -1.0)) * 0.12;

  vec3 lightSurface = vec3(0.945, 0.957, 0.949);
  vec3 darkSurface = vec3(0.063, 0.078, 0.078);
  vec3 surface = mix(lightSurface, darkSurface, u_dark);
  col = mix(col, surface, mix(0.58, 0.72, u_dark) * fade);

  gl_FragColor = vec4(col, fade);
}
`

function createShader(type: number, source: string) {
  if (!gl) return null

  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader

  console.error(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
  return null
}

function createProgram(fragmentSource: string) {
  if (!gl) return null

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource)
  if (!vertexShader || !fragmentShader) return null

  const shaderProgram = gl.createProgram()
  if (!shaderProgram) return null

  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) return shaderProgram

  console.error(gl.getProgramInfoLog(shaderProgram))
  gl.deleteProgram(shaderProgram)
  return null
}

function bindQuad(program: WebGLProgram) {
  if (!gl) return

  const positionAttribute = gl.getAttribLocation(program, 'a_position')
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.enableVertexAttribArray(positionAttribute)
  gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0)
}

function ensureRenderTarget(width: number, height: number) {
  if (!gl) return
  if (framebuffer && colorTexture && framebufferWidth === width && framebufferHeight === height) return

  if (framebuffer) gl.deleteFramebuffer(framebuffer)
  if (colorTexture) gl.deleteTexture(colorTexture)

  colorTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, colorTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

  framebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0)
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteFramebuffer(framebuffer)
    gl.deleteTexture(colorTexture)
    framebuffer = null
    colorTexture = null
    framebufferWidth = 0
    framebufferHeight = 0
    return
  }

  framebufferWidth = width
  framebufferHeight = height
}

function resizeCanvasOnly() {
  if (!canvas.value) return { width: 1, height: 1 }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  const width = Math.max(1, Math.floor(canvas.value.clientWidth * pixelRatio))
  const height = Math.max(1, Math.floor(canvas.value.clientHeight * pixelRatio))

  if (canvas.value.width !== width || canvas.value.height !== height) {
    canvas.value.width = width
    canvas.value.height = height
  }

  return { width, height }
}

function getSidebarViewport(canvasHeight: number) {
  if (!canvas.value) return null
  if (!document.querySelector('.VPContent.has-sidebar')) return null

  const sidebar = document.querySelector<HTMLElement>('.VPSidebar')
  if (!sidebar) return null

  const rect = sidebar.getBoundingClientRect()
  const style = window.getComputedStyle(sidebar)
  const pixelRatio = canvas.value.width / Math.max(1, canvas.value.clientWidth)
  const width = Math.max(0, Math.round(rect.width * pixelRatio))

  if (style.visibility === 'hidden' || style.display === 'none') return null
  if (width <= 0 || rect.left > 1 || rect.right <= 0) return null

  return {
    width: Math.min(width, canvas.value.width),
    height: canvasHeight,
  }
}

function renderBackground(width: number, height: number, time: number) {
  if (!gl || !backgroundProgram || !uniforms.backgroundResolution || !uniforms.backgroundTime) return

  gl.useProgram(backgroundProgram)
  bindQuad(backgroundProgram)
  gl.uniform2f(uniforms.backgroundResolution, width, height)
  gl.uniform1f(uniforms.backgroundTime, time)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function render(now: number) {
  if (
    !gl ||
    !backgroundProgram ||
    !uniforms.backgroundResolution ||
    !uniforms.backgroundTime ||
    !canvas.value
  ) {
    return
  }

  const { width, height } = resizeCanvasOnly()
  const time = (now - startTime) / 1000
  const sidebarViewport = getSidebarViewport(height)
  if (sidebarViewport) ensureRenderTarget(width, height)

  gl.disable(gl.BLEND)

  if (
    sidebarViewport &&
    screenProgram &&
    sidebarProgram &&
    uniforms.screenTexture &&
    uniforms.sidebarTexture &&
    uniforms.sidebarResolution &&
    uniforms.sidebarWidth &&
    uniforms.sidebarDark &&
    framebuffer &&
    colorTexture
  ) {
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.viewport(0, 0, width, height)
    renderBackground(width, height, time)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, width, height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, colorTexture)
    gl.useProgram(screenProgram)
    bindQuad(screenProgram)
    gl.uniform1i(uniforms.screenTexture, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.viewport(0, 0, sidebarViewport.width, sidebarViewport.height)
    gl.useProgram(sidebarProgram)
    bindQuad(sidebarProgram)
    gl.uniform1i(uniforms.sidebarTexture, 0)
    gl.uniform2f(uniforms.sidebarResolution, width, height)
    gl.uniform1f(uniforms.sidebarWidth, sidebarViewport.width)
    gl.uniform1f(uniforms.sidebarDark, document.documentElement.classList.contains('dark') ? 1 : 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    gl.disable(gl.BLEND)
  } else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, width, height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    renderBackground(width, height, time)
  }

  animationFrame = window.requestAnimationFrame(render)
}

function start() {
  if (gl || !canvas.value) return

  gl = canvas.value.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  })

  if (!gl) return

  backgroundProgram = createProgram(backgroundFragmentShaderSource)
  screenProgram = createProgram(screenFragmentShaderSource)
  sidebarProgram = createProgram(sidebarFragmentShaderSource)

  if (!backgroundProgram) {
    stop()
    return
  }

  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

  uniforms.backgroundResolution = gl.getUniformLocation(backgroundProgram, 'u_resolution')
  uniforms.backgroundTime = gl.getUniformLocation(backgroundProgram, 'u_time')
  uniforms.screenTexture = screenProgram ? gl.getUniformLocation(screenProgram, 'u_texture') : null
  uniforms.sidebarTexture = sidebarProgram ? gl.getUniformLocation(sidebarProgram, 'u_texture') : null
  uniforms.sidebarResolution = sidebarProgram ? gl.getUniformLocation(sidebarProgram, 'u_resolution') : null
  uniforms.sidebarWidth = sidebarProgram ? gl.getUniformLocation(sidebarProgram, 'u_sidebar_width') : null
  uniforms.sidebarDark = sidebarProgram ? gl.getUniformLocation(sidebarProgram, 'u_dark') : null

  gl.clearColor(0, 0, 0, 1)
  startTime = performance.now()
  animationFrame = window.requestAnimationFrame(render)
}

function stop() {
  if (animationFrame && inBrowser) window.cancelAnimationFrame(animationFrame)
  animationFrame = 0

  if (gl) {
    if (buffer) gl.deleteBuffer(buffer)
    if (framebuffer) gl.deleteFramebuffer(framebuffer)
    if (colorTexture) gl.deleteTexture(colorTexture)
    if (backgroundProgram) gl.deleteProgram(backgroundProgram)
    if (screenProgram) gl.deleteProgram(screenProgram)
    if (sidebarProgram) gl.deleteProgram(sidebarProgram)
  }

  gl = null
  backgroundProgram = null
  screenProgram = null
  sidebarProgram = null
  buffer = null
  framebuffer = null
  colorTexture = null
  framebufferWidth = 0
  framebufferHeight = 0
  Object.keys(uniforms).forEach((key) => {
    uniforms[key as keyof typeof uniforms] = null
  })
}

onMounted(async () => {
  if (!inBrowser) return

  await nextTick()
  start()
})

onBeforeUnmount(stop)
</script>

<template>
  <canvas
    ref="canvas"
    class="sr-site-shader-background"
    aria-hidden="true"
  />
</template>
