package com.andrew.BarterPlatform.Config;

import com.andrew.BarterPlatform.Repository.BarterTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DEBUG: Running DataFixer to clean up obsolete 'DISPUTED' statuses...");
        
        // Use raw SQL to find and update statuses that might not map to the enum anymore
        int updated = jdbcTemplate.update("UPDATE barter_transactions SET status = 'CANCELLED' WHERE status = 'DISPUTED'");
        
        if (updated > 0) {
            System.out.println("DEBUG: Successfully migrated " + updated + " 'DISPUTED' transactions to 'CANCELLED'.");
        } else {
            System.out.println("DEBUG: No 'DISPUTED' transactions found in database.");
        }
    }
}
