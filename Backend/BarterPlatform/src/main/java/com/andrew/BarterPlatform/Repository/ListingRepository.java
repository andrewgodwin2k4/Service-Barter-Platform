package com.andrew.BarterPlatform.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.andrew.BarterPlatform.Entity.Listing;
import com.andrew.BarterPlatform.Entity.User;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findByOwner(User owner);
    
}
