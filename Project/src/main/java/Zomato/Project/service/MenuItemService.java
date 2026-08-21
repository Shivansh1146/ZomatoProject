package Zomato.Project.service;

import Zomato.Project.dto.MenuItemRequestDTO;
import Zomato.Project.dto.MenuItemVariantRequestDTO;
import Zomato.Project.entity.MenuItem;
import Zomato.Project.entity.MenuItemVariant;
import Zomato.Project.entity.Restaurant;
import Zomato.Project.repository.MenuItemRepository;
import Zomato.Project.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {
    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;

    public String addMenuItem(MenuItemRequestDTO menuItemRequestDTO) {
        Optional<Restaurant> checkRestaurantExisting = restaurantRepository.findById(menuItemRequestDTO.getRestaurantId());
        if (checkRestaurantExisting.isEmpty()) {
            return "Restaurant ID does not exist";
        }
        Restaurant restaurant = checkRestaurantExisting.get();
        MenuItem existingMenuItem = menuItemRepository.findByRestaurantAndMenuItemName(restaurant, menuItemRequestDTO.getMenuItemName());
        if (existingMenuItem != null) {
            return "already menu item exist";

        }
        for (MenuItemVariantRequestDTO menuItemVariantRequestDTOList : menuItemRequestDTO.getMenuItemVariantRequestDTOList()) {

            if (Boolean.TRUE.equals(menuItemVariantRequestDTOList.getInventoryManaged()) && menuItemVariantRequestDTOList.getCurrentAvailableInventoryCount() == null) {
                return "inventory count is required when inventory is  managed ";
            }
        }


        MenuItem menuItem = convertDTOToEntity(menuItemRequestDTO, restaurant);
        menuItemRepository.save(menuItem);

        return "Successfully your Menu item is added";

    }

    private MenuItem convertDTOToEntity(MenuItemRequestDTO menuItemRequestDTO, Restaurant restaurant) {
        MenuItem menuItem = new MenuItem();

        menuItem.setMenuItemName(menuItemRequestDTO.getMenuItemName());
        menuItem.setMenuItemDescription(menuItemRequestDTO.getMenuItemDescription());
        menuItem.setMenuItemLabel(menuItemRequestDTO.getMenuItemLabel());
        menuItem.setMenuItemType(menuItemRequestDTO.getMenuItemType());
        menuItem.setRestaurant(restaurant);

        List<MenuItemVariant> menuItemVariantList = new ArrayList<>();

        List<MenuItemVariantRequestDTO> menuItemVariantRequestDTOSByUser = menuItemRequestDTO.getMenuItemVariantRequestDTOList();
        for (MenuItemVariantRequestDTO menuItemVariantRequestDTO : menuItemVariantRequestDTOSByUser) {
            MenuItemVariant menuItemVariant = new MenuItemVariant();

            menuItemVariant.setMenuVariantName(menuItemVariantRequestDTO.getMenuVariantName());
            menuItemVariant.setMenuVariantPrice(menuItemVariantRequestDTO.getMenuVariantPrice());
            menuItemVariant.setMenuVariantAvailable(menuItemVariantRequestDTO.getMenuVariantAvailable());
            menuItemVariant.setInventoryManaged(menuItemVariantRequestDTO.getInventoryManaged());
            if (Boolean.TRUE.equals(menuItemVariantRequestDTO.getInventoryManaged())) {
                menuItemVariant.setCurrentAvailableInventoryCount(menuItemVariantRequestDTO.getCurrentAvailableInventoryCount());
            } else {
                menuItemVariant.setCurrentAvailableInventoryCount(0L);
            }
            menuItemVariant.setMenuItem(menuItem);

            menuItemVariantList.add(menuItemVariant);
        }
        menuItem.setMenuItemVariantList(menuItemVariantList);
        return menuItem;
    }
}
