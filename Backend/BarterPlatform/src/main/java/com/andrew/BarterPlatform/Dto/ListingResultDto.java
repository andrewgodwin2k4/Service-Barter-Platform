package com.andrew.BarterPlatform.Dto;

import com.andrew.BarterPlatform.Enum.SkillCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListingResultDto {

	String title;
	SkillCategory category;
	String description;
	String ownername;
	
}
