package com.onlinelearning.online_learning_platform.controller;

import com.onlinelearning.online_learning_platform.entity.Milestone;
import com.onlinelearning.online_learning_platform.service.MilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
public class MilestoneController {
    private final MilestoneService milestoneService;

    // Existing endpoint: returns milestones for a given course
    @GetMapping("/{courseId}")
    public ResponseEntity<List<Milestone>> getMilestones(@PathVariable Long courseId) {
        return ResponseEntity.ok(milestoneService.getMilestonesByCourse(courseId));
    }

    // New default endpoint: returns an error message if no courseId is provided
    @GetMapping
    public ResponseEntity<?> getMilestonesDefault() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Course ID is required. Please use /api/milestones/{courseId} to fetch milestones.");
    }

    // Existing endpoint for adding a milestone for a specific course
    @PostMapping("/{courseId}")
    public ResponseEntity<Milestone> addMilestone(@PathVariable Long courseId, @RequestBody Milestone milestone) {
        return ResponseEntity.ok(milestoneService.addMilestone(courseId, milestone));
    }
}



//package com.onlinelearning.online_learning_platform.controller;
//
//import com.onlinelearning.online_learning_platform.entity.Milestone;
//import com.onlinelearning.online_learning_platform.service.MilestoneService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@CrossOrigin(origins = "http://localhost:3000")
//@RequestMapping("/api/milestones")
//@RequiredArgsConstructor
//public class MilestoneController {
//    private final MilestoneService milestoneService;
//
//    @GetMapping("/{courseId}")
//    public ResponseEntity<List<Milestone>> getMilestones(@PathVariable Long courseId) {
//        return ResponseEntity.ok(milestoneService.getMilestonesByCourse(courseId));
//    }
//
//    @PostMapping("/{courseId}")
//    public ResponseEntity<Milestone> addMilestone(@PathVariable Long courseId, @RequestBody Milestone milestone) {
//        return ResponseEntity.ok(milestoneService.addMilestone(courseId, milestone));
//    }
//}
