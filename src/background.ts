const imageList: any[] = [];
for (let i = 0; i <= 9; i++) {
    imageList.push(`/background/${i}.jpg`);
}
export var backgroundLoaded = false
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;
document.body.appendChild(canvas);
canvas.classList.add('background');

const images: HTMLImageElement[] = [];
let currentImageSrc: HTMLImageElement | null = null;
let nextImageSrc: HTMLImageElement | null = null;
let isTransitioning = false;
let transitionStartTime = 0;
const transitionDuration = 540; // 过渡动画时长（毫秒）

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    render()
}
resizeCanvas();
const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
});
resizeObserver.observe(document.body);

let imageIndex = 0;
let imageIndexNext = 0;
function randomImageIndex() {
    imageIndex = imageIndexNext;
    do {
        imageIndexNext = Math.floor(Math.random() * imageList.length);
    } while (imageIndexNext === imageIndex);
}

randomImageIndex()
imageIndex = imageIndexNext
async function loadImage() {
    const loadPromises = imageList.map((src, index) =>
        new Promise<void>((resolve) => {
            images[index] = new Image();
            images[index].src = src;
            images[index].onload = () => resolve();
            images[index].onerror = () => resolve();
        })
    );
    await Promise.all(loadPromises);
}
await loadImage();

function drawImageCover(
    context: CanvasRenderingContext2D,
    img: HTMLImageElement
) {
    if (!img) return;

    const canvas = context.canvas;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    }

    context.drawImage(
        img,
        0, 0, img.naturalWidth, img.naturalHeight,
        offsetX, offsetY, drawWidth, drawHeight
    );
}
export function nextImage() {
    if (isTransitioning) return;
    randomImageIndex();
    nextImageSrc = images[imageIndexNext];
    isTransitioning = true;
    transitionStartTime = performance.now();
}

function render() {
    const timestamp = performance.now()

    if (isTransitioning && currentImageSrc && nextImageSrc) {
        const progress = Math.max(Math.min((timestamp - transitionStartTime) / transitionDuration, 1), 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1 - progress;
        drawImageCover(ctx, currentImageSrc);
        ctx.globalAlpha = progress;
        drawImageCover(ctx, nextImageSrc);
        if (progress === 1) {
            isTransitioning = false;
            currentImageSrc = nextImageSrc;
            imageIndex = imageIndexNext;
        }
    } else if (currentImageSrc) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        drawImageCover(ctx, currentImageSrc);
    }
}

export async function loadBackground() {
    await loadImage()
    currentImageSrc = images[imageIndex];
    nextImageSrc = images[imageIndexNext];
    backgroundLoaded = true
    const loop = () => {
        render()
        requestAnimationFrame(loop)
    };
    requestAnimationFrame(loop);
}