package com.andrew.BarterPlatform.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.andrew.BarterPlatform.Entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

	@Query("SELECT m FROM ChatMessage m WHERE " +
	       "(m.sender.id = :userId AND m.receiver.id = :otherId) OR " +
	       "(m.sender.id = :otherId AND m.receiver.id = :userId) " +
	       "ORDER BY m.sentAt ASC")
	List<ChatMessage> findConversation(@Param("userId") Long userId, @Param("otherId") Long otherId);
	
	@Query("SELECT m FROM ChatMessage m WHERE m.id IN (" +
	       "SELECT MAX(m2.id) FROM ChatMessage m2 " +
	       "WHERE m2.sender.id = :userId OR m2.receiver.id = :userId " +
	       "GROUP BY CASE WHEN m2.sender.id = :userId THEN m2.receiver.id ELSE m2.sender.id END" +
	       ") ORDER BY m.sentAt DESC")
	List<ChatMessage> findLatestMessagePerConversation(@Param("userId") Long userId);
	
	@Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.receiver.id = :userId AND m.isRead = false")
	long countUnreadMessages(@Param("userId") Long userId);
	
	@Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.sender.id = :senderId AND m.receiver.id = :receiverId AND m.isRead = false")
	long countUnreadFromSender(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
}
