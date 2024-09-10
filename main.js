import * as PIXI from 'pixi.js'


const app = new PIXI.Application({ view: document.getElementById('canvas'), width: 500, height: 500 })
const points = []
let imageSprite = null
let graphics = new PIXI.Graphics()
let currentFileName = '' // Store the uploaded file name

const fileInput = document.getElementById('fileUpload')
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) {
        currentFileName = file.name // Capture the file name
        const reader = new FileReader()
        reader.onload = (event) => {
            const texture = PIXI.Texture.from(event.target.result)
            if (imageSprite) app.stage.removeChild(imageSprite)
            imageSprite = new PIXI.Sprite(texture)
            app.stage.addChildAt(imageSprite, 0)
        }
        reader.readAsDataURL(file)
    }
})

app.view.addEventListener('click', (e) => {
    const rect = app.view.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    points.push({ x, y })
    drawPoints()
})

const drawPoints = () => {
    app.stage.removeChild(graphics)
    graphics = new PIXI.Graphics()
    graphics.lineStyle(2, 0xff0000, 0.5)
    graphics.beginFill(0xff0000, 0.5)

    points.forEach((point, index) => {
        graphics.drawCircle(point.x, point.y, 5)
        if (index > 0) {
            graphics.moveTo(points[index - 1].x, points[index - 1].y)
            graphics.lineTo(point.x, point.y)
        }
    })
    if (points.length > 2) {
        graphics.moveTo(points[points.length - 1].x, points[points.length - 1].y)
        graphics.lineTo(points[0].x, points[0].y)
    }

    graphics.endFill()
    app.stage.addChild(graphics)
}

document.getElementById('getCoordinates').addEventListener('click', () => {
    // Log the file name first
    console.log(`File Name: ${currentFileName}`)
    
    // Log coordinates
    const coordinatesJson = JSON.stringify(points)
    console.log(`Coordinates: ${coordinatesJson}`)
    
    // Copy coordinates to clipboard
    navigator.clipboard.writeText(coordinatesJson).then(() => {
        console.log('Coordinates copied to clipboard')
    }).catch(err => {
        console.error('Failed to copy coordinates to clipboard:', err)
    })
})

document.getElementById('removePoints').addEventListener('click', () => {
    points.length = 0 // Clear the points array
    drawPoints() // Redraw the canvas (this will remove all points)
})