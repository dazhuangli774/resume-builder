package com.resume.login.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.resume.login.entity.Result;
import com.resume.login.entity.User;
import com.resume.login.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/users")
    public Result listUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword) {

        PageHelper.startPage(page, pageSize);
        List<User> list = userMapper.selectAll(keyword);
        PageInfo<User> pageInfo = new PageInfo<>(list);

        Map<String, Object> data = new HashMap<>();
        data.put("list", pageInfo.getList());
        data.put("total", pageInfo.getTotal());
        data.put("pageNum", pageInfo.getPageNum());
        data.put("pageSize", pageInfo.getPageSize());

        return Result.success(data);
    }

    @DeleteMapping("/users/{id}")
    public Result deleteUser(@PathVariable Integer id) {
        userMapper.deleteById(id);
        return Result.success();
    }

    @PutMapping("/users/{id}/status")
    public Result updateStatus(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
        userMapper.updateStatus(id, body.get("status"));
        return Result.success();
    }
}