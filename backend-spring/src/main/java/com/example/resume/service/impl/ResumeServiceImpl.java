package com.example.resume.service.impl;

import com.example.resume.mapper.ResumeMapper;
import com.example.resume.pojo.Resume;
import com.example.resume.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeMapper resumeMapper;

    @Override
    public Resume getResumeDetail(Integer id) {
        return resumeMapper.findById(id);
    }

    @Override
    public List<Resume> getResumesByUserId(Integer userId) {
        return resumeMapper.findByUserId(userId);
    }

    @Override
    public int createResume(Resume resume) {
        resume.setStatus((short) 0); // 默认草稿
        return resumeMapper.insert(resume);
    }

    @Override
    public int updateResume(Resume resume) {
        return resumeMapper.update(resume);
    }

    @Override
    public int deleteResume(Integer id) {
        return resumeMapper.deleteById(id);
    }

    @Override
    public int publishResume(Integer id) {
        Resume r = new Resume();
        r.setId(id);
        r.setStatus((short) 1);
        return resumeMapper.update(r);
    }
}