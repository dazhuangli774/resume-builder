package com.resume.login.entity;

import lombok.Data;
import java.util.List;

@Data
public class PageResult {
    private int total;
    private List<?> rows;

    public PageResult(int total, List<?> rows) {
        this.total = total;
        this.rows = rows;
    }
}