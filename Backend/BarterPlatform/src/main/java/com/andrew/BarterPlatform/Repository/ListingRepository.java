package com.andrew.BarterPlatform.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.andrew.BarterPlatform.Entity.Listing;
import com.andrew.BarterPlatform.Entity.User;
import com.andrew.BarterPlatform.Enum.SkillCategory;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findByOwnerAndActiveTrue(User owner);

    @Query("SELECT l FROM Listing l WHERE l.active = true AND (" +
    	   "LOWER(l.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
    	   "LOWER(l.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
    	   "LOWER(CAST(l.category AS string)) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Listing> searchListings(@Param("search") String search);
    
    @Query("SELECT l FROM Listing l WHERE l.owner = :owner AND l.active = true AND (" +
    	   "LOWER(l.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
    	   "LOWER(l.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
    	   "LOWER(CAST(l.category AS string)) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Listing> searchListingsByOwner(@Param("owner") User owner, @Param("search") String search);

    List<Listing> findByCategoryInAndActiveTrue(List<SkillCategory> categories);

    @Query("SELECT l FROM Listing l WHERE l.active = true AND l.category IN :categories AND (" +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(CAST(l.category AS string)) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Listing> searchListingsByCategories(@Param("categories") List<SkillCategory> categories, @Param("search") String search);

}
