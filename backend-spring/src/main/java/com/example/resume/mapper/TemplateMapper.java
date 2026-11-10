package com.example.resume.mapper;

import com.example.resume.pojo.Template;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface TemplateMapper {
    @Select("SELECT * FROM template")
    List<Template> findAll();

    @Select("SELECT * FROM template WHERE id = #{id}")
    Template findById(Integer id);
}