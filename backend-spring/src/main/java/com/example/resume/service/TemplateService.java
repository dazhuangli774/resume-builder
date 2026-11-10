package com.example.resume.service;

import com.example.resume.pojo.Template;
import java.util.List;

public interface TemplateService {
    List<Template> getAllTemplates();
    Template getTemplateById(Integer id);
}