import { Hono } from "hono";
import { polishResume } from "./kimi/platform";

const ai = new Hono();

// AI 润色接口
ai.post("/polish", async (c) => {
  const body = await c.req.json();
  const { content } = body;

  if (!content || typeof content !== "string") {
    return c.json({ error: "content is required" }, 400);
  }

  const result = await polishResume(content);

  if (!result) {
    return c.json({ error: "AI 润色失败，请稍后重试" }, 500);
  }

  return c.json({ original: content, polished: result });
});

export default ai;