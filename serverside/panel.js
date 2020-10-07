const n = 16
const size = 1024
const pp = 2

const defaultCode = function(pixels, t) {
	const r = (Math.sin(t / 1000) + 1) * 4
	for (let a = 0; a < 2 * Math.PI; a += 0.1) {
		const x = Math.floor(8 + Math.cos(a) * r)
		const y = Math.floor(8 + Math.sin(a) * r)
		pixels[0][y * 16 + x] = 1
		pixels[1][y * 16 + x] = 1
	}
}

function parseCode(func) {
	return func
		.toString()
		.split('\n')
		.slice(1, -1)
		.map((line) => line.slice(1))
		.join('\n')
}

function setup() {
	let matrix
	let timeInterval
	let t
		
	function generateCanvas(p) {
		const par = document.getElementById('panel-daddy')
		const contexts = [] 
		for (let i = 0; i < p; i++) {
			const c = document.createElement('canvas')
			c.setAttribute('id', `panel${i}`)
			c.setAttribute('class', 'matrix')
			c.setAttribute('width', '1024')
			c.setAttribute('height', '1024')
			par.appendChild(c)
			contexts.push(c.getContext('2d'))
		}
		return contexts
	}

	function applyScript(script) {
		try {
			matrix = {
				render: new Function([ 'pixels', 't', 'state' ], script),
				state: {}
			}
			t = 0
			return true
		} catch (error) {
			errorBox.style.color = 'red'
			errorBox.innerHTML = `Syntax error: ${error.message}`
		}
	}

	function draw(t) {
		requestAnimationFrame(draw)
		
		for (let p = 0; p < pp; p++) pixels[p].fill(0)
			
		if (matrix) {
			try {
				matrix.render(pixels, t, matrix.state)
			} catch (error) {
				matrix = null
				errorBox.style.color = 'red'
				errorBox.innerHTML = `Runtime error: ${error.message}`
			}
		}

		// leds
		const w = size / (n + 1)			
				
		for (let p = 0; p < pp; p++) {
			for (let row = 0; row < n; row++) {
				for (let col = 0; col < n; col++) {
					const x = (col + 1) * w
					const y = (row + 1) * w
							
					// stroke
					c[p].lineWidth = 5
					c[p].strokeStyle = 'hsl(0, 0%, 20%)'
					c[p].beginPath()
					c[p].ellipse(x, y, 0.8 * w / 2, 0.8 * w / 2, 0, 0, 2 * Math.PI)
					c[p].stroke()
				
					// fill						
					c[p].fillStyle = `hsl(0, 0%, ${(pixels[p][row * n + col] * 0.60 + 0.20) * 100}%` 
					c[p].beginPath()
					c[p].ellipse(x, y, 0.8 * w / 2, 0.8 * w / 2, 0, 0, 2 * Math.PI)
					c[p].fill()
				}
			}
		}
		
		t++
	}

	//let jar = CodeJar(document.querySelector('.editor'), Prism.highlightElement)
		
	const codeBox = document.getElementById('code')
	const errorBox = document.getElementById('error-output')
	const placeholderScript = parseCode(defaultCode)
	
	codeBox.innerHTML = placeholderScript
	applyScript(placeholderScript)

	errorBox.style.color = 'lightgreen'
	errorBox.innerHTML = 'Placeholder script running'

	// restart drawing on textupdate
	codeBox.addEventListener('change', () => {
		const code = codeBox.value
		errorBox.style.color = 'lightgreen'
		errorBox.innerHTML = 'Compiled and running'
		applyScript(code)
	})

	// enable tabbing
	codeBox.addEventListener('keydown', (event) => {
		let { keyCode } = event;
		let { value, selectionStart, selectionEnd } = codeBox
		
		if (keyCode === 9) {
			event.preventDefault()
			codeBox.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd)
			codeBox.setSelectionRange(selectionStart + 1, selectionStart + 1)
		}
	})
	
	const c = generateCanvas(pp)
	const pixels = []
	for (let p = 0; p < pp; p++) pixels.push(new Uint8Array(n * n))
		
	requestAnimationFrame(draw)
}
