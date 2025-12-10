package com.andrew.BarterPlatform;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.andrew.BarterPlatform.Service.BarterTransactionService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TransactionScheduler {

	private final BarterTransactionService transService;
	
	@Scheduled(fixedRate = 3600000)
	public void runAutoComplete() {
		transService.autoCompleteTransactions();
	}
	
}
