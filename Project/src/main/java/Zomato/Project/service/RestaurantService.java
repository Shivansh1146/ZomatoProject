package Zomato.Project.service;

import Zomato.Project.dto.MenuItemResponseDTO;
import Zomato.Project.dto.MenuItemVariantResponseDTO;
import Zomato.Project.dto.RestaurantRequestDTO;
import Zomato.Project.dto.RestaurantResponseDTO;
import Zomato.Project.entity.Address;
import Zomato.Project.entity.MenuItem;
import Zomato.Project.entity.MenuItemVariant;
import Zomato.Project.entity.Restaurant;
import Zomato.Project.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public String addRestaurant(RestaurantRequestDTO restaurantRequestDTO) {

        Optional<Restaurant> existing = restaurantRepository.findByRestaurantPhoneNumber(restaurantRequestDTO.getRestaurantPhoneNumber());
        if (existing.isPresent()) {
            return "Restaurant Phone number is already exist";
        }
        Restaurant restaurant = convertRestaurantDTOToEntity(restaurantRequestDTO);
        restaurantRepository.save(restaurant);
        return "Successful is added your restaurant";
    }

    private Restaurant convertRestaurantDTOToEntity(RestaurantRequestDTO restaurantRequestDTO) {
        Restaurant restaurant = new Restaurant();

        restaurant.setRestaurantName(restaurantRequestDTO.getRestaurantName());
        restaurant.setRestaurantPhoneNumber(restaurantRequestDTO.getRestaurantPhoneNumber());

        Address address = new Address();

        address.setStreetLine1(restaurantRequestDTO.getStreetLine1());
        address.setStreetLine2(restaurantRequestDTO.getStreetLine2());
        address.setPinCode(restaurantRequestDTO.getPinCode());
        address.setState(restaurantRequestDTO.getState());
        address.setCountry(restaurantRequestDTO.getCountry());
        address.setLatitude(restaurantRequestDTO.getLatitude());
        address.setLongitude(restaurantRequestDTO.getLongitude());

        restaurant.setRestaurantAddress(address);
        return restaurant;
    }

    public RestaurantResponseDTO getRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id).orElse(null);
        if (restaurant == null) {
            return null;
        }
        return convertRestaurantToRestaurantResponseDTO(restaurant);


    }

    private RestaurantResponseDTO convertRestaurantToRestaurantResponseDTO(Restaurant restaurant) {
        RestaurantResponseDTO restaurantResponseDTO = new RestaurantResponseDTO();

        restaurantResponseDTO.setRestaurantName((restaurant.getRestaurantName()));
        restaurantResponseDTO.setRestaurantId(restaurant.getId());
        restaurantResponseDTO.setRestaurantPhoneNumber(restaurant.getRestaurantPhoneNumber());
        restaurantResponseDTO.setCountry(restaurant.getRestaurantAddress().getCountry());
        restaurantResponseDTO.setStreetLine1(restaurant.getRestaurantAddress().getStreetLine1());
        restaurantResponseDTO.setPinCode(restaurant.getRestaurantAddress().getPinCode());
        restaurantResponseDTO.setState(restaurant.getRestaurantAddress().getState());
        restaurantResponseDTO.setStreetLine2(restaurant.getRestaurantAddress().getStreetLine2());

        List<MenuItemResponseDTO> menuItemResponseDTOList = new ArrayList<>();
        List<MenuItem> menuItemList = restaurant.getMenuItemList();


        for (MenuItem menuItem : menuItemList) {

            MenuItemResponseDTO menuItemResponseDTO = new MenuItemResponseDTO();

            menuItemResponseDTO.setMenuItemName(menuItem.getMenuItemName());
            menuItemResponseDTO.setMenuItemDescription(menuItem.getMenuItemDescription());
            menuItemResponseDTO.setMenuItemId(menuItem.getId());
            menuItemResponseDTO.setMenuItemLabel(menuItem.getMenuItemLabel());
            menuItemResponseDTO.setMenuItemType(menuItem.getMenuItemType());


            List<MenuItemVariantResponseDTO> menuItemVariantResponseDTOSList = new ArrayList<>();
            List<MenuItemVariant> menuItemVariantList = menuItem.getMenuItemVariantList();

            for (MenuItemVariant menuItemVariant : menuItemVariantList) {
                MenuItemVariantResponseDTO menuItemVariantResponseDTO = new MenuItemVariantResponseDTO();

                menuItemVariantResponseDTO.setMenuVariantId(menuItemVariant.getId());
                menuItemVariantResponseDTO.setMenuVariantAvailable(menuItemVariant.getMenuVariantAvailable());
                menuItemVariantResponseDTO.setMenuVariantName(menuItemVariant.getMenuVariantName());
                menuItemVariantResponseDTO.setMenuVariantPrice(menuItemVariant.getMenuVariantPrice());

                menuItemVariantResponseDTOSList.add(menuItemVariantResponseDTO);
            }
            menuItemResponseDTO.setMenuItemVariantResponseDTOList(menuItemVariantResponseDTOSList);

            menuItemResponseDTOList.add(menuItemResponseDTO);


        }
        restaurantResponseDTO.setMenuItemResponseDTOList(menuItemResponseDTOList);

        return restaurantResponseDTO;
    }

    public List<RestaurantResponseDTO> getAllRestaurant() {

        List<Restaurant> restaurants = restaurantRepository.findAll();

        List<RestaurantResponseDTO> restaurantResponseDTOList = new ArrayList<>();
        for (Restaurant restaurant : restaurants) {
            RestaurantResponseDTO restaurantResponseDTO = convertRestaurantToRestaurantResponseDTO(restaurant);
            restaurantResponseDTOList.add(restaurantResponseDTO);
        }
        return restaurantResponseDTOList;
    }


    public String deleteRestaurant(Long restaurantId) {
        Optional<Restaurant> existingRestaurant = restaurantRepository.findById(restaurantId);
        if (existingRestaurant.isEmpty()) {
            return "restaurant does not exist";
        }
        restaurantRepository.deleteById(restaurantId);
        return "Successful Restaurant is deleted";
    }

    public String editRestaurant(Long restaurantId, RestaurantRequestDTO restaurantRequestDTO) {
        Optional<Restaurant> checkRestaurant = restaurantRepository.findById(restaurantId);
        if (checkRestaurant.isEmpty()) {
            return "restaurant does not exist ";
        }
        Restaurant existingRestaurant = checkRestaurant.get();

        existingRestaurant.setRestaurantName(restaurantRequestDTO.getRestaurantName());
        existingRestaurant.setRestaurantPhoneNumber(restaurantRequestDTO.getRestaurantPhoneNumber());

        Address existingAddress = existingRestaurant.getRestaurantAddress();

        existingAddress.setStreetLine1(restaurantRequestDTO.getStreetLine1());
        existingAddress.setStreetLine2(restaurantRequestDTO.getStreetLine2());
        existingAddress.setPinCode(restaurantRequestDTO.getPinCode());
        existingAddress.setState(restaurantRequestDTO.getState());
        existingAddress.setCountry(restaurantRequestDTO.getCountry());
        existingAddress.setLongitude(restaurantRequestDTO.getLongitude());
        existingAddress.setLatitude(restaurantRequestDTO.getLatitude());

        restaurantRepository.saveAndFlush(existingRestaurant);
        return "Successful Restaurant is updated";
    }
}
