'use strict'

const test = require('tape')
const cheerio = require('cheerio')
const isStream = require('is-stream')
const sink = require('stream-sink')

const codeSVGStream = require('.')
const {rect} = codeSVGStream
const tabSize = '    '

test('rect returns a correct SVG `rect`', (t) => {
	t.plan(3)
	const el = cheerio.load(rect(4, 240, 67))('rect')

	t.strictEqual(el.attr('x'), '4')
	t.strictEqual(el.attr('y'), '240')
	t.strictEqual(el.attr('width'), '67')
})

test('rect prevents too small `rect`s', (t) => {
	t.plan(1)
	const el = cheerio.load(rect(0, 0, 1))('rect')

	t.strictEqual(el.attr('width'), '2') // instead of 1
})

test('codeSVGStream returns a duplex steam', (t) => {
	t.plan(1)
	t.ok(isStream.duplex(codeSVGStream()))
})

test('codeSVGStream test with empty line', (t) => {
	t.plan(7)
	const h = codeSVGStream()
	const s = h.pipe(sink('object'))

	s
	.then((d) => {
		const els = Array.from(cheerio.load(d.toString())('rect'))
		t.strictEqual(els.length, 2)
		t.strictEqual(els[0].attribs.x, '0')
		t.strictEqual(els[0].attribs.y, '0')
		t.strictEqual(els[0].attribs.width, '3')
		t.strictEqual(els[1].attribs.x, '2')
		t.strictEqual(els[1].attribs.y, '20')
		t.strictEqual(els[1].attribs.width, '7')
	})
	.catch(t.ifError)
	h.end('foo\n\n  bar baz')
})

test('codeSVGStream works with different indentations', (t) => {
	t.plan(7)
	const h = codeSVGStream({tabSize: 4})
	const s = h.pipe(sink('object'))

	s.then((d) => {
		const els = Array.from(cheerio.load(d.toString())('rect'))
		t.strictEqual(els.length, 2)
		t.strictEqual(els[0].attribs.x, '2')
		t.strictEqual(els[0].attribs.y, '0')
		t.strictEqual(els[0].attribs.width, '3')
		t.strictEqual(els[1].attribs.x, '6')
		t.strictEqual(els[1].attribs.y, '10')
		t.strictEqual(els[1].attribs.width, '4')
	})
	.catch(t.ifError)
	h.end('  bar\n  \tquux')
})
