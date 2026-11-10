package com.example.resume.controller;

import com.example.resume.utils.Result;
import com.example.resume.pojo.User;
import com.example.resume.service.UserService;
import com.example.resume.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")   // 类上的路径映射
public class UserController {

    @Autowired
    private UserService userService;

    // 登录方法：必须是 @PostMapping
    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        User dbUser = userService.login(user.getUsername(), user.getPassword());
        if (dbUser == null) {
            return Result.error("用户名或密码错误");
        }
        String token = JwtUtil.generateToken(dbUser.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", dbUser);
        return Result.success(data);
    }

    // 注册方法
    @PostMapping("/register")
    public Result register(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()) != null) {
            return Result.error("用户名已存在");
        }
        userService.register(user);
        return Result.success();
    }

    // 测试接口（验证后端是否可访问）
    @GetMapping("/test")
    public Result test() {
        return Result.success("后端连接成功！");
    }
}