package com.example.resume.service.impl;

import com.example.resume.mapper.TemplateMapper;
import com.example.resume.pojo.Template;
import com.example.resume.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemplateServiceImpl implements TemplateService {

    @Autowired
    private TemplateMapper templateMapper;

    @Override
    public List<Template> getAllTemplates() {
        return templateMapper.findAll();
    }

    @Override
    public Template getTemplateById(Integer id) {
        return templateMapper.findById(id);
    }
}