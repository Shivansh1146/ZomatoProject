package Zomato.Project.controller;

import Zomato.Project.dto.CombineMenuItemAndMenuItemVariantRequestDTO;
import Zomato.Project.dto.MenuItemRequestDTO;
import Zomato.Project.dto.MenuItemVariantRequestDTO;
import Zomato.Project.service.MenuItemVariantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/menuItemVariant")
@CrossOrigin(origins = "*")
public class MenuItemVariantController {
    @Autowired
    private MenuItemVariantService menuItemVariantService;

    @PutMapping("/{menuItemVariantId}")
    public ResponseEntity<String> editMenuItemVariant(@PathVariable Long menuItemVariantId, @Valid @RequestBody CombineMenuItemAndMenuItemVariantRequestDTO combineMenuItemAndMenuItemVariantRequestDTO
    ) {
        String response = menuItemVariantService.editMenuItemVariant(menuItemVariantId, combineMenuItemAndMenuItemVariantRequestDTO);
        if (response.equals("Successfully your Menu item Variant is updated")) {
            return ResponseEntity.status(201).body(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}
