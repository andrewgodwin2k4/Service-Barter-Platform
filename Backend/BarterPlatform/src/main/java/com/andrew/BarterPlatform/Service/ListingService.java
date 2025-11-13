package com.andrew.BarterPlatform.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.andrew.BarterPlatform.Dto.ListingDto;
import com.andrew.BarterPlatform.Dto.ListingResultDto;
import com.andrew.BarterPlatform.Entity.Listing;
import com.andrew.BarterPlatform.Entity.User;
import com.andrew.BarterPlatform.Repository.ListingRepository;
import com.andrew.BarterPlatform.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListingService {

	private final ListingRepository listingRepo;
	private final UserRepository userRepo;
	
	public List<Listing> getAllListings(String search) {
		List<Listing> listings;
		if(search == null || search.isBlank())
			 listings = listingRepo.findAll();
		else
			listings = listingRepo.searchListings(search);
		
		return listings;
	}
	
	public List<Listing> getListingsForUser(String search, Long userId) {
	    User owner = userRepo.findById(userId).orElseThrow(() -> new EntityNotFoundException("Owner not found!"));

	    List<Listing> listings;
	    if (search == null || search.isBlank()) 
	        listings = listingRepo.findByOwner(owner);
	    else 
	        listings = listingRepo.searchListingsByOwner(owner, search);

	    return listings;
	}

	
	public Listing getListingById(Long id) {
        return listingRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Listing not found!"));
    }
	
	public Listing createListing(ListingDto dto) {
		
        User owner = userRepo.findById(dto.getOwnerId()).orElseThrow(() -> new EntityNotFoundException("Owner not found!"));

        Listing listing = new Listing();
        listing.setTitle(dto.getTitle());
        listing.setDescription(dto.getDescription());
        listing.setCategory(dto.getCategory());
        listing.setCreditValue(dto.getCreditValue());
        listing.setOwner(owner);

        return listingRepo.save(listing);
        
    }
	
	public Listing updateListing(Long id, ListingDto dto) {
		
        Listing listing = getListingById(id);
        listing.setTitle(dto.getTitle());
        listing.setDescription(dto.getDescription());
        listing.setCategory(dto.getCategory());
        listing.setCreditValue(dto.getCreditValue());
        
        return listingRepo.save(listing);
        
    }
	
	public void deleteListing(Long id) {
        Listing listing = getListingById(id);
        listingRepo.delete(listing);
    }
	
}
