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
            key.addEventListener('click', (e) => {
                if (
                    !(keyId === 'Enter') &&
                    !(keyId === 'Tab') &&
                    !(keyId === 'Backspace') &&
                    !(keyId === 'Delete') &&
                    !(keyId === 'ShiftLeft') &&
                    !(keyId === 'ShiftRight') &&
                    !(keyId === 'AltLeft') &&
                    !(keyId === 'AltRight') &&
                    !(keyId === 'ControlLeft') &&
                    !(keyId === 'ControlRight') &&
                    !(keyId === 'MetaLeft') &&
                    !(keyId === 'CapsLock') &&
                    !(keyId === 'Space')
                ) {
                    let value = e.target.textContent
                    this.caretPosition(value)
                } else if (keyId === 'Tab') {
                    let tabText = '    '
                    this.caretPosition(tabText)
                } else if (keyId === 'Space') {
                    let spaceText = ' '
                    this.caretPosition(spaceText)
                } else if (keyId === 'Enter') {
                    let enterText = '\n'
                    this.caretPosition(enterText)
                } else if (keyId === 'Backspace') {
                    let caretPosition = +textarea.selectionStart
                    let caretPositionEnd = +textarea.selectionEnd
                    if (
                        caretPosition !== caretPositionEnd ||
                        caretPosition === 0
                    ) {
                        this.caretMove(0, 0)
                    } else {
                        this.caretMove(1, 0)
                    }
                } else if (keyId === 'Delete') {
                    let caretPosition = +textarea.selectionStart
                    let caretPositionEnd = +textarea.selectionEnd
                    if (caretPosition !== caretPositionEnd) {
                        this.caretMove(0, 0)
                    } else if (caretPosition === 0) {
                        this.caretMove(0, 1)
                    } else {
                        this.caretMove(0, 1)
                    }
                } else if (keyId === 'CapsLock') {
                    e.target.classList.toggle('active')
                    let keysArr = [...e.target.parentElement.children]
                    keysArr.forEach((e) => {
                        let keySpan = e.children[0].innerText.length
                        if (keySpan === 1) {
                            if (!e.classList.contains('uppercase')) {
                                e.classList.add('uppercase')
                                e.children[0].innerText =
                                    e.children[0].innerText.toUpperCase()
                            } else {
                                e.classList.remove('uppercase')
                                e.children[0].innerText =
                                    e.children[0].innerText.toLowerCase()
                            }
                        }
                    })
                }
            })
            this.wrapper.appendChild(key)
        }
        this.keyboardClick()
        this.keyShiftHandler('ShiftLeft');
        this.keyShiftHandler('ShiftRight');
        this.switchLang();
        this.switchLangVirtual('ControlLeft', 'AltLeft')
        this.switchLangVirtual('AltLeft', 'ControlLeft')
    }
    keyboardClick() {
        document.addEventListener('keydown', (e) => {
            let currentCode = e.code
            let keys = document.querySelectorAll('[data-id]')
            keys.forEach((elem) => {
                let currentId = elem.getAttribute('data-id')
                if (currentCode === currentId) {
                    if (
                        currentCode !== 'Backspace' &&
                        currentCode !== 'Enter' &&
                        currentCode !== 'Delete' &&
                        currentCode !== 'ShiftLeft' &&
                        currentCode !== 'ShiftRight' &&
                        currentCode !== 'AltLeft' &&
                        currentCode !== 'AltRight' &&
                        currentCode !== 'ControlLeft' &&
                        currentCode !== 'ControlRight' &&
                        currentCode !== 'CapsLock' &&
                        currentCode !== 'MetaLeft' &&
                        currentCode !== 'Space'
                    ) {
                        e.preventDefault()
                        elem.classList.add('active')
                        elem.click()
                    } else if (currentCode === 'CapsLock') {
                        e.preventDefault()
                        elem.click()
                    } else if (
                        currentCode === 'ShiftLeft' ||
                        currentCode === 'ShiftRight'
                    ) {
                        e.preventDefault()
                        elem.classList.add('active')
                        this.keyShiftLogic('uppercase')
                    } else {
                        elem.classList.add('active')
                        textarea.focus()
                    }
                }
            })
        })
        document.addEventListener('keyup', (e) => {
            e.preventDefault()
            let currentCode = e.code
            let keys = document.querySelectorAll('[data-id]')

            keys.forEach((elem) => {
                let currentId = elem.getAttribute('data-id')
                if (currentCode === currentId && currentId !== 'CapsLock') {
                    elem.classList.remove('active')
                }
                if (
                    currentCode === 'ShiftLeft' ||
                    currentCode === 'ShiftRight'
                ) {
                    this.keyShiftLogic('lowercase')
                }
            })
        })
    }
    keyShiftHandler(shifKey) {
        let keyShift = document.querySelector(`[data-id="${shifKey}"]`)
        keyShift.addEventListener('mousedown', () => {
            this.keyShiftLogic('uppercase')
            keyShift.classList.add('active')
            document.addEventListener('mouseup', (e) => {
                if (e.target === keyShift) {
                    this.keyShiftLogic('lowercase')
                    keyShift.classList.remove('active')
                }
            })
        })
    }
    keyShiftLogic(status) {
        this.setLang()
        let keysArr = [...keyboardWrapper.children]
        keysArr.forEach((elem) => {
            let keyId = elem.getAttribute('data-id')
            for (let i = 0; i < layouts.length; i++) {
                if (keyId === layouts[i].key) {
                    elem.children[0].innerText = layouts[i][this.lang][status]
                }
            }
        })
    }
    switchLang() {
        let controlLeft = document.querySelector('[data-id="ControlLeft"]')
        let altLeft = document.querySelector('[data-id="AltLeft"]')
        document.addEventListener('keydown', () => {
            if (
                controlLeft.classList.contains('active') &&
                altLeft.classList.contains('active')
            ) {
                this.localStorageLang()
            }
        })
    }
    switchLangVirtual(firstKey, lastKey) {
        firstKey = document.querySelector(`[data-id="${firstKey}"]`);
        lastKey = document.querySelector(`[data-id="${lastKey}"]`);
        firstKey.addEventListener('mousedown', () => {
            firstKey.classList.add('active');
        })
        document.addEventListener('mouseup', (e) => {
            if(e.target === lastKey && firstKey.classList.contains('active')) {
                firstKey.classList.remove('active');
                this.localStorageLang();
            } else {
                firstKey.classList.remove('active');
            }
        })
    }

    localStorageLang() {
        this.setLang()
        if (this.lang === 'ru') {
            localStorage.setItem('lang', 'en')
            this.lang = localStorage.getItem('lang')
            this.wrapper.setAttribute('data-lang', this.lang)
            this.keyShiftLogic('lowercase')
        } else {
            localStorage.setItem('lang', 'ru')
            this.lang = localStorage.getItem('lang')
            this.wrapper.setAttribute('data-lang', this.lang)
            this.keyShiftLogic('lowercase')
        }
    }
    setLang() {
        if (!this.lang) {
            localStorage.setItem('lang', 'ru')
            this.lang = localStorage.getItem('lang')
            this.wrapper.setAttribute('data-lang', this.lang)
        } else {
            this.wrapper.setAttribute('data-lang', this.lang)
        }
        this.lang = localStorage.getItem('lang')
    }
    caretPosition(elem) {
        let caretPosition = textarea.selectionStart
        let caretPositionEnd = textarea.selectionEnd
        textarea.value =
            textarea.value.slice(0, caretPosition) +
            elem +
            textarea.value.slice(caretPositionEnd, textarea.value.length)
        textarea.selectionStart = caretPosition + elem.length
        textarea.selectionEnd = caretPosition + elem.length
        textarea.focus()
    }
    caretMove(count, number) {
        let caretPosition = +textarea.selectionStart
        let caretPositionEnd = +textarea.selectionEnd
        textarea.value =
            textarea.value.slice(0, caretPosition - count) +
            textarea.value.slice(
                caretPositionEnd + number,
                textarea.value.length,
            )
        textarea.selectionStart = caretPosition - count
        textarea.selectionEnd = caretPosition - count
        textarea.focus()
    }
}
let keys = new Keys()
keys.keysRender()
