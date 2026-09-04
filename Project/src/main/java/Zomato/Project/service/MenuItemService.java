package Zomato.Project.service;

import Zomato.Project.dto.MenuItemRequestDTO;
import Zomato.Project.dto.MenuItemVariantRequestDTO;
import Zomato.Project.entity.MenuItem;
import Zomato.Project.entity.MenuItemVariant;
import Zomato.Project.entity.Restaurant;
import Zomato.Project.exception.AlreadyExistException;
import Zomato.Project.exception.InvalidRequestException;
import Zomato.Project.exception.ResourceNotFoundException;
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
            throw new ResourceNotFoundException("Restaurant ID does not exist");
        }

        Restaurant restaurant = checkRestaurantExisting.get();
        Optional<MenuItem> existingMenuItem = menuItemRepository.findByRestaurantAndMenuItemName(restaurant, menuItemRequestDTO.getMenuItemName());
        if (existingMenuItem.isPresent()) {
            throw new AlreadyExistException("already menu item exist");

        }

        if (menuItemRequestDTO.getMenuItemVariantRequestDTOList() != null) {
            for (MenuItemVariantRequestDTO menuItemVariantRequestDTOList : menuItemRequestDTO.getMenuItemVariantRequestDTOList()) {

                if (Boolean.TRUE.equals(menuItemVariantRequestDTOList.getInventoryManaged()) && menuItemVariantRequestDTOList.getCurrentAvailableInventoryCount() == null) {
                    throw new InvalidRequestException("inventory count is required when inventory is  managed ");
                }
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

    public String editMenuItem(Long menuItemId, MenuItemRequestDTO menuItemRequestDTO) {
        Long restaurantId = menuItemRequestDTO.getRestaurantId();

        Restaurant restaurant = restaurantRepository.findByIdAndMenuItemListId(restaurantId, menuItemId);
        if (restaurant == null) {
            throw new ResourceNotFoundException("does not exist");
        }
        Optional<MenuItem> duplicate = menuItemRepository.findByRestaurantAndMenuItemName(restaurant, menuItemRequestDTO.getMenuItemName());

        if (duplicate.isPresent() && !duplicate.get().getId().equals(menuItemId)) {
            throw new AlreadyExistException("already exist menu item");
        }
        MenuItem existingMenuItem = menuItemRepository.findById(menuItemId).get();

        existingMenuItem.setMenuItemName(menuItemRequestDTO.getMenuItemName());
        existingMenuItem.setMenuItemDescription(menuItemRequestDTO.getMenuItemDescription());
        existingMenuItem.setMenuItemType(menuItemRequestDTO.getMenuItemType());
        existingMenuItem.setMenuItemLabel(menuItemRequestDTO.getMenuItemLabel());

        menuItemRepository.saveAndFlush(existingMenuItem);

        return "Successfully your Menu item is updated";


    }

    public String deleteMenuItem(Long menuItemId) {
        Optional<MenuItem> menuItem = menuItemRepository.findById(menuItemId);
        if (menuItem.isEmpty()) {
            throw new ResourceNotFoundException("menu item does not exist");
        }

        menuItemRepository.deleteById(menuItemId);
        return "Successfully your Menu item is deleted";
    }
}
