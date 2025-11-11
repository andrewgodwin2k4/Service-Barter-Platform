package com.andrew.BarterPlatform.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.andrew.BarterPlatform.Dto.ListingDto;
import com.andrew.BarterPlatform.Dto.ListingResultDto;
import com.andrew.BarterPlatform.Entity.Listing;
import com.andrew.BarterPlatform.Service.ListingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/listings")
public class ListingController {

	private final ListingService listingService;
	
	@GetMapping
	public ResponseEntity<List<ListingResultDto>> getAllListings(@RequestParam(required = false) String search, @RequestParam(required = false) Long userId) {
	    if (userId != null) 
	        return new ResponseEntity<>(listingService.getListingsForUser(search, userId), HttpStatus.OK);
	    return new ResponseEntity<>(listingService.getAllListings(search), HttpStatus.OK);
	}

    @GetMapping("/{id}")
    public ResponseEntity<Listing> getListingById(@PathVariable Long id) {
        return new ResponseEntity<>(listingService.getListingById(id), HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Listing> createListing(@RequestBody ListingDto dto) {
        return new ResponseEntity<>(listingService.createListing(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Listing> updateListing(@PathVariable Long id, @RequestBody ListingDto dto) {
        return new ResponseEntity<>(listingService.updateListing(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        listingService.deleteListing(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
	
}
