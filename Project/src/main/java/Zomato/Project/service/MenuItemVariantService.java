package Zomato.Project.service;

import Zomato.Project.dto.CombineMenuItemAndMenuItemVariantRequestDTO;
import Zomato.Project.entity.MenuItemVariant;
import Zomato.Project.entity.Restaurant;
import Zomato.Project.repository.MenuItemVariantRepository;
import Zomato.Project.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MenuItemVariantService {
    @Autowired
    private MenuItemVariantRepository menuItemVariantRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;

    public String editMenuItemVariant(Long menuItemVariantId, CombineMenuItemAndMenuItemVariantRequestDTO combineMenuItemAndMenuItemVariantRequestDTO) {
        Long restaurantId = combineMenuItemAndMenuItemVariantRequestDTO.getRestaurantId();
        Long menuItemId = combineMenuItemAndMenuItemVariantRequestDTO.getMenuItemId();

        Restaurant restaurant = restaurantRepository.findByIdAndMenuItemListIdAndMenuItemList_MenuItemVariantListId(restaurantId, menuItemId, menuItemVariantId);
        if (restaurant == null) {
            return "does not exist";
        }
        MenuItemVariant existingMenuItemVariant = menuItemVariantRepository.findById(menuItemVariantId).get();

        existingMenuItemVariant.setMenuVariantName(combineMenuItemAndMenuItemVariantRequestDTO.getMenuItemVariantRequestDTO().getMenuVariantName());
        existingMenuItemVariant.setCurrentAvailableInventoryCount(combineMenuItemAndMenuItemVariantRequestDTO.getMenuItemVariantRequestDTO().getCurrentAvailableInventoryCount());
        existingMenuItemVariant.setInventoryManaged(combineMenuItemAndMenuItemVariantRequestDTO.getMenuItemVariantRequestDTO().getInventoryManaged());
        existingMenuItemVariant.setMenuVariantAvailable(combineMenuItemAndMenuItemVariantRequestDTO.getMenuItemVariantRequestDTO().getMenuVariantAvailable());
        existingMenuItemVariant.setMenuVariantPrice(combineMenuItemAndMenuItemVariantRequestDTO.getMenuItemVariantRequestDTO().getMenuVariantPrice());


        menuItemVariantRepository.saveAndFlush(existingMenuItemVariant);

        return "Successfully your Menu item Variant is updated";

    }

    public String deleteMenuItemVariant(Long menuItemVariantId) {
        Optional<MenuItemVariant> existingMenuItemVariant = menuItemVariantRepository.findById(menuItemVariantId);
        if (existingMenuItemVariant.isEmpty()) {
            return "does not exist menu Item variant";
        }
        menuItemVariantRepository.deleteById(menuItemVariantId);
        return "Successfully your Menu item Variant is deleted";
    }
}
