package Zomato.Project.controller;

import Zomato.Project.dto.RestaurantRequestDTO;
import Zomato.Project.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/restaurant")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<String> addRestaurant(@Valid @RequestBody RestaurantRequestDTO restaurantRequestDTO) {
        return ResponseEntity.status(201).body(restaurantService.addRestaurant(restaurantRequestDTO));
    }

}
