'use strict'

const connect =    require('stream-connect')
const lineLength = require('line-length-stream')
const through =    require('through2')



const rect = (x, y, w) => `
<rect class="code" x="${x}" y="${y}" width="${w}" height="5" />`

const codeSVGStream = function (options) {
	options = options || {}
	let lineNr = -1

	return connect( // todo: seems to be unelegant
		lineLength(options),
		through.obj(function (line, _, cb) {
			lineNr++
			if (line[1] === 0) cb(null, '')
			else cb(null, rect(line[0], lineNr * 10, line[1]))
		})
	)
}



Object.assign(codeSVGStream, {rect: rect})
module.exports = codeSVGStream
