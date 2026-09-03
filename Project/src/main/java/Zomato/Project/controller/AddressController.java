package Zomato.Project.controller;

import Zomato.Project.dto.AddressRequestDTO;
import Zomato.Project.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/address")
@CrossOrigin(origins = "*")
public class AddressController {
    @Autowired
    private AddressService addressService;

    @PostMapping("/{userId}")
    public ResponseEntity<String> addAddressInUser(@PathVariable Long userId, @Valid @RequestBody AddressRequestDTO addressRequestDTO) {
        String response = addressService.addAddressInUser(userId, addressRequestDTO);
        if (response.equals("Successfully your address is added ")) {
            return ResponseEntity.status(201).body(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}
