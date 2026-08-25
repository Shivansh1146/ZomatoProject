package Zomato.Project.controller;

import Zomato.Project.dto.MenuItemRequestDTO;
import Zomato.Project.service.MenuItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/menuItem")
@CrossOrigin(origins = "*")
public class MenuItemController {
    @Autowired
    private MenuItemService menuItemService;

    @PostMapping
    public ResponseEntity<String> addMenuItem(@Valid @RequestBody MenuItemRequestDTO menuItemRequestDTO) {
        String response = menuItemService.addMenuItem(menuItemRequestDTO);
        if (response.equals("Successfully your Menu item is added")) {
            return ResponseEntity.status(201).body(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/{menuItemId}")
    public ResponseEntity<String> editMenuItem(@PathVariable Long menuItemId, @Valid @RequestBody MenuItemRequestDTO menuItemRequestDTO) {
        String response = menuItemService.editMenuItem(menuItemId, menuItemRequestDTO);
        if (response.equals("Successfully your Menu item is updated")) {
            return ResponseEntity.status(201).body(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/{menuItemId}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long menuItemId) {
        String response = menuItemService.deleteMenuItem(menuItemId);
        if (response.equals("Successfully your Menu item is deleted")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(404).body(response);
    }
}
