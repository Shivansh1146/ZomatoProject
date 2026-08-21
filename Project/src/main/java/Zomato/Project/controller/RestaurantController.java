package Zomato.Project.controller;

import Zomato.Project.dto.RestaurantRequestDTO;
import Zomato.Project.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restaurant")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<String> addRestaurant(@Valid @RequestBody RestaurantRequestDTO restaurantRequestDTO) {
        return ResponseEntity.status(201).body(restaurantService.addRestaurant(restaurantRequestDTO));
    }

}
