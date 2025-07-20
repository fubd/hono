import { Server, Socket } from 'socket.io'
import { injectable } from 'inversify'
import type { ServerType } from '@hono/node-server'

export interface ISocketIOWebSocketService {
  broadcast(event: string, data: unknown): void
  emitTo(socketId: string, event: string, data: unknown): void
  getSocketIds(): string[]
  attachToHttpServer: (server: ServerType) => void;
}

@injectable()
export class SocketIOWebSocketService implements ISocketIOWebSocketService {
  private io: Server
  private sockets = new Map<string, Socket>()

  constructor() {
    this.io = new Server({
      cors: {
        origin: '*',
      },
    })

    this.io.on('connection', (socket) => {
      this.sockets.set(socket.id, socket)
      console.log(`🔌 Socket connected: ${socket.id}`)

      socket.on('disconnect', () => {
        this.sockets.delete(socket.id)
        console.log(`❌ Socket disconnected: ${socket.id}`)
      })
    })
  }

  attachToHttpServer(server: any) {
    this.io.attach(server)
  }

  broadcast(event: string, data: unknown) {
    this.io.emit(event, data)
  }

  emitTo(socketId: string, event: string, data: unknown) {
    const socket = this.sockets.get(socketId)
    if (socket) {
      socket.emit(event, data)
    }
  }

  getSocketIds(): string[] {
    return [...this.sockets.keys()]
  }
}
