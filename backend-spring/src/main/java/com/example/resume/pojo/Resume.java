package com.example.resume.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class Resume {
    private Integer id;
    private Integer userId;
    private Integer templateId;
    private String title;
    private String realName;
    private Short gender;
    private LocalDate birthday;
    private String phone;
    private String email;
    private String avatar;
    private String summary;
    private String education;          // JSON 字符串
    private String workExperience;
    private String projectExperience;
    private String skills;
    private String selfEvaluation;
    private String intention;
    private Short status;
    private Integer viewCount;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}