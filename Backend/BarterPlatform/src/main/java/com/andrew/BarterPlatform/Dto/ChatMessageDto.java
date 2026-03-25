package com.andrew.BarterPlatform.Dto;

import lombok.Data;

@Data
public class ChatMessageDto {
    private Long receiverId;
    private String content;
}
