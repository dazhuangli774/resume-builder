package com.example.resume.service;

import com.example.resume.pojo.User;

public interface UserService {
    User findByUsername(String username);
    void register(User user);
    User login(String username, String password);
}