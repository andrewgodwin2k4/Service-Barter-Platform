package com.andrew.BarterPlatform.Config;

import com.andrew.BarterPlatform.Entity.User;
import com.andrew.BarterPlatform.Entity.Listing;
import com.andrew.BarterPlatform.Entity.BarterTransaction;
import com.andrew.BarterPlatform.Enum.SkillCategory;
import com.andrew.BarterPlatform.Enum.TransactionStatus;
import com.andrew.BarterPlatform.Repository.UserRepository;
import com.andrew.BarterPlatform.Repository.ListingRepository;
import com.andrew.BarterPlatform.Repository.BarterTransactionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final BarterTransactionRepository transactionRepository;

    public DataInitializer(UserRepository userRepository, ListingRepository listingRepository, BarterTransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.listingRepository = listingRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public void run(String... args) {
        org.springframework.security.crypto.password.PasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        String defaultBcryptPw = encoder.encode("password123");

        User ahmed = new User("ahmed", "ahmed@xerv.dev", defaultBcryptPw, "Ahmed", "Cloud infrastructure specialist and cybersecurity enthusiast.");
        ahmed.setCredits(150);
        ahmed.setAverageRating(4.6);
        ahmed.setTotalRatings(5);

        // Explicitly ensure 'ahmed' exists as requested
        if (userRepository.findByUsername("ahmed").isEmpty()) {
            System.out.println("Adding user 'ahmed' as requested...");
            userRepository.save(ahmed);
            
            // Add a listing for him too
            Listing cloudListing = new Listing();
            cloudListing.setTitle("AWS Cloud Infrastructure Setup");
            cloudListing.setDescription("I will architect and configure your AWS environment using Terraform and best practices for security and scalability.");
            cloudListing.setCategory(SkillCategory.WEB_DEVELOPMENT);
            cloudListing.setCreditValue(25);
            cloudListing.setOwner(ahmed);
            listingRepository.save(cloudListing);

            // Add a transaction for him too
            Optional<User> andrewOpt = userRepository.findByUsername("andrew");
            Optional<Listing> l1Opt = listingRepository.findAll().stream()
                .filter(l -> l.getTitle().contains("Next.js"))
                .findFirst();

            if (andrewOpt.isPresent() && l1Opt.isPresent()) {
                BarterTransaction ahmedTx = createTx(ahmed, andrewOpt.get(), l1Opt.get(), 12, TransactionStatus.COMPLETED, 5, "Ahmed: This code is exactly what I needed for my cloud project!", LocalDateTime.now().minusDays(3));
                transactionRepository.save(ahmedTx);
            }
            
            System.out.println("User 'ahmed', his listing, and his first transaction successfully added!");
        }

        if (userRepository.count() > 1) { // Changed to 1 because 'ahmed' might have just been added
            System.out.println("Database already populated. Skipping massive seed data.");
            return;
        }

        System.out.println("Seeding database with MASSIVE dummy data for Andrew's analytics dashboard...");

        // 1. CREATE USERS
        User andrew = new User("andrew", "andrew@xerv.dev", defaultBcryptPw, "Andrew", "Full-stack developer and AI engineer. Specializing in highly optimized React applications and robust Spring Boot microservices.");
        andrew.setCredits(250);
        andrew.setAverageRating(4.9);
        andrew.setTotalRatings(24);

        User priya = new User("priyasharma", "priya@xerv.dev", defaultBcryptPw, "Priya Sharma", "UI/UX designer focusing on clean SaaS interfaces and mobile-first logic.");
        priya.setCredits(80);
        priya.setAverageRating(4.7);
        priya.setTotalRatings(12);

        User marcus = new User("marcusjones", "marcus@xerv.dev", defaultBcryptPw, "Marcus Jones", "Digital marketing strategist and SEO expert.");
        marcus.setCredits(120);
        marcus.setAverageRating(4.5);
        marcus.setTotalRatings(8);

        User sarah = new User("sarahnguyen", "sarah@xerv.dev", defaultBcryptPw, "Sarah Nguyen", "Freelance video editor and motion graphics artist.");
        sarah.setCredits(90);
        sarah.setAverageRating(5.0);
        sarah.setTotalRatings(15);

        User daniel = new User("danielkim", "daniel@xerv.dev", defaultBcryptPw, "Daniel Kim", "Data analyst and database architect.");
        daniel.setCredits(300);
        daniel.setAverageRating(4.8);
        daniel.setTotalRatings(19);

        User ahmedObj = userRepository.findByUsername("ahmed").orElse(ahmed);

        userRepository.saveAll(Arrays.asList(andrew, priya, marcus, sarah, daniel, ahmedObj));

        // 2. CREATE LISTINGS
        List<Listing> listings = new ArrayList<>();
        
        Listing l1 = new Listing();
        l1.setTitle("Next.js SaaS Landing Page");
        l1.setDescription("I will code a highly responsive, animated landing page using React, Framer Motion, and Tailwind CSS.");
        l1.setCategory(SkillCategory.WEB_DEVELOPMENT);
        l1.setCreditValue(12);
        l1.setOwner(andrew);
        listings.add(l1);

        Listing l2 = new Listing();
        l2.setTitle("Spring Boot REST API");
        l2.setDescription("Fully secure backend architecture including JWT, JPA, and complete Swagger documentation.");
        l2.setCategory(SkillCategory.WEB_DEVELOPMENT);
        l2.setCreditValue(15);
        l2.setOwner(andrew);
        listings.add(l2);

        Listing l3 = new Listing();
        l3.setTitle("Modern Minimalist Logo");
        l3.setDescription("Premium vector logo design shipped with 3 original concepts and a comprehensive brand kit.");
        l3.setCategory(SkillCategory.GRAPHIC_DESIGN);
        l3.setCreditValue(8);
        l3.setOwner(priya);
        listings.add(l3);

        Listing l4 = new Listing();
        l4.setTitle("UI/UX Dashboard Wireframes");
        l4.setDescription("Complete Figma wireframes for your next SaaS dashboard.");
        l4.setCategory(SkillCategory.UI_UX_DESIGN);
        l4.setCreditValue(10);
        l4.setOwner(priya);
        listings.add(l4);

        Listing l5 = new Listing();
        l5.setTitle("Technical SEO Audit");
        l5.setDescription("Complete breakdown of your website's SEO health with actionable improvements.");
        l5.setCategory(SkillCategory.DIGITAL_MARKETING);
        l5.setCreditValue(5);
        l5.setOwner(marcus);
        listings.add(l5);

        Listing l6 = new Listing();
        l6.setTitle("YouTube Video Editing");
        l6.setDescription("Professional dynamic cuts, captions, and sound design for your Vlogs or Code walkthroughs.");
        l6.setCategory(SkillCategory.VIDEO_EDITING);
        l6.setCreditValue(10);
        l6.setOwner(sarah);
        listings.add(l6);

        Listing l7 = new Listing();
        l7.setTitle("PostgreSQL Database Optimization");
        l7.setDescription("I will analyze and restructure your relational database for maximum scale.");
        l7.setCategory(SkillCategory.DATA_ANALYTICS);
        l7.setCreditValue(20);
        l7.setOwner(daniel);
        listings.add(l7);

        Listing l8 = new Listing();
        l8.setTitle("AWS Cloud Infrastructure Setup");
        l8.setDescription("I will architect and configure your AWS environment using Terraform and best practices for security and scalability.");
        l8.setCategory(SkillCategory.WEB_DEVELOPMENT);
        l8.setCreditValue(25);
        l8.setOwner(ahmed);
        listings.add(l8);

        listingRepository.saveAll(listings);

        // 3. CREATE MASSIVE TRANSACTIONS
        List<BarterTransaction> transactions = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // ─── ANDREW SELLING SERVICES (EARNING CREDITS) ───
        
        // Month 0 (This Month)
        transactions.add(createTx(priya, andrew, l1, 12, TransactionStatus.COMPLETED, 5, "Amazing code logic!", now.minusDays(2)));
        transactions.add(createTx(sarah, andrew, l2, 15, TransactionStatus.COMPLETED, 5, "Backend works flawlessly.", now.minusDays(10)));
        transactions.add(createTx(marcus, andrew, l1, 12, TransactionStatus.DELIVERED, null, null, now.minusDays(1)));
        
        // Month -1
        transactions.add(createTx(daniel, andrew, l2, 15, TransactionStatus.COMPLETED, 4, "Good work, minor delay.", now.minusMonths(1).minusDays(5)));
        transactions.add(createTx(priya, andrew, l1, 12, TransactionStatus.AUTO_COMPLETED, null, null, now.minusMonths(1).minusDays(15)));

        // Month -2
        transactions.add(createTx(marcus, andrew, l2, 15, TransactionStatus.COMPLETED, 5, "Perfect implementation.", now.minusMonths(2).minusDays(10)));
        transactions.add(createTx(sarah, andrew, l1, 12, TransactionStatus.COMPLETED, 5, "Saved my startup!", now.minusMonths(2).minusDays(20)));

        // Month -3
        transactions.add(createTx(daniel, andrew, l1, 12, TransactionStatus.AUTO_COMPLETED, null, null, now.minusMonths(3).minusDays(2)));

        // Month -4
        transactions.add(createTx(priya, andrew, l2, 15, TransactionStatus.COMPLETED, 4, "Solid API.", now.minusMonths(4).minusDays(12)));
        transactions.add(createTx(marcus, andrew, l1, 12, TransactionStatus.COMPLETED, 5, "Exceptional.", now.minusMonths(4).minusDays(22)));

        // Month -5
        transactions.add(createTx(sarah, andrew, l2, 15, TransactionStatus.COMPLETED, 5, "Best backend dev on here.", now.minusMonths(5).minusDays(8)));


        // ─── ANDREW BUYING SERVICES (SPENDING CREDITS) ───
        
        // Month 0
        transactions.add(createTx(andrew, priya, l3, 8, TransactionStatus.COMPLETED, 5, "Super sleek logo.", now.minusDays(5)));
        transactions.add(createTx(andrew, sarah, l6, 10, TransactionStatus.ACCEPTED, null, null, now.minusDays(1)));

        // Month -1
        transactions.add(createTx(andrew, daniel, l7, 20, TransactionStatus.COMPLETED, 4, "Great optimization.", now.minusMonths(1).minusDays(12)));
        
        // Month -2
        transactions.add(createTx(andrew, marcus, l5, 5, TransactionStatus.COMPLETED, 3, "Very generic audit.", now.minusMonths(2).minusDays(4)));
        transactions.add(createTx(andrew, priya, l4, 10, TransactionStatus.AUTO_COMPLETED, null, null, now.minusMonths(2).minusDays(18)));

        // Month -3
        transactions.add(createTx(andrew, sarah, l6, 10, TransactionStatus.COMPLETED, 5, "Awesome video.", now.minusMonths(3).minusDays(25)));

        // Month -4
        transactions.add(createTx(andrew, daniel, l7, 20, TransactionStatus.AUTO_COMPLETED, null, null, now.minusMonths(4).minusDays(10)));

        // Month -5
        transactions.add(createTx(andrew, marcus, l5, 5, TransactionStatus.COMPLETED, 4, "Good audit insights.", now.minusMonths(5).minusDays(3)));

        
        // ─── RANDOM OTHERS (To populate Listings UI with ratings) ───
        transactions.add(createTx(sarah, marcus, l5, 5, TransactionStatus.COMPLETED, 4, "Helpful.", now.minusDays(4)));
        transactions.add(createTx(daniel, priya, l3, 8, TransactionStatus.COMPLETED, 5, "Great logo.", now.minusDays(10)));


        transactionRepository.saveAll(transactions);
        System.out.println("Massive synthetic data payload fully injected!");
    }

    private BarterTransaction createTx(User buyer, User provider, Listing listing, int credits, TransactionStatus status, Integer rating, String note, LocalDateTime time) {
        BarterTransaction tx = new BarterTransaction();
        tx.setBuyer(buyer);
        tx.setProvider(provider);
        tx.setListing(listing);
        tx.setCredits(credits);
        tx.setStatus(status);
        tx.setRating(rating);
        tx.setCreatedAt(time);
        tx.setUpdatedAt(time);
        
        if(status == TransactionStatus.DELIVERED || status == TransactionStatus.COMPLETED || status == TransactionStatus.AUTO_COMPLETED) {
            tx.setDeliveredAt(time.minusHours(48));
            tx.setDeliveryLink("https://cloud.xerv.dev/deliverable/" + System.nanoTime());
            tx.setDeliveryNote(note != null ? note : "Here is my final delivery. Hope you like it!");
        }
        
        return tx;
    }
}
