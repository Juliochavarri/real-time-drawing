const socket = io()

var click = false
var moving_mouse = false
var x_position = 0
var y_position = 0
var previous_position = null
var color = 'black'

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const users = document.getElementById('users')

const width = window.innerWidth
const height =  window.innerHeight

canvas.width = width
canvas.height = height

canvas.addEventListener('mousedown', () => {
    // console.log('Está dando click')
    click = true
})

canvas.addEventListener('mouseup', () => {
    // console.log('No está dando click')
    click = false
})

canvas.addEventListener('mousemove', e => {
    // console.log(e)
    x_position = e.clientX
    y_position = e.clientY
    moving_mouse = true
})

const changeColor = newColor => {
    color = newColor
    context.strokeStyle = color
    context.stroke()
}


const delete_all = () => {
    socket.emit('delete')
}

const create_drawing = () => {
    if(click && moving_mouse & previous_position !== null) {
        let drawing = {
            x_position,
            y_position,
            color,
            previous_position
        }
        socket.emit('drawing', drawing)
    }
    previous_position = {
        x_position,
        y_position,
    }
    setTimeout(create_drawing, 25)
}

socket.on('show_drawing', drawing => {
    if(drawing !== null) {
        context.beginPath()
        context.lineWidth = 3
        context.strokeStyle = drawing.color
        context.moveTo(drawing.x_position, drawing.y_position)
        context.lineTo(drawing.previous_position.x_position, drawing.previous_position.y_position)
        context.stroke()
    } else {
        context.clearRect(0,0,canvas.width,canvas.height)
    }
})

socket.on('users', number => {
    users.innerHTML = `Número de usuarios conectados: ${number}`
})

create_drawing()