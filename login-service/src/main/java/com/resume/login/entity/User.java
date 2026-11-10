package com.resume.login.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Integer id;
    private String username;
    private String email;
    private String phone;
    private String role;
    private Integer status;
    private String password;        // 新增
    private LocalDateTime createdAt;
}