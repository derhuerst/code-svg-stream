'use strict'

const connect =    require('stream-connect')
const lineLength = require('line-length-stream')
const through =    require('through2')
const wrap =       require('wrap-stream')



const head = '<svg xmlns="http://www.w3.org/2000/svg">\n<style>rect{fill:#333}</style>\n'
const tail = '</svg>\n'

const rect = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="5" />\n`

const codeSVGStream = function (options) {
	options = options || {}
	let lineNr = -1

	return connect( // todo: seems to be unelegant
		lineLength(options),
		through.obj(function (line, _, cb) {
			lineNr++
			if (line[1] === 0) cb(null, '')
			else cb(null, rect(line[0], lineNr * 10, line[1]))
		}),
		wrap(head, tail)
	)
}



Object.assign(codeSVGStream, {head: head, tail: tail, rect: rect})
module.exports = codeSVGStream
