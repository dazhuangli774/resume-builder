package com.example.resume.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * DeepSeek 调用封装。
 *
 * 未配置 deepseek.api-key 时自动降级为本地模拟（返回固定文案），
 * 这样 clone 下来不配密钥也能跑通界面；配置后走真实 API。
 */
@Component
public class DeepSeekUtil {

    private static final Logger log = LoggerFactory.getLogger(DeepSeekUtil.class);

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${deepseek.api-key:}")
    private String apiKey;

    @Value("${deepseek.base-url:https://api.deepseek.com}")
    private String baseUrl;

    @Value("${deepseek.model:deepseek-chat}")
    private String model;

    @Value("${deepseek.timeout-seconds:60}")
    private int timeoutSeconds;

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.contains("***");
    }

    /**
     * 兼容原有调用点：把 prompt 原样发给模型，返回生成文本。
     */
    public String generateSummary(String prompt) {
        if (!isConfigured()) {
            log.info("deepseek.api-key 未配置，使用模拟返回。prompt={}", prompt);
            return "（模拟输出）这是占位文案，用于未配置 API Key 时演示界面。"
                 + "配置环境变量 DEEPSEEK_API_KEY 后将调用真实模型生成。";
        }

        try {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", model);
            body.put("stream", false);
            body.put("messages", List.of(
                    Map.of("role", "system", "content", "你是一名资深简历顾问，输出简洁、具体、可量化，不使用空话。"),
                    Map.of("role", "user", "content", prompt)
            ));

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl.replaceAll("/+$", "") + "/chat/completions"))
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() != 200) {
                log.warn("DeepSeek 返回 {}：{}", resp.statusCode(), resp.body());
                throw new IllegalStateException("AI 服务返回 " + resp.statusCode());
            }

            JsonNode root = mapper.readTree(resp.body());
            JsonNode content = root.path("choices").path(0).path("message").path("content");
            return content.isMissingNode() ? "" : content.asText();
        } catch (Exception e) {
            log.error("调用 DeepSeek 失败", e);
            throw new IllegalStateException("AI 服务暂时不可用：" + e.getMessage(), e);
        }
    }
}
