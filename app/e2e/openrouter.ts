// OpenRouter 假端點（TASK-15 e2e）：攔下所有送往 openrouter.ai 的請求（含授權頁），一個都不會真的出去。
// 另記錄頁面的每一個請求，供「金鑰只送往 openrouter.ai」檢查（AC#1 網路面板）
import { createHash } from 'node:crypto'
import type { Page, Request } from '@playwright/test'

export const FAKE_KEY = 'sk-or-v1-e2efake0123456789abcdef0123456789abcdef'
export const OAUTH_CODE = 'e2e-auth-code'

export type GradeReply = { status?: number; body: unknown }

const text = { input_modalities: ['text'], output_modalities: ['text'] }
export const MODELS = [
  {
    id: 'qwen/qwen3.8-27b:free',
    name: 'Qwen: Qwen3.8 27B (free)',
    pricing: { prompt: '0', completion: '0' },
    architecture: text,
  },
  {
    id: 'apodex/apodex-1.1-mini:free',
    name: 'Apodex: Apodex 1.1 Mini (free)',
    pricing: { prompt: '0', completion: '0' },
    architecture: text,
  },
  {
    id: 'anthropic/claude-sonnet-x',
    name: 'Anthropic: Claude Sonnet X',
    pricing: { prompt: '0.000003', completion: '0.000015' },
    architecture: text,
  },
  // 走查 P0：極長、不含空白的付費模型 id（設定列顯示 id、不可撐破版面）
  {
    id: 'experimental-research-lab/extremely-long-model-identifier-without-any-spaces-2026-preview-instruct',
    name: 'Experimental Research Lab: Extremely Long Model Identifier Preview Instruct',
    pricing: { prompt: '0.000001', completion: '0.000002' },
    architecture: text,
  },
]

export const gradeOk = (result: unknown): GradeReply => ({
  body: {
    model: 'qwen/qwen3.8-27b:free',
    choices: [{ message: { content: JSON.stringify(result) }, finish_reason: 'stop' }],
  },
})

const base64url = (b: Buffer) =>
  b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export interface FakeOpenRouter {
  /** 頁面送出的全部請求（任何網域） */
  requests: { url: string; headers: Record<string, string>; body: string }[]
  /** 授權頁收到的 code_challenge；換金鑰時驗證 verifier 與它相符 */
  challenge: string | null
  exchangedVerifierMatches: boolean | null
  /** 依序回給批改請求的回應（用完重複最後一個） */
  grades: GradeReply[]
}

export async function fakeOpenRouter(page: Page): Promise<FakeOpenRouter> {
  const fake: FakeOpenRouter = {
    requests: [],
    challenge: null,
    exchangedVerifierMatches: null,
    grades: [],
  }
  page.on('request', (r: Request) => {
    fake.requests.push({ url: r.url(), headers: r.headers(), body: r.postData() ?? '' })
  })
  let graded = 0
  await page.route(/^https:\/\/openrouter\.ai\//, async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    // 授權頁：模擬使用者在 OpenRouter 按下同意，帶 code 回到 callback_url
    if (url.pathname === '/auth') {
      fake.challenge = url.searchParams.get('code_challenge')
      const back = `${url.searchParams.get('callback_url')}?code=${OAUTH_CODE}`
      return route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><title>OpenRouter</title><script>location.replace(${JSON.stringify(back)})</script>`,
      })
    }
    if (url.pathname === '/api/v1/auth/keys') {
      const body = JSON.parse(req.postData() ?? '{}') as { code?: string; code_verifier?: string }
      const challenge = base64url(
        createHash('sha256')
          .update(body.code_verifier ?? '')
          .digest(),
      )
      fake.exchangedVerifierMatches = challenge === fake.challenge
      if (body.code !== OAUTH_CODE || !fake.exchangedVerifierMatches)
        return route.fulfill({ status: 403, json: { error: { code: 403, message: 'bad code' } } })
      return route.fulfill({ json: { key: FAKE_KEY } })
    }
    if (url.pathname === '/api/v1/key') {
      const ok = req.headers()['authorization'] === `Bearer ${FAKE_KEY}`
      return ok
        ? route.fulfill({
            json: { data: { free_model_daily_requests: { used: 13, limit: 50, remaining: 37 } } },
          })
        : route.fulfill({ status: 401, json: { error: { code: 401, message: 'No auth' } } })
    }
    if (url.pathname === '/api/v1/models') return route.fulfill({ json: { data: MODELS } })
    if (url.pathname === '/api/v1/chat/completions') {
      const reply = fake.grades[Math.min(graded++, fake.grades.length - 1)] ?? {
        status: 500,
        body: {},
      }
      return route.fulfill({ status: reply.status ?? 200, json: reply.body })
    }
    return route.fulfill({ status: 404, body: '' })
  })
  return fake
}

/** 帶有金鑰字串（網址、標頭或內容任一處）的請求網址 */
export function requestsCarryingKey(fake: FakeOpenRouter): string[] {
  return fake.requests
    .filter(
      (r) =>
        r.url.includes(FAKE_KEY) ||
        r.body.includes(FAKE_KEY) ||
        Object.values(r.headers).some((v) => v.includes(FAKE_KEY)),
    )
    .map((r) => r.url)
}
