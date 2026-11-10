package com.example.resume.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class Template {
    private Integer id;
    private String name;
    private String description;
    private String previewUrl;
    private String cssStyle;
    private LocalDateTime createTime;
}