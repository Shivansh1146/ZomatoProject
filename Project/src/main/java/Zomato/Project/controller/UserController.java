package Zomato.Project.controller;

import Zomato.Project.dto.UserRequestDTO;
import Zomato.Project.dto.UserResponseDTO;
import Zomato.Project.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<String> addUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        String response = userService.addUser(userRequestDTO);
        if (response.equals("Successful user is added")) {
            return ResponseEntity.status(201).body(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        String response = userService.deleteUser(userId);
        if (response.equals("Successful user is deleted")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(404).body(response);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<String> editUser(@PathVariable Long userId, @Valid @RequestBody UserRequestDTO userRequestDTO) {
        String response = userService.editUser(userId, userRequestDTO);
        if (response.equals("Succesfull user is updated")) {
            return ResponseEntity.status(201).body(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getByUserId(@PathVariable Long userId) {
        UserResponseDTO response = userService.getByUserId(userId);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
}
