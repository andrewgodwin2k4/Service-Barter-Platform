package com.andrew.BarterPlatform.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andrew.BarterPlatform.Dto.BarterTransactionDto;
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
	
	public BarterTransaction createTransaction(BarterTransactionDto dto) {
		
		 User learner = userRepo.findById(dto.getLearnerId()).orElseThrow(() -> new EntityNotFoundException("Learner not found!"));
	     User tutor = userRepo.findById(dto.getTutorId()).orElseThrow(() -> new EntityNotFoundException("Teacher not found!"));
	     Listing listing = listingRepo.findById(dto.getListingId()).orElseThrow(() -> new EntityNotFoundException("Listing not found!"));
	     int credits = dto.getCredits();
	     
	     if (learner.getCredits() < credits)
	         throw new IllegalStateException("Insufficient credits to create transaction!");
	     
	     // Temporarily hold credits
		 learner.setCredits(learner.getCredits() - credits);
		 userRepo.save(learner);
	     
	     BarterTransaction trans = new BarterTransaction();
	     trans.setLearner(learner);
	     trans.setTutor(tutor);
	     trans.setListing(listing);
	     trans.setCredits(credits);
	     
	     return transRepo.save(trans);
	}
	
	private BarterTransaction findTransaction(Long id) {
        return transRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Transaction not found!"));
    }
	
	public BarterTransaction acceptTransaction(Long id) {
		
		BarterTransaction trans = findTransaction(id);
		trans.setStatus(TransactionStatus.ACCEPTED);
		return transRepo.save(trans);
		
	}
	
	public BarterTransaction rejectTransaction(Long id) {
		
	    BarterTransaction trans = findTransaction(id);
	    if (trans.getStatus() != TransactionStatus.PENDING)
	        throw new IllegalStateException("Only pending transactions can be rejected!");
	    trans.setStatus(TransactionStatus.REJECTED);
	    
	    //Refund holded credits
	    User learner = trans.getLearner();
	    learner.setCredits(learner.getCredits() + trans.getCredits()); 
	    userRepo.save(learner);
	    
	    return transRepo.save(trans);
	    
	}

	public BarterTransaction markDelivered(Long id) {
		
		BarterTransaction t = findTransaction(id);
        t.setStatus(TransactionStatus.DELIVERED);
        t.setDeliveredAt(LocalDateTime.now());
        return transRepo.save(t);
	
	}
	
	public BarterTransaction markCompleted(Long id) {
		
		BarterTransaction trans = findTransaction(id);
		if (trans.getStatus() != TransactionStatus.DELIVERED)
	        throw new IllegalStateException("Only delivered transactions can be completed!");
		trans.setStatus(TransactionStatus.COMPLETED);
		
		User tutor = trans.getTutor();
		int credits = trans.getCredits();
		
		tutor.setCredits(tutor.getCredits() + credits);
		userRepo.save(tutor);
		
		return transRepo.save(trans);
		
	}
	
	public BarterTransaction raiseDispute(Long id) {
		
        BarterTransaction t = findTransaction(id);
        t.setStatus(TransactionStatus.DISPUTED);
        return transRepo.save(t);
        
    }
	
	public void autoCompleteTransactions() {
		
		List<BarterTransaction> delivered = transRepo.findByStatus(TransactionStatus.DELIVERED);
		LocalDateTime now = LocalDateTime.now();
		
		for(BarterTransaction trans : delivered) {
			if(Duration.between(trans.getDeliveredAt(), now).toHours() >= 48) {
				trans.setStatus(TransactionStatus.AUTO_COMPLETED);
				
				User tutor = trans.getTutor();
				int credits = trans.getCredits();
				
				tutor.setCredits(tutor.getCredits() + credits);
				userRepo.save(tutor);
			}
			
			transRepo.save(trans);
		}
		
	}
	
	public BarterTransaction cancelTransaction(Long id) {
		
	    BarterTransaction trans = findTransaction(id);
	    if (trans.getStatus() != TransactionStatus.PENDING)
	        throw new IllegalStateException("Only pending transactions can be cancelled!");
	    trans.setStatus(TransactionStatus.CANCELLED);
	    
	    User learner = trans.getLearner();
	    learner.setCredits(learner.getCredits() + trans.getCredits()); 
	    userRepo.save(learner);
	    
	    return transRepo.save(trans);
	    
	}

	
}
