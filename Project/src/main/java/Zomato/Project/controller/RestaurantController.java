package Zomato.Project.controller;

import Zomato.Project.dto.RestaurantRequestDTO;
import Zomato.Project.dto.RestaurantResponseDTO;
import Zomato.Project.entity.Restaurant;
import Zomato.Project.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurant")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<String> addRestaurant(@Valid @RequestBody RestaurantRequestDTO restaurantRequestDTO) {
        String response = restaurantService.addRestaurant(restaurantRequestDTO);
        if (response.equals("Successful is added your restaurant")) {
            return ResponseEntity.status(201).body(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponseDTO> getRestaurant(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurant(id));
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponseDTO>> getAllRestaurant(){
        return ResponseEntity.ok(restaurantService.getAllRestaurant());
    }
}

