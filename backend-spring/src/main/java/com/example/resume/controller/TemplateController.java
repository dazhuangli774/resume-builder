package com.example.resume.controller;

import com.example.resume.utils.Result;
import com.example.resume.pojo.Template;
import com.example.resume.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/template")
public class TemplateController {
    @Autowired private TemplateService templateService;

    @GetMapping("/list")
    public Result list() {
        return Result.success(templateService.getAllTemplates());
    }

    @GetMapping("/{id}")
    public Result getById(@PathVariable Integer id) {
        return Result.success(templateService.getTemplateById(id));
    }
}