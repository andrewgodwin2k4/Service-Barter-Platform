package com.andrew.BarterPlatform.Dto;

import com.andrew.BarterPlatform.Enum.SkillCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListingDto {
	
    private String title;
    private String description;
    private SkillCategory category;
    private Integer creditValue;
    private Long ownerId;
    
}
