import { env } from "../lib/env";
import type { UserProfile } from "./types";

async function kimiRequest<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T | null> {
  const resp = await fetch(`${env.kimiOpenUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.warn(
      `[kimi] Request to ${path} failed (${resp.status}): ${text}`,
    );
    return null;
  }
  return resp.json() as Promise<T>;
}

export const users = {
  getProfile: (token: string) =>
    kimiRequest<UserProfile>("/v1/users/me/profile", token),
};

/* ========== AI 润色接口 ========== */

export type ChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

const SYSTEM_PROMPT = `你是一位资深 HR 和简历优化专家，擅长用 STAR 法则和量化表达润色简历内容。

要求：
1. 使用专业、简洁、有力的语言
2. 突出具体成果和量化数据
3. 将平淡的描述转化为行动导向的表达
4. 保持中文语境下的职场表达习惯
5. 只返回润色后的内容，不要添加解释、不要加引号、不要改变原意
6. 如果输入已经是高质量的，只做微调优化`;

export async function polishResume(
  content: string,
): Promise<string | null> {
  // 调试：确认 API Key 是否读取成功
  console.log("[DEBUG] kimiApiKey:", env.kimiApiKey ? "已加载 (长度: " + env.kimiApiKey.length + ")" : "未加载/为空");
  console.log("[DEBUG] kimiOpenUrl:", env.kimiOpenUrl);

  try {
    const resp = await fetch(`${env.kimiOpenUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.kimiApiKey}`,
      },
      body: JSON.stringify({
        model: "moonshot-v1-8k",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `请润色以下简历内容：\n\n${content}` },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.warn(`[AI] 润色请求失败 (${resp.status}): ${text}`);
      return null;
    }

    const data = (await resp.json()) as ChatCompletionResponse;
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("[AI] 润色异常:", error);
    return null;
  }
}