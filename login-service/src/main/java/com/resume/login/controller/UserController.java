package com.resume.login.controller;

import com.resume.login.entity.PageResult;
import com.resume.login.entity.Result;
import com.resume.login.entity.User;
import com.resume.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // GET /api/users  → 查询全部（不分页，保留）
    @GetMapping
    public Result findAll() {
        return Result.success(userService.findAll());
    }

    // GET /api/users/page/1/5  → 分页查询
    @GetMapping("/page/{pageNum}/{pageSize}")
    public Result findByPage(@PathVariable int pageNum, @PathVariable int pageSize) {
        List<User> list = userService.findByPage(pageNum, pageSize);
        int total = userService.countTotal();
        return Result.success(new PageResult(total, list));
    }

    @GetMapping("/{id}")
    public Result findById(@PathVariable Integer id) {
        return Result.success(userService.findById(id));
    }

    @PostMapping
    public Result addUser(@RequestBody User user) {
        userService.addUser(user);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result updateUser(@PathVariable Integer id, @RequestBody User user) {
        user.setId(id);
        userService.updateUser(user);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result deleteById(@PathVariable Integer id) {
        userService.deleteById(id);
        return Result.success();
    }

    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        User u = userService.findByUsername(user.getUsername());
        if (u == null) {
            return Result.error("用户名不存在");
        }
        if (!u.getPassword().equals(user.getPassword())) {
            return Result.error("密码错误");
        }
        u.setPassword(null);
        return Result.success(u);
    }

    @PostMapping("/register")
    public Result register(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()) != null) {
            return Result.error("用户名已存在");
        }
        user.setRole("user");
        user.setStatus(1);
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword("123");
        }
        userService.addUser(user);
        return Result.success();
    }
}