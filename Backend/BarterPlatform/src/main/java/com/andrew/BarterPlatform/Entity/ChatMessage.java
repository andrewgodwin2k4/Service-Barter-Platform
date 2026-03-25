package com.andrew.BarterPlatform.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "sender_id", nullable = false)
	private User sender;
	
	@ManyToOne
	@JoinColumn(name = "receiver_id", nullable = false)
	private User receiver;
	
	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;
	
	private boolean isRead = false;
	
	private LocalDateTime sentAt = LocalDateTime.now();
}
