package com.andrew.BarterPlatform.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andrew.BarterPlatform.Dto.ChatMessageDto;
import com.andrew.BarterPlatform.Entity.ChatMessage;
import com.andrew.BarterPlatform.Entity.User;
import com.andrew.BarterPlatform.Repository.ChatMessageRepository;
import com.andrew.BarterPlatform.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatMessageService {

	private final ChatMessageRepository chatRepo;
	private final UserRepository userRepo;
	
	public ChatMessage sendMessage(Long senderId, ChatMessageDto dto) {
		User sender = userRepo.findById(senderId)
				.orElseThrow(() -> new EntityNotFoundException("Sender not found!"));
		User receiver = userRepo.findById(dto.getReceiverId())
				.orElseThrow(() -> new EntityNotFoundException("Receiver not found!"));
		
		if (senderId.equals(dto.getReceiverId()))
			throw new IllegalArgumentException("Cannot send message to yourself!");
		
		ChatMessage msg = new ChatMessage();
		msg.setSender(sender);
		msg.setReceiver(receiver);
		msg.setContent(dto.getContent().trim());
		return chatRepo.save(msg);
	}
	
	@Transactional(readOnly = true)
	public List<ChatMessage> getConversation(Long userId, Long otherId) {
		return chatRepo.findConversation(userId, otherId);
	}
	
	@Transactional(readOnly = true)
	public List<ChatMessage> getConversationList(Long userId) {
		return chatRepo.findLatestMessagePerConversation(userId);
	}
	
	public void markConversationAsRead(Long userId, Long senderId) {
		List<ChatMessage> messages = chatRepo.findConversation(userId, senderId);
		for (ChatMessage msg : messages) {
			if (msg.getReceiver().getId().equals(userId) && !msg.isRead()) {
				msg.setRead(true);
				chatRepo.save(msg);
			}
		}
	}
	
	@Transactional(readOnly = true)
	public long getUnreadCount(Long userId) {
		return chatRepo.countUnreadMessages(userId);
	}
}
