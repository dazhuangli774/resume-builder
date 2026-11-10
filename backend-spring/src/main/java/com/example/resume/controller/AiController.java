package com.example.resume.controller;

import com.example.resume.utils.DeepSeekUtil;
import com.example.resume.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private DeepSeekUtil deepSeekUtil;

    /**
     * 根据关键词生成个人简介（原 /summary 接口）
     */
    @PostMapping("/summary")
    public Result<String> generateSummary(@RequestBody Map<String, String> payload) {
        String prompt = payload.get("prompt");
        String result = deepSeekUtil.generateSummary(prompt);
        return Result.success(result);
    }

    /**
     * AI 润色文本
     */
    @PostMapping("/polish")
    public Result<String> polish(@RequestBody Map<String, String> payload) {
        String text = payload.get("text");
        if (text == null || text.trim().isEmpty()) {
            return Result.error("待润色的文本不能为空");
        }
        String prompt = "请润色以下文本，使其更专业、简洁、有说服力，保持原意：\n" + text;
        String result = deepSeekUtil.generateSummary(prompt);
        return Result.success(result);
    }

    /**
     * 生成求职信
     */
    @PostMapping("/cover-letter")
    public Result<String> coverLetter(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.getOrDefault("realName", "");
        String target = (String) payload.getOrDefault("jobTarget", "");
        String summary = (String) payload.getOrDefault("summary", "");
        String prompt = "请根据以下信息生成一封专业、有说服力的求职信，字数在150-200字之间：\n" +
                "姓名：" + name + "\n" +
                "目标岗位：" + target + "\n" +
                "个人简介：" + summary + "\n" +
                "要求：语气正式，突出个人优势，表达对该岗位的热情。";
        String result = deepSeekUtil.generateSummary(prompt);
        return Result.success(result);
    }
}