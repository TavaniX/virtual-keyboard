import '../styles/normalize.css'
import '../styles/main.css'
import layouts from './layouts'
import gitlogo from './logo'

const container = document.createElement('div')
const heading = document.createElement('h1')
const textarea = document.createElement('textarea')
const keyboardWrapper = document.createElement('div')
const key = document.createElement('div')
const desc = document.createElement('p')
const desc2 = document.createElement('p')
const author = document.createElement('p')

heading.textContent = 'Virtual Keyboard'
container.className = 'container'
textarea.className = 'textarea'
keyboardWrapper.className = 'keyboard_wrapper'
desc.className = 'pOs'
author.className = 'author'

key.className = 'key'

textarea.placeholder = 'Please use keyboard to input data...'
desc.textContent = 'OS Windows'
desc2.textContent = 'Switch language: (Left) Ctrl + Alt'
author.textContent = 'by Maksim Aisin'

document.body.append(container)
container.append(heading)
container.append(desc)
container.append(textarea)
container.append(keyboardWrapper)
container.append(desc2)
container.append(gitlogo)
container.append(author)

class Keys {
    constructor() {
        this.layouts = layouts
        this.wrapper = keyboardWrapper
        this.lang = localStorage.getItem('lang')
    }
    keysRender() {
        this.setLang()
        for (let i = 0; i < this.layouts.length; i++) {
            let keyId = this.layouts[i].key
            let keyRu = this.layouts[i].ru.lowercase
            let keyEn = this.layouts[i].en.lowercase
            let key = document.createElement('div')
            let keyInner = document.createElement('span')
            key.appendChild(keyInner)
            key.classList.add('key')
            key.setAttribute('data-id', `${keyId}`)
            if (this.lang === 'ru') {
                keyInner.textContent = `${keyRu}`
            } else {
                keyInner.textContent = `${keyEn}`
            }
        }
    }
}

let keys = new Keys()
keys.keysRender()
