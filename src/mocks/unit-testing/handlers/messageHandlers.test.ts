import { createTestServer, testUrl } from "../helpers/mswServer"
import { messageHandlers } from "@/mocks/handlers/messageHandlers"

const server = createTestServer(...messageHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("messageHandlers", () => {
  it("GET chats", async () => {
    const res = await fetch(testUrl("/api/messages/v1/chats"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.length).toBeGreaterThan(0)
  })

  it("GET messages for chat", async () => {
    const res = await fetch(testUrl("/api/messages/v1/chat/message/chat-001"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.messages).toBeDefined()
  })

  it("PATCH read accepts body.id (message.service shape)", async () => {
    const res = await fetch(testUrl("/api/messages/v1/chat/read/"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "chat-001" }),
    })
    expect(res.status).toBe(200)
  })

  it("PATCH unread accepts body.id", async () => {
    const res = await fetch(testUrl("/api/messages/v1/chat/unread/"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "chat-002" }),
    })
    expect(res.status).toBe(200)
  })

  it("PATCH archive accepts chatId", async () => {
    const res = await fetch(testUrl("/api/messages/v1/archive"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: "chat-002" }),
    })
    expect(res.status).toBe(200)
  })

  it("POST send message", async () => {
    const res = await fetch(testUrl("/api/messages/v1/send"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: "user-456", content: "hi" }),
    })
    expect(res.status).toBe(201)
  })
})
