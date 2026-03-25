package com.andrew.BarterPlatform.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.andrew.BarterPlatform.Dto.ChatMessageDto;
import com.andrew.BarterPlatform.Entity.ChatMessage;
import com.andrew.BarterPlatform.Entity.User;
import com.andrew.BarterPlatform.Service.ChatMessageService;
import com.andrew.BarterPlatform.Service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {

    private final ChatMessageService chatService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ChatMessage> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChatMessageDto dto) {
        User sender = userService.findByEmail(userDetails.getUsername());
        return new ResponseEntity<>(chatService.sendMessage(sender.getId(), dto), HttpStatus.CREATED);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ChatMessage>> getConversations(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(chatService.getConversationList(user.getId()));
    }

    @GetMapping("/conversation/{otherId}")
    public ResponseEntity<List<ChatMessage>> getConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long otherId) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(chatService.getConversation(user.getId(), otherId));
    }

    @PutMapping("/read/{senderId}")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long senderId) {
        User user = userService.findByEmail(userDetails.getUsername());
        chatService.markConversationAsRead(user.getId(), senderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread")
    public ResponseEntity<Long> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(chatService.getUnreadCount(user.getId()));
    }
}
