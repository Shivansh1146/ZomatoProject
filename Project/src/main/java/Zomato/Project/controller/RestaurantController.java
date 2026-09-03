package Zomato.Project.controller;

import Zomato.Project.dto.RestaurantRequestDTO;
import Zomato.Project.dto.RestaurantResponseDTO;
import Zomato.Project.service.RestaurantService;
import jakarta.validation.Valid;
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
    public ResponseEntity<RestaurantResponseDTO> addRestaurant(@Valid @RequestBody RestaurantRequestDTO restaurantRequestDTO) {
//        String response = restaurantService.addRestaurant(restaurantRequestDTO);
//        if (response.equals("Successful is added your restaurant")) {
//            return ResponseEntity.status(201).body(response);
//        }
//        return ResponseEntity.badRequest().body(response);
        return ResponseEntity.status(201).body(restaurantService.addRestaurant(restaurantRequestDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponseDTO> getRestaurant(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurant(id));
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponseDTO>> getAllRestaurant() {
        return ResponseEntity.ok(restaurantService.getAllRestaurant());
    }

    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<String> deleteRestaurant(@PathVariable Long restaurantId) {
        String response = restaurantService.deleteRestaurant(restaurantId);
        if (response.equals("Successful Restaurant is deleted")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(404).body(response);
    }

    @PutMapping("/{restaurantId}")
    public ResponseEntity<String> editRestaurant(@PathVariable Long restaurantId, @Valid @RequestBody RestaurantRequestDTO restaurantRequestDTO) {
        String response = restaurantService.editRestaurant(restaurantId, restaurantRequestDTO);
        if (response.equals("Successful Restaurant is updated")) {
            return ResponseEntity.status(201).body(response);
        }
        return ResponseEntity.status(404).body(response);
    }
}

