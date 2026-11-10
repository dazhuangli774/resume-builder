package com.resume.login.service;

import com.resume.login.entity.User;
import java.util.List;

public interface UserService {
    List<User> findAll();
    List<User> findByPage(int pageNum, int pageSize);
    int countTotal();
    User findById(Integer id);
    User findByUsername(String username);
    int deleteById(Integer id);
    int addUser(User user);
    int updateUser(User user);
}