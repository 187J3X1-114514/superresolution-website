import { spawn } from 'node:child_process'

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

const children = [
  spawn(pnpmCommand, ['run', 'dev:app'], { stdio: 'inherit' }),
  spawn(pnpmCommand, ['run', 'docs:dev'], { stdio: 'inherit' }),
]

let shuttingDown = false

function stopChildren(signal = 'SIGTERM') {
  if (shuttingDown) {
    return
  }

  shuttingDown = true

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal)
    }
  }
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    stopChildren(signal)
    process.exit(0)
  })
}

for (const child of children) {
  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return
    }

    stopChildren(signal ?? 'SIGTERM')

    if (signal) {
      process.kill(process.pid, signal)
      return
    }

    process.exit(code ?? 1)
  })
}