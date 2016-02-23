#!/usr/bin/env node
'use strict'

const codeSVGStream = require('./index')

process.stdin
.pipe(codeSVGStream({tabSize: 4}))
.pipe(process.stdout)
