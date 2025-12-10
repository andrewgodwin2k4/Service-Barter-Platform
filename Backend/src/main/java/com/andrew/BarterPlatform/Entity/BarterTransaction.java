package com.andrew.BarterPlatform.Entity;

import java.time.LocalDateTime;

import com.andrew.BarterPlatform.Enum.TransactionStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "barter_transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BarterTransaction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "learner_id", nullable = false)
	private User learner;
	
	@ManyToOne
	@JoinColumn(name = "tutor_id", nullable = false)
	private User tutor;
	
	@ManyToOne
	@JoinColumn(name = "listing_id", nullable = false)
	private Listing listing;

	
	@Column(nullable = false)
	private Integer credits;
	
	@Enumerated(EnumType.STRING)
	private TransactionStatus status = TransactionStatus.PENDING;
	
	private LocalDateTime createdAt = LocalDateTime.now();
	private LocalDateTime updatedAt = LocalDateTime.now();
	private LocalDateTime deliveredAt;

	
	@PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
