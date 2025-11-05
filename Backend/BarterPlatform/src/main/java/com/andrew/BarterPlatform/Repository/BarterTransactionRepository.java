package com.andrew.BarterPlatform.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.andrew.BarterPlatform.Entity.BarterTransaction;
import com.andrew.BarterPlatform.Enum.TransactionStatus;

public interface BarterTransactionRepository extends JpaRepository<BarterTransaction, Long> {
	
    List<BarterTransaction> findByStatus(TransactionStatus status);
    
}
