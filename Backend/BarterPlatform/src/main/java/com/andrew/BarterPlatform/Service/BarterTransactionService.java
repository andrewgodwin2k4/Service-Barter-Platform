package com.andrew.BarterPlatform.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andrew.BarterPlatform.Dto.BarterTransactionDto;
import com.andrew.BarterPlatform.Dto.CompleteDto;
import com.andrew.BarterPlatform.Dto.DeliveryDto;
import com.andrew.BarterPlatform.Dto.DisputeDto;
import com.andrew.BarterPlatform.Dto.RevisionDto;
import com.andrew.BarterPlatform.Entity.BarterTransaction;
import com.andrew.BarterPlatform.Entity.Listing;
import com.andrew.BarterPlatform.Entity.User;
import com.andrew.BarterPlatform.Enum.TransactionStatus;
import com.andrew.BarterPlatform.Repository.BarterTransactionRepository;
import com.andrew.BarterPlatform.Repository.ListingRepository;
import com.andrew.BarterPlatform.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BarterTransactionService {

	private final BarterTransactionRepository transRepo;
	private final UserRepository userRepo;
	private final ListingRepository listingRepo;
	
	@Transactional(readOnly = true)
	public List<BarterTransaction> getAllTransactions() {
        return transRepo.findAll();
    }
	
	@Transactional(readOnly = true)
	public List<BarterTransaction> getTransactionsByBuyer(Long buyerId) {
	    return transRepo.findByBuyerId(buyerId);
	}

	@Transactional(readOnly = true)
	public List<BarterTransaction> getRequestsForProvider(Long providerId) {
	    return transRepo.findByProviderId(providerId);
	}
	
	public BarterTransaction createTransaction(BarterTransactionDto dto) {
		
		 User buyer = userRepo.findById(dto.getBuyerId()).orElseThrow(() -> new EntityNotFoundException("Buyer not found!"));
	     User provider = userRepo.findById(dto.getProviderId()).orElseThrow(() -> new EntityNotFoundException("Provider not found!"));
	     Listing listing = listingRepo.findById(dto.getListingId()).orElseThrow(() -> new EntityNotFoundException("Listing not found!"));
	     int credits = dto.getCredits();
	     
	     if (buyer.getCredits() < credits)
	         throw new IllegalStateException("Insufficient credits to create transaction!");
	     
	     // Temporarily hold credits
		 buyer.setCredits(buyer.getCredits() - credits);
		 userRepo.save(buyer);
	     
	     BarterTransaction trans = new BarterTransaction();
	     trans.setBuyer(buyer);
	     trans.setProvider(provider);
	     trans.setListing(listing);
	     trans.setCredits(credits);
	     
	     return transRepo.save(trans);
	}
	
	private BarterTransaction findTransaction(Long id) {
        return transRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Transaction not found!"));
    }
	
	public BarterTransaction acceptTransaction(Long id) {
		
		BarterTransaction trans = findTransaction(id);
		if (trans.getStatus() != TransactionStatus.PENDING)
	        throw new IllegalStateException("Only pending transactions can be accepted!");
		trans.setStatus(TransactionStatus.ACCEPTED);
		return transRepo.save(trans);
		
	}
	
	public BarterTransaction rejectTransaction(Long id) {
		
	    BarterTransaction trans = findTransaction(id);
	    if (trans.getStatus() != TransactionStatus.PENDING)
	        throw new IllegalStateException("Only pending transactions can be rejected!");
	    trans.setStatus(TransactionStatus.REJECTED);
	    
	    // Refund held credits
	    User buyer = trans.getBuyer();
	    buyer.setCredits(buyer.getCredits() + trans.getCredits()); 
	    userRepo.save(buyer);
	    
	    return transRepo.save(trans);
	    
	}

	public BarterTransaction markDelivered(Long id, DeliveryDto deliveryDto) {
		
		BarterTransaction t = findTransaction(id);
		if (t.getStatus() != TransactionStatus.ACCEPTED && t.getStatus() != TransactionStatus.REVISION_REQUESTED)
	        throw new IllegalStateException("Only accepted or revision-requested transactions can be delivered!");
		
		if (deliveryDto.getDeliveryLink() == null || deliveryDto.getDeliveryLink().isBlank())
			throw new IllegalArgumentException("Delivery link is required!");
		
        t.setStatus(TransactionStatus.DELIVERED);
        t.setDeliveredAt(LocalDateTime.now());
        t.setDeliveryLink(deliveryDto.getDeliveryLink().trim());
        t.setDeliveryNote(deliveryDto.getDeliveryNote() != null ? deliveryDto.getDeliveryNote().trim() : null);
        return transRepo.save(t);
	
	}
	
	public BarterTransaction markCompleted(Long id, CompleteDto dto) {
		
		BarterTransaction trans = findTransaction(id);
		if (trans.getStatus() != TransactionStatus.DELIVERED)
	        throw new IllegalStateException("Only delivered transactions can be completed!");
		trans.setStatus(TransactionStatus.COMPLETED);
		trans.setCompletionReview(dto.getCompletionReview());
		
		User provider = trans.getProvider();
		int credits = trans.getCredits();
		
		provider.setCredits(provider.getCredits() + credits);
		userRepo.save(provider);
		
		return transRepo.save(trans);
		
	}
	
	public BarterTransaction raiseDispute(Long id, DisputeDto dto) {
		
        BarterTransaction t = findTransaction(id);
        if (t.getStatus() != TransactionStatus.DELIVERED)
	        throw new IllegalStateException("Only delivered transactions can be disputed!");
        t.setStatus(TransactionStatus.DISPUTED);
        t.setDisputeReason(dto.getDisputeReason());
        return transRepo.save(t);
        
    }

	public BarterTransaction requestRevision(Long id, RevisionDto dto) {
		BarterTransaction t = findTransaction(id);
		if (t.getStatus() != TransactionStatus.DELIVERED)
			throw new IllegalStateException("Only delivered transactions can have a revision requested!");
		t.setStatus(TransactionStatus.REVISION_REQUESTED);
		t.setRevisionComment(dto.getRevisionComment());
		return transRepo.save(t);
	}
	
	public void autoCompleteTransactions() {
		
		List<BarterTransaction> delivered = transRepo.findByStatus(TransactionStatus.DELIVERED);
		LocalDateTime now = LocalDateTime.now();
		
		for(BarterTransaction trans : delivered) {
			if(trans.getDeliveredAt() != null && Duration.between(trans.getDeliveredAt(), now).toHours() >= 48) {
				trans.setStatus(TransactionStatus.AUTO_COMPLETED);
				
				User provider = trans.getProvider();
				int credits = trans.getCredits();
				
				provider.setCredits(provider.getCredits() + credits);
				userRepo.save(provider);
			}
			
			transRepo.save(trans);
		}
		
	}
	
	public BarterTransaction rateTransaction(Long id, Integer rating) {
		BarterTransaction trans = findTransaction(id);
		
		if (trans.getStatus() != TransactionStatus.COMPLETED && trans.getStatus() != TransactionStatus.AUTO_COMPLETED) {
		    throw new IllegalStateException("You can only rate completed transactions!");
		}
		if (trans.getRating() != null) {
		    throw new IllegalStateException("This transaction has already been rated!");
		}
		if (rating < 1 || rating > 5) {
		    throw new IllegalArgumentException("Rating must be between 1 and 5!");
		}
		
		trans.setRating(rating);
		
		User provider = trans.getProvider();
		double currentAvg = provider.getAverageRating() != null ? provider.getAverageRating() : 0.0;
		int totalRatings = provider.getTotalRatings() != null ? provider.getTotalRatings() : 0;
		
		double newAvg = Math.round((((currentAvg * totalRatings) + rating) / (totalRatings + 1)) * 10.0) / 10.0;
		provider.setAverageRating(newAvg);
		provider.setTotalRatings(totalRatings + 1);
		
		userRepo.save(provider);
		return transRepo.save(trans);
	}
	
	public BarterTransaction cancelTransaction(Long id) {
		
	    BarterTransaction trans = findTransaction(id);
	    if (trans.getStatus() != TransactionStatus.PENDING)
	        throw new IllegalStateException("Only pending transactions can be cancelled!");
	    trans.setStatus(TransactionStatus.CANCELLED);
	    
	    User buyer = trans.getBuyer();
	    buyer.setCredits(buyer.getCredits() + trans.getCredits()); 
	    userRepo.save(buyer);
	    
	    return transRepo.save(trans);
	    
	}

	
}
