import {
  chmodSync,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readSync,
  renameSync,
  rmSync,
  statSync,
  writeSync,
} from 'node:fs'
import path from 'node:path'
import { Writable } from 'node:stream'

export const DEFAULT_LOG_MAX_BYTES = 25 * 1024 * 1024

export function resolveLogMaxBytes(value, fallback = DEFAULT_LOG_MAX_BYTES) {
  if (value === undefined || value === '') return fallback
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`Log max bytes must be a positive integer, received: ${value}`)
  }
  return parsed
}

export function createRotatingLogStream({
  filePath,
  previousPath,
  maxBytes = DEFAULT_LOG_MAX_BYTES,
  rotateOnStart = true,
}) {
  return new RotatingLogStream({ filePath, previousPath, maxBytes, rotateOnStart })
}

class RotatingLogStream extends Writable {
  constructor({ filePath, previousPath, maxBytes, rotateOnStart }) {
    super()
    if (!filePath || !previousPath) throw new Error('Rotating logs require current and previous paths.')
    if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new Error('Log max bytes must be a positive integer.')

    this.filePath = filePath
    this.previousPath = previousPath
    this.maxBytes = maxBytes
    this.fd = undefined
    this.size = 0

    mkdirSync(path.dirname(filePath), { recursive: true })
    if (rotateOnStart && existsSync(filePath)) preserveTail(filePath, previousPath, maxBytes)
    this.fd = openSync(filePath, 'w', 0o600)
    chmodSync(filePath, 0o600)
  }

  _write(chunk, encoding, callback) {
    try {
      let buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
      if (buffer.length >= this.maxBytes) {
        if (this.size > 0) this.rotate()
        buffer = buffer.subarray(buffer.length - this.maxBytes)
      } else if (this.size + buffer.length > this.maxBytes) {
        this.rotate()
      }
      writeAll(this.fd, buffer)
      this.size += buffer.length
      callback()
    } catch (error) {
      callback(error)
    }
  }

  _final(callback) {
    try {
      this.close()
      callback()
    } catch (error) {
      callback(error)
    }
  }

  _destroy(error, callback) {
    try {
      this.close()
      callback(error)
    } catch (closeError) {
      callback(closeError)
    }
  }

  rotate() {
    this.close()
    preserveTail(this.filePath, this.previousPath, this.maxBytes)
    this.fd = openSync(this.filePath, 'w', 0o600)
    chmodSync(this.filePath, 0o600)
    this.size = 0
  }

  close() {
    if (this.fd === undefined) return
    closeSync(this.fd)
    this.fd = undefined
  }
}

function preserveTail(filePath, previousPath, maxBytes) {
  rmSync(previousPath, { force: true })
  const size = statSync(filePath).size
  if (size <= maxBytes) {
    renameSync(filePath, previousPath)
    chmodSync(previousPath, 0o600)
    return
  }

  const source = openSync(filePath, 'r')
  const target = openSync(previousPath, 'w', 0o600)
  try {
    const buffer = Buffer.allocUnsafe(maxBytes)
    let offset = 0
    while (offset < maxBytes) {
      const bytesRead = readSync(source, buffer, offset, maxBytes - offset, size - maxBytes + offset)
      if (bytesRead === 0) break
      offset += bytesRead
    }
    writeAll(target, buffer.subarray(0, offset))
  } finally {
    closeSync(source)
    closeSync(target)
    rmSync(filePath, { force: true })
  }
}

function writeAll(fd, buffer) {
  let offset = 0
  while (offset < buffer.length) {
    const bytesWritten = writeSync(fd, buffer, offset, buffer.length - offset)
    if (bytesWritten === 0) throw new Error('Unable to make progress while writing log file.')
    offset += bytesWritten
  }
}
