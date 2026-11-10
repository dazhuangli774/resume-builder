package com.example.resume.controller;

import com.example.resume.pojo.Resume;
import com.example.resume.utils.Result;
import com.example.resume.service.ResumeService;
import com.example.resume.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    // 获取当前用户的所有简历
    @GetMapping("/list")
    public Result<List<Resume>> list(@RequestHeader("Authorization") String token) {
        Integer userId = JwtUtil.getUserId(token);
        if (userId == null) {
            return Result.error("无效的token");
        }
        List<Resume> list = resumeService.getResumesByUserId(userId);
        return Result.success(list);
    }

    // 获取单份简历详情
    @GetMapping("/{id}")
    public Result<Resume> getById(@PathVariable Integer id) {
        Resume resume = resumeService.getResumeDetail(id);
        return Result.success(resume);
    }

    // 创建简历
    @PostMapping
    public Result<Integer> create(@RequestBody Resume resume, @RequestHeader("Authorization") String token) {
        Integer userId = JwtUtil.getUserId(token);
        if (userId == null) {
            return Result.error("无效的token，请重新登录");
        }
        resume.setUserId(userId);
        resumeService.createResume(resume);
        return Result.success(resume.getId());
    }

    // 更新简历
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Resume resume, @RequestHeader("Authorization") String token) {
        resume.setId(id);
        resumeService.updateResume(resume);
        return Result.success();
    }

    // 删除简历
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        resumeService.deleteResume(id);
        return Result.success();
    }
}