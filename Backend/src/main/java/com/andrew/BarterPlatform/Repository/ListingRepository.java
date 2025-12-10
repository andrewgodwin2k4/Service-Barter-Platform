package com.andrew.BarterPlatform.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.andrew.BarterPlatform.Entity.Listing;
import com.andrew.BarterPlatform.Entity.User;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findByOwner(User owner);

    @Query("SELECT l FROM Listing l WHERE " +
    	   "LOWER(l.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
    	   "LOWER(l.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
    	   "LOWER(CAST(l.category AS string)) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Listing> searchListings(@Param("search") String search);
    
    @Query("SELECT l FROM Listing l WHERE l.owner = :owner AND (" +
    	   "LOWER(l.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
    	   "LOWER(l.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
    	   "LOWER(CAST(l.category AS string)) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Listing> searchListingsByOwner(@Param("owner") User owner, @Param("search") String search);


}
