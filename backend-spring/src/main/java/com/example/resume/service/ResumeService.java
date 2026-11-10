package com.example.resume.service;

import com.example.resume.pojo.Resume;
import java.util.List;

public interface ResumeService {
    Resume getResumeDetail(Integer id);
    List<Resume> getResumesByUserId(Integer userId);  // 新增
    int createResume(Resume resume);
    int updateResume(Resume resume);
    int deleteResume(Integer id);
    int publishResume(Integer id);
}