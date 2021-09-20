const panel_div = document.querySelector('.panel')
const panelLength = panel_div.getBoundingClientRect().height
const startGame_div = document.querySelector('.start-game')
const jumpSound = document.querySelector('#jump-sound')
const loseSound = document.querySelector('#lose-sound')

// variables
let mainInterval
let jumpInterval
let leftInterval
let rightInterval
let platforms = createPlatform()
let jumper = new Jumper()
let isJumping = false
let isLanded
let canJump

// class
function Platform(bottom, left) {
    this.bottom = bottom
    this.left = left
    this.htmlElem = document.createElement('div')

    const htmlElem = this.htmlElem
    htmlElem.classList.add('platform')
    htmlElem.style.bottom = `${bottom}px`
    htmlElem.style.left = `${left}px`
    panel_div.appendChild(htmlElem)
}

function Jumper() {
    this.left = platforms[0].left
    this.bottom = platforms[0].bottom
    this.htmlElem = document.createElement('div')

    const htmlElem = this.htmlElem
    htmlElem.classList.add('jumper')
    htmlElem.style.left = `${this.left + 10}px`
    htmlElem.style.bottom = `${this.bottom + 15}px`
    panel_div.appendChild(htmlElem)
}

// functions

// bu fonksiyon sadece oyun yüklendiğinde çalışır
// amacı ilk platformları üretmektir
// yeni eklenecek platformlarla ilgilenmez
function createPlatform() {
    let allPlats = []
    for (let i = 0; i < 5; i++) {
        const bottomVal = (panelLength / 5) + i * 150
        const leftVal = Math.random() * 500 - 100
        let item = new Platform(bottomVal, leftVal + 100)
        allPlats.push(item)
    }
    return allPlats
}

function movePlatforms() {
    for (let i of platforms) {
        i.bottom -= 3
        i.htmlElem.style.bottom = `${i.bottom}px`
        if (i.bottom <= -4) {
            i.htmlElem.style.display = 'none'
            platforms.shift()
            appendPlatform()
        }
    }
}

// platform ekrandan çıktıktan sonra yenisini ekleyen fonksiyon
function appendPlatform() {
    const bottomVal = 800
    const leftVal = Math.random() * 500 - 100
    let item = new Platform(bottomVal, leftVal + 100)
    platforms.push(item)
}

function jump() {
    jumpSound.play()
    canJump = false
    isJumping = true
    isLanded = false
    const jumpStartPoint = jumper.bottom
    jumpInterval = setInterval(function() {
        let jb = jumper.bottom

        if (jb >= jumpStartPoint + 275) {
            isJumping = false
            clearInterval(jumpInterval)
        }

        if (jb <= jumpStartPoint + 150) jumper.bottom += 15
        else if (jb <= jumpStartPoint + 180) jumper.bottom += 12
        else if (jb <= jumpStartPoint + 210) jumper.bottom += 9
        else if (jb <= jumpStartPoint + 280) jumper.bottom += 6

        jumper.htmlElem.style.bottom = `${jumper.bottom}px`
    }, 10)
}

function fall() {
    jumper.bottom -= 10
    jumper.htmlElem.style.bottom = `${jumper.bottom}px`
}

function stabilize() {
    jumper.bottom -= 3
    jumper.htmlElem.style.bottom = `${jumper.bottom}px`
}

function goLeft() {
    leftInterval = setInterval(function() {
        jumper.left -= 5
        jumper.htmlElem.style.left = `${jumper.left}px`
    }, 10)

}

function goRight() {
    rightInterval = setInterval(function() {
        jumper.left += 5
        jumper.htmlElem.style.left = `${jumper.left}px`
    }, 10)

}

function checkIsLanded() {
    for (let i of platforms) {
        if (((jumper.bottom >= i.bottom) && (jumper.bottom <= i.bottom + 20)) && (jumper.left + 80 >= i.left) && (jumper.left <= i.left + 95)) {
            isLanded = true
            canJump = true
            break
        } else {
            isLanded = false
        }
    }
}


function checkRestart() {
    if (jumper.bottom <= 10) {
        loseSound.play()
        setTimeout(() => {
            location.reload()
        }, 1000)
    } else if (jumper.left <= 10) {
        loseSound.play()
        setTimeout(() => {
            location.reload()
        }, 1000)
    } else if (jumper.left >= 510) {
        loseSound.play()
        setTimeout(() => {
            location.reload()
        }, 1000)
    }
}

function runGame() {
    let levelCounter = 100
    mainInterval = setInterval(function() {
        checkRestart()
        movePlatforms()

        // zıplama esnasında land kontrolünü kapatmazsan
        // zıplamanın tepe noktasına koyuyor jumperi
        if (!isJumping) checkIsLanded()

        // eğer platforma yerleşmişse, jumper iniş hızı
        // platformunkiyle sabitleniyor
        if (isLanded) stabilize()

        else if (!isLanded && !isJumping) fall()
        levelCounter -= 1
        console.log(levelCounter);
    }, 20)
}


// event listeners
document.addEventListener('keyup', function(e) {
    switch (e.key) {
        case ' ':
            startGame_div.classList.add('start-game-hidden')
            runGame()
            break

        case 'ArrowUp':
            if (!isJumping && canJump) jump()
            break

        case 'ArrowLeft':
            clearInterval(leftInterval)
            leftInterval = null
            break;

        case 'ArrowRight':
            clearInterval(rightInterval)
            rightInterval = null
            break;

        default:
            break;
    }
})

document.addEventListener('keydown', function(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (!leftInterval) goLeft()
            break;

        case 'ArrowRight':
            if (!rightInterval) goRight()
            break

        default:
            break;
    }
})