import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api, ApiError, isApiEnabled, configureApiClient } from "@/lib/api-client";

function mockFetch(response: { ok: boolean; status: number; statusText?: string; body: string }) {
  return vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status,
    statusText: response.statusText ?? "",
    text: () => Promise.resolve(response.body),
  });
}

describe("api-client", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com/api");
    configureApiClient({
      getAccessToken: () => null,
      refreshAccessToken: async () => null,
      onAuthExpired: () => {},
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("sahi URL banata hai aur JSON return karta hai", async () => {
    const fetchMock = mockFetch({ ok: true, status: 200, body: '{"hello":"world"}' });
    vi.stubGlobal("fetch", fetchMock);

    const data = await api.get<{ hello: string }>("/users/me");
    expect(data).toEqual({ hello: "world" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/users/me",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("Bearer token header bhejta hai (auth store se)", async () => {
    const fetchMock = mockFetch({ ok: true, status: 200, body: "{}" });
    vi.stubGlobal("fetch", fetchMock);
    configureApiClient({
      getAccessToken: () => "abc123",
      refreshAccessToken: async () => null,
      onAuthExpired: () => {},
    });

    await api.get("/users/me");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer abc123" }),
      })
    );
  });

  it("auth:false par token nahi bhejta", async () => {
    const fetchMock = mockFetch({ ok: true, status: 200, body: "{}" });
    vi.stubGlobal("fetch", fetchMock);
    configureApiClient({
      getAccessToken: () => "abc123",
      refreshAccessToken: async () => null,
      onAuthExpired: () => {},
    });

    await api.post("/auth/login", { body: { a: 1 }, auth: false });
    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
  });

  it("401 par token refresh karke retry karta hai", async () => {
    const first = { ok: false, status: 401, body: '{"message":"Unauthorized"}' };
    const second = { ok: true, status: 200, body: '{"ok":true}' };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ...first, statusText: "", text: () => Promise.resolve(first.body) })
      .mockResolvedValueOnce({ ...second, statusText: "", text: () => Promise.resolve(second.body) });
    vi.stubGlobal("fetch", fetchMock);

    let refreshed = false;
    configureApiClient({
      getAccessToken: () => (refreshed ? "new-token" : "old-token"),
      refreshAccessToken: async () => {
        refreshed = true;
        return "new-token";
      },
      onAuthExpired: () => {},
    });

    const data = await api.get<{ ok: boolean }>("/users/me");
    expect(data).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const retryHeaders = fetchMock.mock.calls[1][1].headers as Record<string, string>;
    expect(retryHeaders.Authorization).toBe("Bearer new-token");
  });

  it("refresh fail ho to onAuthExpired chalta hai", async () => {
    vi.stubGlobal("fetch", mockFetch({ ok: false, status: 401, body: '{"message":"Unauthorized"}' }));
    const onAuthExpired = vi.fn();
    configureApiClient({
      getAccessToken: () => "old-token",
      refreshAccessToken: async () => null,
      onAuthExpired,
    });

    await expect(api.get("/users/me")).rejects.toMatchObject({ name: "ApiError", status: 401 });
    expect(onAuthExpired).toHaveBeenCalled();
  });

  it("HTTP error par ApiError throw karta hai (status + message ke saath)", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ ok: false, status: 404, statusText: "Not Found", body: '{"message":"Nahi mila"}' })
    );

    await expect(api.get("/users/nope")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "Nahi mila",
    } satisfies Partial<ApiError>);
  });

  it("network failure par status 0 wala ApiError deta hai", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    await expect(api.get("/users/me")).rejects.toMatchObject({
      name: "ApiError",
      status: 0,
    } satisfies Partial<ApiError>);
  });

  it("isApiEnabled URL ke hisaab se kaam karta hai", () => {
    expect(isApiEnabled()).toBe(true);
    vi.stubEnv("VITE_API_URL", "");
    expect(isApiEnabled()).toBe(false);
  });
});
