cheerio =    require 'cheerio'
isStream =   require 'is-stream'
sink =       require 'stream-sink'

hieroglyph = require './index.js'
{rect} =     hieroglyph





tabSize = '    '

module.exports =

	rect:

		'return a correct SVG `rect`': (test) ->
			el = cheerio.load(rect 4, 240, 67) 'rect'
			test.strictEqual el.attr('x'),     '4'
			test.strictEqual el.attr('y'),     '240'
			test.strictEqual el.attr('width'), '67'
			test.done()

	hieroglyph:

		'returns a duplex steam': (test) ->
			test.ok isStream.duplex hieroglyph()
			test.done()

		'test with empty line': (test) ->
			h = hieroglyph()
			s = h.pipe sink()

			s.on 'data', (d) ->
				# todo: use lodash.isMatch
				els = cheerio.load(d.toString())('svg rect').toArray()
				test.strictEqual els.length,           2
				test.strictEqual els[0].attribs.x,     '0'
				test.strictEqual els[0].attribs.y,     '0'
				test.strictEqual els[0].attribs.width, '3'
				test.strictEqual els[1].attribs.x,     '2'
				test.strictEqual els[1].attribs.y,     '20'
				test.strictEqual els[1].attribs.width, '7'
				test.done()
			h.end 'foo\n\n  bar baz'

		'test with different indentations': (test) ->
			h = hieroglyph tabSize: 4
			s = h.pipe sink()

			s.on 'data', (d) ->
				# todo: use lodash.isMatch
				els = cheerio.load(d.toString())('svg rect').toArray()
				test.strictEqual els.length,           2
				test.strictEqual els[0].attribs.x,     '2'
				test.strictEqual els[0].attribs.y,     '0'
				test.strictEqual els[0].attribs.width, '3'
				test.strictEqual els[1].attribs.x,     '6'
				test.strictEqual els[1].attribs.y,     '10'
				test.strictEqual els[1].attribs.width, '4'
				test.done()
			h.end '  bar\n  \tquux'