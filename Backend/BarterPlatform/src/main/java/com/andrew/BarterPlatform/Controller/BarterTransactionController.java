package com.andrew.BarterPlatform.Controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.andrew.BarterPlatform.Dto.BarterTransactionDto;
import com.andrew.BarterPlatform.Dto.DeliveryDto;
import com.andrew.BarterPlatform.Entity.BarterTransaction;
import com.andrew.BarterPlatform.Service.BarterTransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/transactions")
public class BarterTransactionController {

    private final BarterTransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<List<BarterTransaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }
    
    @GetMapping("/user/{buyerId}")
    public ResponseEntity<List<BarterTransaction>> getUserTransactions(@PathVariable Long buyerId) {
        return ResponseEntity.ok(transactionService.getTransactionsByBuyer(buyerId));
    }

    @GetMapping("/requests/{providerId}")
    public ResponseEntity<List<BarterTransaction>> getProviderRequests(@PathVariable Long providerId) {
        return ResponseEntity.ok(transactionService.getRequestsForProvider(providerId));
    }


    @PostMapping
    public ResponseEntity<BarterTransaction> create(@RequestBody BarterTransactionDto dto) {
        return new ResponseEntity<>(transactionService.createTransaction(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<BarterTransaction> accept(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.acceptTransaction(id));
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<BarterTransaction> reject(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.rejectTransaction(id));
    }

    @PutMapping("/{id}/deliver")
    public ResponseEntity<BarterTransaction> deliver(@PathVariable Long id, @RequestBody DeliveryDto deliveryDto) {
        return ResponseEntity.ok(transactionService.markDelivered(id, deliveryDto));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<BarterTransaction> complete(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.markCompleted(id));
    }

	@PutMapping("/{id}/revision")
	public ResponseEntity<BarterTransaction> requestRevision(@PathVariable Long id) {
		return ResponseEntity.ok(transactionService.requestRevision(id));
	}

    @PutMapping("/{id}/dispute")
    public ResponseEntity<BarterTransaction> dispute(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.raiseDispute(id));
    }
    
    @PutMapping("/{id}/rate")
    public ResponseEntity<BarterTransaction> rate(@PathVariable Long id, @RequestParam Integer score) {
        return ResponseEntity.ok(transactionService.rateTransaction(id, score));
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BarterTransaction> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.cancelTransaction(id));
    }
}
