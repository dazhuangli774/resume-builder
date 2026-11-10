package com.example.resume.mapper;

import com.example.resume.pojo.Resume;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface ResumeMapper {

    @Select("SELECT * FROM resume WHERE id = #{id}")
    Resume findById(Integer id);

    @Select("SELECT * FROM resume WHERE user_id = #{userId} ORDER BY update_time DESC")
    List<Resume> findByUserId(Integer userId);   // 新增

    @Insert("INSERT INTO resume(user_id, template_id, title, real_name, gender, birthday, phone, email, avatar, summary, education, work_experience, project_experience, skills, self_evaluation, intention, status) VALUES(#{userId}, #{templateId}, #{title}, #{realName}, #{gender}, #{birthday}, #{phone}, #{email}, #{avatar}, #{summary}, #{education}, #{workExperience}, #{projectExperience}, #{skills}, #{selfEvaluation}, #{intention}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Resume resume);

    @Update("UPDATE resume SET template_id=#{templateId}, title=#{title}, real_name=#{realName}, gender=#{gender}, birthday=#{birthday}, phone=#{phone}, email=#{email}, avatar=#{avatar}, summary=#{summary}, education=#{education}, work_experience=#{workExperience}, project_experience=#{projectExperience}, skills=#{skills}, self_evaluation=#{selfEvaluation}, intention=#{intention}, status=#{status}, update_time=NOW() WHERE id=#{id}")
    int update(Resume resume);

    @Delete("DELETE FROM resume WHERE id = #{id}")
    int deleteById(Integer id);
}