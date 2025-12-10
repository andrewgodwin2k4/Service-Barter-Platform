package com.andrew.BarterPlatform.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BarterTransactionDto {

	private Long learnerId;
    private Long tutorId;
    private Long listingId;
    private Integer credits;
	
}
