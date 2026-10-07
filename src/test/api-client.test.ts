import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api, ApiError, isApiEnabled } from "@/lib/api-client";
import { getProducts } from "@/api/catalog";
import { products as localProducts } from "@/data/products";

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
    vi.stubEnv("VITE_USE_API", "true");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("sahi URL banata hai aur JSON return karta hai", async () => {
    const fetchMock = mockFetch({ ok: true, status: 200, body: '{"hello":"world"}' });
    vi.stubGlobal("fetch", fetchMock);

    const data = await api.get<{ hello: string }>("/products");
    expect(data).toEqual({ hello: "world" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/products",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("Bearer token header bhejta hai", async () => {
    const fetchMock = mockFetch({ ok: true, status: 200, body: "{}" });
    vi.stubGlobal("fetch", fetchMock);

    await api.get("/auth/me", { token: "abc123" });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer abc123" }),
      })
    );
  });

  it("HTTP error par ApiError throw karta hai (status + message ke saath)", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ ok: false, status: 404, statusText: "Not Found", body: '{"message":"Product nahi mila"}' })
    );

    await expect(api.get("/products/nope")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "Product nahi mila",
    } satisfies Partial<ApiError>);
  });

  it("network failure par status 0 wala ApiError deta hai", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    await expect(api.get("/products")).rejects.toMatchObject({
      name: "ApiError",
      status: 0,
    } satisfies Partial<ApiError>);
  });

  it("isApiEnabled env ke hisaab se kaam karta hai", () => {
    expect(isApiEnabled()).toBe(true);
    vi.stubEnv("VITE_USE_API", "false");
    expect(isApiEnabled()).toBe(false);
  });
});

describe("catalog fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("VITE_USE_API=false par local data deta hai (bina fetch ke)", async () => {
    vi.stubEnv("VITE_USE_API", "false");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await getProducts();
    expect(result).toBe(localProducts);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
