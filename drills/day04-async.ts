// Day 4 drills — async/await, fetch, error handling, generics and classes.
// The tests start a private copy of the sandbox on port 4021, so these functions talk to a real API.

export interface ApiResult<T> {
  status: number;
  body: T;
}

/** POST {baseUrl}/api/auth/login and return the token. On any status other than 200, throw an Error whose message contains the status code (e.g. "Login failed: 401"). */
export async function login(baseUrl: string, username: string, password: string): Promise<string> {
  // TODO (use fetch with method 'POST', a JSON body and the Content-Type header; then await res.json())
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (res.status !== 200) {
    throw new Error(`Login failed: ${res.status}`);
  }
  const data = await res.json();
  return data.token;
}

/** GET {baseUrl}{path} with an Authorization: Bearer header. Return the status and the parsed JSON body. Never throw on 4xx/5xx: return them. */
export async function getJson<T>(baseUrl: string, path: string, token: string): Promise<ApiResult<T>> {
  // TODO
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const body = await res.json();
  return { status: res.status, body };
}

/** A tiny API client. This is the same idea as a Page Object, but for an API. */
export class TallyPayClient {
  baseUrl: string;
  private token: string | undefined;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = undefined;
  }

  /** Log in and remember the token. */
  async login(username: string, password: string): Promise<void> {
    // TODO (reuse the login function above)
    this.token = await login(this.baseUrl, username, password);
  }

  /** GET /api/overtime-claims, optionally filtered by status (?status=...). Throw an Error containing "Not logged in" if login() was not called. */
  async claims(status?: string): Promise<ApiResult<Array<{ id: string; status: string }>>> {
    if (!this.token) {
      throw new Error('Not logged in');
    }

    const path = status
      ? `/api/overtime-claims?status=${encodeURIComponent(status)}`
      : '/api/overtime-claims';
    return getJson(this.baseUrl, path, this.token);
  }

  /** POST /api/overtime-claims with the given body. Return status and body (do not throw on 4xx/5xx). */
  async createClaim(input: { employeeId: string; date: string; hours: number; type: string }): Promise<ApiResult<{ id?: string; amount?: number; status?: string; error?: string }>> {
    if (!this.token) {
      throw new Error('Not logged in');
    }

    const res = await fetch(`${this.baseUrl}/api/overtime-claims`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const body = await res.json();
    return { status: res.status, body };
  }
}
