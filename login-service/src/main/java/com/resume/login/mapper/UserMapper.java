package com.resume.login.mapper;

import com.resume.login.entity.User;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM sys_user ORDER BY id DESC")
    List<User> findAll();

    @Select("SELECT * FROM sys_user ORDER BY id DESC LIMIT #{offset}, #{pageSize}")
    List<User> findByPage(@Param("offset") int offset, @Param("pageSize") int pageSize);

    @Select("SELECT COUNT(*) FROM sys_user")
    int countTotal();

    @Select("SELECT * FROM sys_user WHERE id = #{id}")
    User findById(Integer id);

    @Select("SELECT * FROM sys_user WHERE username = #{username}")
    User findByUsername(String username);

    @Delete("DELETE FROM sys_user WHERE id = #{id}")
    int deleteById(Integer id);

    @Insert("INSERT INTO sys_user(username, email, phone, role, status, password) VALUES(#{username}, #{email}, #{phone}, #{role}, #{status}, #{password})")
    int addUser(User user);

    @Update("UPDATE sys_user SET username=#{username}, email=#{email}, phone=#{phone}, role=#{role}, status=#{status}, password=#{password} WHERE id=#{id}")
    int updateUser(User user);

    @Select("<script>" +
        "SELECT * FROM sys_user " +
        "<where>" +
        "<if test='keyword != null and keyword != \"\"'>" +
        "AND (username LIKE CONCAT('%',#{keyword},'%') OR email LIKE CONCAT('%',#{keyword},'%')) " +
        "</if>" +
        "</where>" +
        "ORDER BY id DESC" +
        "</script>")
    List<User> selectAll(@Param("keyword") String keyword);

    @Update("UPDATE sys_user SET status = #{status} WHERE id = #{id}")
    void updateStatus(@Param("id") Integer id, @Param("status") Integer status);
}

