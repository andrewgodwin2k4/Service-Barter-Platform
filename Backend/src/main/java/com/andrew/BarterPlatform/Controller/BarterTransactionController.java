package com.andrew.BarterPlatform.Controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.andrew.BarterPlatform.Dto.BarterTransactionDto;
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
    
    @GetMapping("/user/{learnerId}")
    public ResponseEntity<List<BarterTransaction>> getUserTransactions(@PathVariable Long learnerId) {
        return ResponseEntity.ok(transactionService.getTransactionsByLearner(learnerId));
    }

    @GetMapping("/requests/{tutorId}")
    public ResponseEntity<List<BarterTransaction>> getTutorRequests(@PathVariable Long tutorId) {
        return ResponseEntity.ok(transactionService.getRequestsForTutor(tutorId));
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
    public ResponseEntity<BarterTransaction> deliver(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.markDelivered(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<BarterTransaction> complete(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.markCompleted(id));
    }

    @PutMapping("/{id}/dispute")
    public ResponseEntity<BarterTransaction> dispute(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.raiseDispute(id));
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BarterTransaction> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.cancelTransaction(id));
    }
}
