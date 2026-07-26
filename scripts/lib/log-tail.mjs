import { closeSync, existsSync, openSync, readSync, statSync } from 'node:fs'

export const DEFAULT_TAIL_MAX_BYTES = 2 * 1024 * 1024

export function readTailLines(filePath, { lines = 200, maxBytes = DEFAULT_TAIL_MAX_BYTES } = {}) {
  if (!Number.isSafeInteger(lines) || lines < 1) throw new Error('Tail line count must be a positive integer.')
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new Error('Tail max bytes must be a positive integer.')

  const size = statSync(filePath).size
  const length = Math.min(size, maxBytes)
  const start = size - length
  const buffer = readRange(filePath, start, length)
  let text = buffer.toString('utf8')
  if (start > 0) {
    const firstNewline = text.indexOf('\n')
    if (firstNewline !== -1) text = text.slice(firstNewline + 1)
  }

  const values = text.split(/\r?\n/)
  if (values.at(-1) === '') values.pop()
  const content = values.slice(-lines).join('\n')
  return start > 0 ? `[log tail limited to ${maxBytes} bytes]\n${content}` : content
}

export function followLogFile(filePath, {
  intervalMs = 500,
  maxReadBytes = 1024 * 1024,
  onData = (text) => process.stdout.write(text),
  onError = (error) => process.stderr.write(`${error.message}\n`),
} = {}) {
  let identity
  let offset = 0

  if (existsSync(filePath)) {
    const initial = statSync(filePath)
    identity = fileIdentity(initial)
    offset = initial.size
  }

  const timer = setInterval(() => {
    try {
      if (!existsSync(filePath)) return
      const current = statSync(filePath)
      const nextIdentity = fileIdentity(current)
      if (identity !== nextIdentity || current.size < offset) {
        identity = nextIdentity
        offset = 0
      }
      if (current.size === offset) return

      const unread = current.size - offset
      const start = unread > maxReadBytes ? current.size - maxReadBytes : offset
      const prefix = start > offset ? `[log follow skipped ${start - offset} bytes]\n` : ''
      const text = readRange(filePath, start, current.size - start).toString('utf8')
      offset = current.size
      onData(`${prefix}${text}`)
    } catch (error) {
      if (error.code !== 'ENOENT') onError(error)
    }
  }, intervalMs)

  return () => clearInterval(timer)
}

function readRange(filePath, start, length) {
  const buffer = Buffer.allocUnsafe(length)
  const fd = openSync(filePath, 'r')
  try {
    let offset = 0
    while (offset < length) {
      const bytesRead = readSync(fd, buffer, offset, length - offset, start + offset)
      if (bytesRead === 0) break
      offset += bytesRead
    }
    return buffer.subarray(0, offset)
  } finally {
    closeSync(fd)
  }
}

function fileIdentity(stats) {
  return `${stats.dev}:${stats.ino}`
}
